/*!
 * Piwik - Web Analytics
 *
 * Installation screenshot tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("Updater", function () {
    this.timeout(0);

    this.fixture = "Piwik\\Tests\\Fixtures\\UpdaterTestFixture";

    it("should start the updater when an old version of Piwik is detected in the DB", function (done) {
        expect.screenshot("main").to.be.capture(function (page) {
            page.load("");
        }, done);
    });

    it("should show the donation form when the update process is complete", function (done) {
        expect.screenshot("updated").to.be.capture(function (page) {
            page.click('.submit');
        }, done);
    });

    it("should continue to Piwik when 'continue to Piwik' is clicked", function (done) {
        expect.screenshot("done").to.be.capture(function (page) {
            page.click('.submit');
            page.evaluate(function () {
                $('#widgetLivewidget').hide();
                $('.jqplot-xaxis').hide(); // xaxis will change every day so hide it
            });
        }, done);
    });
});