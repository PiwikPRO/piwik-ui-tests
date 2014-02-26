/*!
 * Piwik - Web Analytics
 *
 * UI tests config
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

// no path module in phantomjs
var path = {
    join: function () {
        return Array.prototype.join.call(arguments, "/").replace(/[\\\/]{2,}/, "/");
    }
};

// required modules
var fs = require("fs"),
    config = require("./config"),
    sprintf = require('./support/sprintf').sprintf;

// phantomjs does not have Function.prototype.bind
Function.prototype.bind = function () {
    var f = this,
        boundArguments = [],
        thisArg = arguments[0];

    for (var i = 1; i < arguments.length; ++i) {
        boundArguments.push(arguments[i]);
    }

    return function () {
        var args = [].concat(boundArguments);
        Array.prototype.push.apply(args, arguments);

        return f.apply(thisArg, args);
    };
};

// phantomjs console.log/console.error must support sprintf params for mocha
var sprintfWrappedFunc = function (original) {
    return function () {
        var arrayArgs = [];
        for (var i = 0; i < arguments.length; ++i) {
            arrayArgs.push(arguments[i]);
        }

        if (arrayArgs.length > 0) {
            if (typeof arrayArgs[0] === 'undefined') {
                arrayArgs[0] = 'undefined';
            } else {
                arrayArgs[0] = arrayArgs[0].toString();
            }
        }

        var message = arrayArgs[0];
        try {
            message = sprintf.apply(null, arrayArgs);
        } catch (e) {
            // ignore
        }

        original.call(console, message);
    };
};

console.log = sprintfWrappedFunc(console.log);
console.error = sprintfWrappedFunc(console.error);

// paths
var __dirname = phantom.libraryPath,
    testsLibDir = path.join(__dirname, "..", "..", "lib"),
    mochaPath = path.join(testsLibDir, config.mocha, "mocha.js"),
    chaiPath = path.join(testsLibDir, config.chai, "chai.js");

// TODO: organize this file more (move more code to support)
var PIWIK_INCLUDE_PATH = path.join(__dirname, '..', '..', '..');

// parse command line arguments
var options = require('./support/parse-cli-args').parse();

if (options['help']) {
    console.log("Usage: phantomjs run-tests.js [options] [test-files]");
    console.log();
    console.log("Available options:");
    console.log("  --help:                 Prints this message.");
    console.log("  --persist-fixture-data: Persists test data in a database and does not execute tear down.");
    console.log("                          After the first run, the database setup will not be called, which");
    console.log("                          Makes running tests faster.");
    console.log("  --keep-symlinks:        If supplied, the recursive symlinks created in tests/PHPUnit/proxy");
    console.log("                          aren't deleted after tests are run. Specify this option if you'd like");
    console.log("                          to view pages phantomjs captures in a browser.");
    console.log("  --print-logs:           Prints webpage logs even if tests succeed.");

    phantom.exit(0);
}

// make sure script works wherever it's executed from
fs.changeWorkingDirectory(__dirname);

// load mocha + chai
phantom.injectJs(mochaPath);
phantom.injectJs(chaiPath);

// setup mocha (add stdout.write function & configure style + reporter)
mocha.constructor.process.stdout = {
    write: function (data) {
        fs.write("/dev/stdout", data, "w");
    }
};

mocha.setup({
    ui: 'bdd',
    reporter: config.reporter,
    bail: false
});

// setup chai
var expect = chai.expect; // appears as global in require-d files

require('./support/chai-extras');

var TestingEnvironment = require('./support/test-environment').TestingEnvironment,
    testEnvironment = new TestingEnvironment();

// require all test modules
if (options.tests.length) {
    var testFiles = options.tests;
} else {
    var testFiles = fs.list(__dirname).filter(function (item) {
        var file = path.join(__dirname, item);
        return item != "config.js" && item != "run-tests.js" && fs.isFile(file) && file.slice(-3) == '.js';
    });
}

testFiles.forEach(function (path) {
    require('./' + path);
});

// make sure all necessary directories exist (symlinks handled by PHP since phantomjs can't create any)
var dirsToCreate = [
    config.expectedScreenshotsDir,
    config.processedScreenshotsDir,
    config.screenshotDiffDir,
    path.join(__dirname, '../../../tmp/sessions')
];

dirsToCreate.forEach(function (path) {
    if (!fs.isDirectory(path)) {
        fs.makeTree(path);
    }
});

// remove existing diffs
fs.list(config.screenshotDiffDir).forEach(function (item) {
    var file = path.join(config.screenshotDiffDir, item);
    if (fs.exists(file)
        && item.slice(-4) == '.png'
    ) {
        fs.remove(file);
    }
});

function setupDatabase() {
    console.log("Setting up database...");

    var setupFile = path.join("./support", "setupDatabase.php"),
        processArgs = [setupFile, "--server=" + JSON.stringify(config.phpServer)];

    if (options['persist-fixture-data']) {
        processArgs.push('--persist-fixture-data');
    }

    var child = require('child_process').spawn(config.php, processArgs);

    child.stdout.on("data", function (data) {
        fs.write("/dev/stdout", data, "w");
    });

    child.stderr.on("data", function (data) {
        fs.write("/dev/stderr", data, "w");
    });

    child.on("exit", function (code) {
        if (code) {
            console.log("\nERROR: Failed to setup database!");
            phantom.exit(-1);
        } else {
            runTests();
        }
    });
}

var runner,
    DiffViewerGenerator = require('./support/diff-viewer').DiffViewerGenerator,
    diffViewerGenerator = new DiffViewerGenerator(runner, config.screenshotDiffDir);

function runTests() {
    // run tests
    runner = mocha.run(function () {
        // remove symlinks
        if (!options['keep-symlinks']) {
            var symlinks = ['libs', 'plugins', 'tests'];

            symlinks.forEach(function (item) {
                var file = path.join('..', 'proxy', item);
                if (fs.exists(file)) {
                    fs.remove(file);
                }
            });
        }

        // build diffviewer
        diffViewerGenerator.checkImageMagickCompare(function () {
            diffViewerGenerator.generate(function () {
                if (options['persist-fixture-data']) {
                    finish();
                } else {
                    // teardown database
                    tearDownDatabase();
                }
            });
        });
    });
}

function tearDownDatabase() {
    console.log("Tearing down database...");

    var teardownFile = path.join("./support", "teardownDatabase.php"),
        child = require('child_process').spawn(config.php, [teardownFile, "--server=" + JSON.stringify(config.phpServer)]);

    child.stdout.on("data", function (data) {
        fs.write("/dev/stdout", data, "w");
    });

    child.stderr.on("data", function (data) {
        fs.write("/dev/stderr", data, "w");
    });

    child.on("exit", function (code) {
        if (code) {
            console.log("\nERROR: Failed to teardown database!");
            phantom.exit(-2);
        } else {
            finish();
        }
    });
}

function finish() {
    phantom.exit(runner.failures);
}

setupDatabase();