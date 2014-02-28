/*!
 * Piwik - Web Analytics
 *
 * Dashboard manager screenshot tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("DashboardManager", function () {
    this.timeout(0);

    var url = "?module=Widgetize&action=iframe&moduleToWidgetize=Dashboard&actionToWidgetize=getDashboardSettingsControl&"
            + "&idSite=1&period=day&date=2012-01-01&includeWidgetFactory=1";

    it("should load correctly", function (done) {
        expect.screenshot("loaded").to.be.capture(function (page) {
            page.load(url);
        }, done);
    });

    it("should expand when clicked", function (done) {
        expect.screenshot("expanded").to.be.capture(function (page) {
            page.click('.dashboard-manager');
        }, done);
    });

    it("should show widget for a category when category label hovered", function (done) {
        expect.screenshot("widget_list_shown").to.be.capture(function (page) {
            page.mouseMove('.widgetpreview-categorylist>li:contains(Live!)'); // have to mouse move twice... otherwise Live! will just be highlighted
            page.mouseMove('.widgetpreview-categorylist>li:contains(Visits Summary)');
        }, done);
    });

    it("should load a widget preview when a widget is hovered", function (done) {
        expect.screenshot("widget_preview").to.be.capture(function (page) {
            page.mouseMove('.widgetpreview-widgetlist>li:contains(Visits Over Time)');
        }, done);
    });

    it("should close the manager when a widget is selected", function (done) {
        expect.screenshot("loaded").to.be.capture("widget_selected", function (page) {
            page.click('.widgetpreview-widgetlist>li:contains(Visits Over Time)');
        }, done);
    });
});