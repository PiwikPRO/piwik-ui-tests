/*!
 * Piwik - Web Analytics
 *
 * chai assertion extensions
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

var fs = require('fs'),
    PageRenderer = require('./page-renderer.js').PageRenderer,
    AssertionError = chai.AssertionError;

// add screenshot keyword to `expect`
expect.screenshot = function (file, prefix) {
    if (!prefix) {
        prefix = app.runner.suite.title; // note: runner is made global by run-tests.js
    }

    return chai.expect(prefix + '_' + file);
};

function getPageLogsString(pageLogs, indent) {
    var result = "";
    if (pageLogs.length) {
        result = "\n\n" + indent + "Rendering logs:\n";
        pageLogs.forEach(function (message) {
            result += indent + "  " + message.replace(/\n/g, "\n" + indent + "  ") + "\n";
        });
        result = result.substring(0, result.length - 1);
    }
    return result;
}

// add capture assertion
var pageRenderer = new PageRenderer(path.join(config.piwikUrl, "tests", "PHPUnit", "proxy"));
chai.Assertion.addChainableMethod('capture', function () {
    var compareAgainst = this.__flags['object'];
    if (arguments.length == 2) {
        var screenName = compareAgainst,
            pageSetupFn = arguments[0],
            done = arguments[1];
    } else {
        var screenName = app.runner.suite.title + "_" + arguments[0],
            pageSetupFn = arguments[1],
            done = arguments[2];
    }

    if (!(done instanceof Function)) {
        throw new Error("No 'done' callback specified in capture assertion.");
    }

    var screenshotFileName = screenName + '.png',
        expectedScreenshotPath = path.join(config.expectedScreenshotsDir, compareAgainst + '.png'),
        processedScreenshotPath = path.join(config.processedScreenshotsDir, screenshotFileName);

    pageSetupFn(pageRenderer);

    var timeout = setTimeout(function () {
        pageRenderer.abort();

        done(new Error("Screenshot load timeout."));
    }, 120 * 1000);

    try {
        pageRenderer.capture(processedScreenshotPath, function (err) {
            if (pageRenderer.aborted) {
                return;
            }

            clearTimeout(timeout);

            if (err) {
                done(err);
                return;
            }

            var testInfo = {
                name: screenName,
                processed: fs.isFile(processedScreenshotPath) ? processedScreenshotPath : null,
                expected: fs.isFile(expectedScreenshotPath) ? expectedScreenshotPath : null
            };

            var fail = function (message) {
                app.diffViewerGenerator.failures.push(testInfo);

                var indent = "     ";
                var failureInfo = message + "\n";
                failureInfo += indent + "Url to reproduce: " + pageRenderer.getCurrentUrl() + "\n";
                failureInfo += indent + "Generated screenshot: " + testInfo.processed + "\n";
                failureInfo += indent + "Expected screenshot: " + testInfo.expected + "\n";
                failureInfo += indent + "Screenshot diff: " + app.diffViewerGenerator.getDiffPath(testInfo);

                failureInfo += getPageLogsString(pageRenderer.pageLogs, indent);

                error = new AssertionError(message);

                // stack traces are useless so we avoid the clutter w/ this
                error.stack = failureInfo;

                done(error);
            };

            if (!testInfo.processed) {
                fail("Failed to generate screenshot to " + screenshotFileName + ".");
                return;
            }

            if (!testInfo.expected) {
                fail("No expected screenshot found for " + screenshotFileName + ".");
                return;
            }

            var expected = fs.read(expectedScreenshotPath),
                processed = fs.read(processedScreenshotPath);

            if (expected != processed) {
                fail("Processed screenshot does not match expected for " + screenshotFileName + ".");
                return;
            }

            if (options['print-logs']) {
                console.log(getPageLogsString(pageRenderer.pageLogs, "     "));
            }

            done();
        });
    } catch (ex) {
        var err = new Error(ex.message);
        err.stack = ex.message;
        done(err);
    }
});