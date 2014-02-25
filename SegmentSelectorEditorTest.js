/*!
 * Piwik - Web Analytics
 *
 * ViewDataTable screenshot tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("SegmentSelectorEditorTest", function () {
    this.timeout(0);

    var url = "?module=Widgetize&action=iframe&moduleToWidgetize=SegmentEditor&actionToWidgetize=getSelector"
            + "&idSite=1&period=year&date=2012-08-09";

    it("should load correctly", function (done) {
        expect.screenshot("0_initial").to.be.capture(function (page) {
            page.load(url);
        }, done);
    });

    it("should open selector when control clicked", function (done) {
        expect.screenshot("1_selector_open").to.be.capture(function (page) {
            page.click('.segmentationContainer');
        }, done);
    });

    it("should open segment editor when edit link clicked for existing segment", function (done) {
        expect.screenshot("2_segment_editor_update").to.be.capture(function (page) {
            page.click('.segmentList .editSegment');
        }, done);
    });

    it("should start editing segment name when segment name edit link clicked", function (done) {
        expect.screenshot("3_segment_editor_edit_name").to.be.capture(function (page) {
            page.click('.segmentEditorPanel .editSegmentName');
        }, done);
    });

    it("should expand segment dimension category when category name clicked in segment editor", function (done) {
        expect.screenshot("4_segment_editor_expanded_dimensions").to.be.capture(function (page) {
            page.click('.segmentEditorPanel .metric_category:contains(Actions)');
        }, done);
    });

    it("should search segment dimensions when text entered in dimension search input", function (done) {
        expect.screenshot("5_segment_editor_search_dimensions").to.be.capture(function (page) {
            page.sendKeys('.segmentEditorPanel .segmentSearch', 'page title');
        }, done);
    });

    it("should change segment when another available segment clicked in segment editor's available segments dropdown", function (done) {
        expect.screenshot("6_segment_editor_different").to.be.capture(function (page) {
            page.click('.available_segments a.dropList');
            page.click('li.ui-menu-item a:contains(Add new segment)');
        }, done);
    });

    it("should close the segment editor when the close link is clicked", function (done) {
        expect.screenshot("7_segment_editor_closed").to.be.capture(function (page) {
            page.click('.segmentEditorPanel .segment-footer .close');
        }, done);
    });

    it("should open blank segment editor when create new segment link is clicked", function (done) {
        expect.screenshot("8_segment_editor_create").to.be.capture(function (page) {
            page.click('.segmentationContainer');
            page.click('.add_new_segment');
        }, done);
    });
});