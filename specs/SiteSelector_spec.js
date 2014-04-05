/*!
 * Piwik - Web Analytics
 *
 * Site selector screenshot tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("SiteSelector", function () {
    this.timeout(0);

    var url = "?module=Widgetize&action=iframe&moduleToWidgetize=CoreHome&actionToWidgetize=getSiteSelector&"
            + "&idSite=1&period=year&date=2012-08-09";

    it("should load correctly", function (done) {
        expect.screenshot("loaded").to.be.capture(function (page) {
            page.load(url);
        }, done);
    });

    it("should display expanded when clicked", function (done) {
        expect.screenshot("expanded").to.be.capture(function (page) {
            page.click('.sites_autocomplete');
        }, done);
    });

    it("should show no results when search returns no results", function (done) {
        expect.screenshot("search_no_results").to.be.capture(function (page) {
            page.sendKeys(".websiteSearch", "abc");
        }, done);
    });

    it("should search when one character typed into search input", function (done) {
        expect.screenshot("search_one_char").to.be.capture(function (page) {
            page.click('.reset');
            page.sendKeys(".websiteSearch", "s");
        }, done);
    });

    it("should search again when second character typed into search input", function (done) {
        expect.screenshot("search_two_chars").to.be.capture(function (page) {
            page.sendKeys(".websiteSearch", "st");
            page.wait(1000);
        }, done);
    });

    it("should change the site when a site is selected", function (done) {
        expect.screenshot("site_selected").to.be.capture(function (page) {
            page.click(".custom_select_ul_list>li:visible");
        }, done);
    });
});