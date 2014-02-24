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
chai.expect.screenshot = function (file) {
    return chai.expect(file);
};

// add capture assertion
var pageRenderer = new PageRenderer(path.join(config.piwikUrl, "tests", "PHPUnit", "proxy"));
chai.Assertion.addChainableMethod('capture', function (pageSetupFn, done) {
    if (!(done instanceof Function)) {
        throw new Error("No 'done' callback specified in capture assertion.");
    }

    var outputPrefix = runner.suite.title, // note: runner is made global by run-tests.js

        screenName = outputPrefix + '_' + this.__flags['object'],

        screenshotFileName = screenName + '.png',
        expectedScreenshotPath = path.join(config.expectedScreenshotsDir, screenshotFileName),
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
                diffViewerGenerator.failures.push(testInfo);

                var indent = "     ";
                var failureInfo = message + "\n";
                failureInfo += indent + "Url to reproduce: " + pageRenderer.getCurrentUrl() + "\n";
                failureInfo += indent + "Generated screenshot: " + testInfo.processed + "\n";
                failureInfo += indent + "Expected screenshot: " + testInfo.expected + "\n";
                failureInfo += indent + "Screenshot diff: " + diffViewerGenerator.getDiffPath(testInfo);

                if (pageRenderer.pageLogs.length) {
                    failureInfo += "\n\n" + indent + "Rendering logs:\n";
                    pageRenderer.pageLogs.forEach(function (message) {
                        failureInfo += indent + "  " + message + "\n";
                    });
                    failureInfo = failureInfo.substring(0, failureInfo.length - 1);
                }

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

            done();
        });
    } catch (ex) {
        var err = new Error(ex.message);
        err.stack = ex.message;
        done(err);
    }
});