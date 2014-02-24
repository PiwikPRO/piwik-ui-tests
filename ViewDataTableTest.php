<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Tests ViewDataTable behavior.
 * 
 * Uses slimerjs or phantomjs.
 */
class ViewDataTableTest extends UIUnitTest
{
    public static $fixture = null; // initialized below class definition    

    public static function getUrlToTest()
    {
        return "?module=Widgetize&action=iframe&moduleToWidgetize=Referrers&idSite=1&period=year&date=2012-08-09&"
             . "actionToWidgetize=getKeywords&viewDataTable=table&filter_limit=5";
    }

    public static function getScreensToCapture()
    {
        $result = array();

        // initial load screenshot
        $result[] = array('0_initial', '');

        // load all columns table
        $result[] = array('1_all_columns', "page.click('.tableIcon[data-footer-icon-id=tableAllColumns]');");

        // sort a column
        $result[] = array('2_column_sorted_desc', "page.click('th#nb_actions');");
        $result[] = array('3_column_sorted_asc', "page.click('th#nb_actions');");

        // exclude low population
        $result[] = array('4_exclude_low_population', "page.mouseMove('.tableConfiguration');
                                                       setTimeout(function () {page.click('.dataTableExcludeLowPopulation');}, 1000);");

        // load goals table
        $result[] = array('5_goals', "page.click('.tableIcon[data-footer-icon-id=tableGoals]');");

        // load bar graph
        $result[] = array('6_bar_graph', "page.mouseMove('.tableIconsGroup:nth-child(2)');
                                          page.click('.tableIcon[data-footer-icon-id=graphVerticalBar]');");

        // load pie graph
        $result[] = array('7_pie_graph', "page.mouseMove('.tableIconsGroup:nth-child(2)');
                                          setTimeout(function () {page.click('.tableIcon[data-footer-icon-id=graphPie]');}, 1000);");

        // load a tag cloud
        $result[] = array('8_tag_cloud', "page.mouseMove('.tableIconsGroup:nth-child(2)');
                                          setTimeout(function () {page.click('.tableIcon[data-footer-icon-id=cloud]');}, 1000);");

        // reload normal table
        $result[] = array('9_normal_table', "page.click('.tableIcon[data-footer-icon-id=table]');");

        // change limit
        $result[] = array('10_change_limit', "page.click('.limitSelection');
                                              page.click('.limitSelection ul li[value=10]');");

        // flatten the table
        $result[] = array('11_flattened', "page.mouseMove('.tableConfiguration');
                                           setTimeout(function () {page.click('.dataTableFlatten');}, 1000);");

        // show aggregate rows
        $result[] = array('12_aggregate_shown', "page.mouseMove('.tableConfiguration');
                                                 setTimeout(function () {page.click('.dataTableIncludeAggregateRows');}, 1000);");

        // make hierarchical
        $result[] = array('13_make_hierarchical', "page.mouseMove('.tableConfiguration');
                                                   setTimeout(function () {page.click('.dataTableFlatten');}, 1000);");

        // show visits percent
        $result[] = array('14_visits_percent', "page.mouseMove('td.column');");

        // search for something
        $result[] = array('15_search', "page.sendKeys('.dataTableSearchPattern>input[type=text]', 'term');
                                        page.click('.dataTableSearchPattern>input[type=submit]');");

        return $result;
    }

    /**
     * @group UI
     * @group ViewDataTableTest
     * @dataProvider getScreensToCapture
     */
    public function testUIUrl($name, $js)
    {
        $this->compareScreenshot($name);
    }
}

ViewDataTableTest::$fixture = new Test_Piwik_Fixture_OmniFixture();