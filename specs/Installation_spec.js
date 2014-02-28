/*!
 * Piwik - Web Analytics
 *
 * Installation screenshot tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("Installation", function () {
    this.timeout(0);

    afterEach(function () {
        testEnvironment.configFileLocal = null;
        testEnvironment.save();
    });

    it("should display an error message when trying to access a resource w/o a config.ini.php file", function (done) {
        testEnvironment.configFileLocal = "/non/existing/location";
        testEnvironment.save();

        expect.screenshot("access_no_config").to.be.capture(function (page) {
            page.load("index.php?module=CoreHome&action=index");
        }, done);
    });

    // TODO: fill out rest of installation test
});