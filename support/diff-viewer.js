/*!
 * Piwik - Web Analytics
 *
 * Image diff & HTML diff viewer generation.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

var DiffViewerGenerator = function (runner, diffDir) {
    this.runner = runner;
    this.diffDir = diffDir;
    this.outputPath = path.join(diffDir, 'diffviewer.html');
    this.failures = [];
    this.isCompareAvailable = true;
};

DiffViewerGenerator.prototype.checkImageMagickCompare = function (callback) {
    var self = this;

    var child = require('child_process').spawn('compare', '--help');
    child.on("exit", function (code) {
        self.isCompareAvailable = code == 0 || code == 1;

        if (!self.isCompareAvailable) {
            console.log("Cannot find ImageMagick compare utility, no diffs will be created.");
        }

        callback();
    });
};

DiffViewerGenerator.prototype.getDiffPath = function (testInfo) {
    return path.join(this.diffDir, testInfo.name + '.png');
};

DiffViewerGenerator.prototype.generate = function (callback) {
    if (this.failures.length == 0) {
        return callback();
    }

    console.log("Generating diffs...");

    var self = this;
    this.generateDiffs(function () {
        var diffViewerContent = "<html>\
<head></head>\
<body>\
<h1>Screenshot Test Failures</h1>\
<table>\
    <tr>\
        <th>Name</th>\
        <th>Expected</th>\
        <th>Processed</th>\
        <th>Difference</th>\
    </tr>";

        for (var i = 0; i != self.failures.length; ++i) {
            var entry = self.failures[i];

            if (entry.expected) {
                entry.expectedUrl = 'https://raw.github.com/piwik/piwik-ui-tests/master/expected-ui-screenshots/'
                                  + entry.name + '.png';
            }

            if (entry.processed) {
                entry.processedUrl = '../processed-ui-screenshots/' + entry.name + '.png';
            }

            diffViewerContent += '\
    <tr>\
        <td>' + entry.name + '</td>\
        <td>' + (entry.expected ? ('<a href="' + entry.expectedUrl + '">Expected</a>') : '<em>Not found</em>') + '</td>\
        <td>' + (entry.processed ? ('<a href="' + entry.processedUrl + '">Processed</a>') : '<em>Not found</em>') + '</td>\
        <td>' + (entry.diffUrl ? ('<a href="' + entry.diffUrl + '">Difference</a>') : '<em>Could not create diff.</em>') + '</td>\
    </tr>';
        }

        diffViewerContent += '\
</table>\
</body>\
</html>';

        fs.write(self.outputPath, diffViewerContent, "w");

        console.log("Failures encountered. View all diffs at: " + self.outputPath);
        console.log();
        console.log("If processed screenshots are correct, you can copy the generated screenshots to the expected "
                  + "screenshot folder.");
        console.log();
        console.log("*** IMPORTANT *** In your commit message, explain the cause of the difference in rendering so other "
                  + "Piwik developers will be aware of it.");

        callback();
    });
};

DiffViewerGenerator.prototype.generateDiffs = function (callback, i) {
    i = i || 0;

    if (i >= this.failures.length
        || !this.isCompareAvailable
    ) {
        callback();
        return;
    }

    var entry = this.failures[i];

    if (entry.expected
        && entry.processed
    ) {
        var diffPath = this.getDiffPath(entry);

        var child = require('child_process').spawn('compare', [entry.expected, entry.processed, diffPath]);

        child.stdout.on("data", function (data) {
            fs.write("/dev/stdout", data, "w");
        });

        child.stderr.on("data", function (data) {
            fs.write("/dev/stderr", data, "w");
        });

        var self = this;
        child.on("exit", function (code) {
            if (!code) {
                entry.diffUrl = entry.name + '.png';
            }

            self.generateDiffs(callback, i + 1);
        });
    } else {
        this.generateDiffs(callback, i + 1);
    }
};

exports.DiffViewerGenerator = DiffViewerGenerator;