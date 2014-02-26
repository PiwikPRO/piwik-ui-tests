/*!
 * Piwik - Web Analytics
 *
 * ViewDataTable screenshot tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("ActionsDataTable", function () {
    this.timeout(0);

    var url = "?module=Widgetize&action=iframe&idSite=1&period=year&date=2012-08-09&moduleToWidgetize=Actions&actionToWidgetize=getPageUrls";

    it("should load correctly", function (done) {
        expect.screenshot('initial').to.be.capture(function (page) {
            page.load(url);
        }, done);
    });

    it("should sort column correctly when column header clicked", function (done) {
        expect.screenshot('column_sorted').to.be.capture(function (page) {
            page.click('th#avg_time_on_page');
        }, done);
    });

    it("should load subtables correctly when row clicked", function (done) {
        expect.screenshot('subtables_loaded').to.be.capture(function (page) {
            page.click('tr.subDataTable:first');
            page.click('tr.subDataTable:eq(2)');
        }, done);
    });

    it("should flatten table when flatten link clicked", function (done) {
        expect.screenshot('flattened').to.be.capture(function (page) {
            page.mouseMove('.tableConfiguration');
            page.click('.dataTableFlatten');
        }, done);
    });

    it("should exclude low population rows when exclude low population link clicked", function (done) {
        expect.screenshot('exclude_low_population').to.be.capture(function (page) {
            page.mouseMove('.tableConfiguration');
            page.click('.dataTableExcludeLowPopulation');
        }, done);
    });

    it("should load normal view when switch to view hierarchical view link is clicked", function (done) {
        expect.screenshot('unflattened').to.be.capture(function (page) {
            page.mouseMove('.tableConfiguration');
            page.click('.dataTableFlatten');
        }, done);
    });

    it("should display pageview percentages when hovering over pageviews column", function (done) {
        expect.screenshot('pageview_percentages').to.be.capture(function (page) {
            page.mouseMove('tr:eq(2) td.column:first');
        }, done);
    });

    it("should display unique pageview percentages when hovering over unique pageviews column", function (done) {
        expect.screenshot('unique_pageview_percentages').to.be.capture(function (page) {
            page.mouseMove('tr:eq(2) td.column:eq(1)');
        }, done);
    });

    it("should search through table when search input entered and search button clicked", function (done) {
        expect.screenshot('search').to.be.capture(function (page) {
            page.sendKeys('.dataTableSearchPattern>input[type=text]', 'i');
            page.click('.dataTableSearchPattern>input[type=submit]');
        }, done);
    });
});