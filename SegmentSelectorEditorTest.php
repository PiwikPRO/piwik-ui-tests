<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Tests SegmentSelector & SegmentEditor behavior.
 * 
 * Uses slimerjs or phantomjs.
 */
class SegmentSelectorEditorTest extends UIUnitTest
{
    public static $fixture = null; // initialized below class definition    

    public static function getUrlToTest()
    {
        return "?module=Widgetize&action=iframe&moduleToWidgetize=SegmentEditor&actionToWidgetize=getSelector"
             . "&idSite=1&period=year&date=2012-08-09";
    }

    public static function getScreensToCapture()
    {
        $result = array();

        // initial load screenshot
        $result[] = array('0_initial', '');

        // open the selector
        $result[] = array('1_selector_open', "page.click('.segmentationContainer');");

        // open segment editor for existing
        $result[] = array('2_segment_editor_update', "page.click('.segmentList .editSegment');");

        // edit segment name
        $result[] = array('3_segment_editor_edit_name', "page.click('.segmentEditorPanel .editSegmentName');");

        // show segment dimension list
        $result[] = array('4_segment_editor_expanded_dimensions',
            "page.click('.segmentEditorPanel .metric_category:contains(Actions)');");

        // search segment dimensions
        $result[] = array('5_segment_editor_search_dimensions',
            "page.sendKeys('.segmentEditorPanel .segmentSearch', 'page title');");

        // change segment being updated
        $result[] = array('6_segment_editor_different', "page.click('.available_segments a.dropList');
                                                         page.click('li.ui-menu-item a:contains(Add new segment)');");

        // closed editor
        $result[] = array('7_segment_editor_closed', "page.click('.segmentEditorPanel .segment-footer .close');");

        // open segment editor for new
        $result[] = array('8_segment_editor_create', "page.click('.segmentationContainer');
                                                      page.click('.add_new_segment');");

        return $result;
    }

    /**
     * @group UI
     * @group SegmentSelectorEditorTest
     * @dataProvider getScreensToCapture
     */
    public function testUIUrl($name, $js)
    {
        $this->compareScreenshot($name);
    }
}

SegmentSelectorEditorTest::$fixture = new Test_Piwik_Fixture_OmniFixture();