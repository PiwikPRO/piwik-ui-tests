<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

use Piwik\Db;

/**
 * Tests UI code by grabbing screenshots of webpages and comparing with expected files.
 *
 * Uses slimerjs or phantomjs.
 *
 */
class Test_Piwik_Integration_UIIntegrationTest // extends UITest
{
    public static $fixture = null; // initialized below class definition

    public static function getUrlsForTesting()
    {
        $generalParams = 'idSite=1&period=year&date=2012-08-09';
        $idSite2Params = 'idSite=2&period=year&date=2012-08-09';
        $evolutionParams = 'idSite=1&period=day&date=2012-01-31&evolution_day_last_n=30';
        $urlBase = 'module=CoreHome&action=index&' . $generalParams;
        $widgetizeParams = "module=Widgetize&action=iframe";
        $segment = urlencode(self::$fixture->segment);

        $forcedNowTimestamp = self::$fixture->now->getTimestamp();

        $result = array(
            // dashboard
            array('dashboard1', "?$urlBase#$generalParams&module=Dashboard&action=embeddedIndex&idDashboard=1"),
            array('dashboard2', "?$urlBase#$generalParams&module=Dashboard&action=embeddedIndex&idDashboard=2"),
            array('dashboard3', "?$urlBase#$generalParams&module=Dashboard&action=embeddedIndex&idDashboard=3"),
            array('dashboard4', "?$urlBase#$generalParams&module=Dashboard&action=embeddedIndex&idDashboard=4"),

            // visitors pages (except real time map since it displays current time)
            array('visitors_overview', "?$urlBase#$generalParams&module=VisitsSummary&action=index"),
            array('visitors_visitorlog', "?$urlBase#$generalParams&module=Live&action=indexVisitorLog"),
            array('visitors_devices', "?$urlBase#$generalParams&module=DevicesDetection&action=index"),
            array('visitors_locations_provider', "?$urlBase#$generalParams&module=UserCountry&action=index"),
            array('visitors_settings', "?$urlBase#$generalParams&module=UserSettings&action=index"),
            array('visitors_times', "?$urlBase#$generalParams&module=VisitTime&action=index"),
            array('visitors_engagement', "?$urlBase#$generalParams&module=VisitFrequency&action=index"),
            array('visitors_custom_vars', "?$urlBase#$generalParams&module=CustomVariables&action=index"),
            array('visitors_realtime_map', "?$urlBase#$idSite2Params&module=UserCountryMap&action=realtimeWorldMap"
            . "&showDateTime=0&realtimeWindow=last2&changeVisitAlpha=0"
            . "&enableAnimation=0&forceNowValue=$forcedNowTimestamp"),

            // actions pages
            array('actions_pages', "?$urlBase#$generalParams&module=Actions&action=indexPageUrls"),
            array('actions_entry_pages', "?$urlBase#$generalParams&module=Actions&action=indexEntryPageUrls"),
            array('actions_exit_pages', "?$urlBase#$generalParams&module=Actions&action=indexExitPageUrls"),
            array('actions_page_titles', "?$urlBase#$generalParams&module=Actions&action=indexPageTitles"),
            array('actions_site_search', "?$urlBase#$generalParams&module=Actions&action=indexSiteSearch"),
            array('actions_outlinks', "?$urlBase#$generalParams&module=Actions&action=indexOutlinks"),
            array('actions_downloads', "?$urlBase#$generalParams&module=Actions&action=indexDownloads"),

            // referrers pages
            array('referrers_overview', "?$urlBase#$generalParams&module=Referrers&action=index"),
            array('referrers_search_engines_keywords',
                "?$urlBase#$generalParams&module=Referrers&action=getSearchEnginesAndKeywords"),
            array('referrers_websites_social', "?$urlBase#$generalParams&module=Referrers&action=indexWebsites"),
            array('referrers_campaigns', "?$urlBase#$generalParams&module=Referrers&action=indexCampaigns"),

            // goals pages
            array('goals_ecommerce',
                "?$urlBase#$generalParams&module=Goals&action=ecommerceReport&idGoal=ecommerceOrder"),
            array('goals_overview', "?$urlBase#$generalParams&module=Goals&action=index"),
            array('goals_individual_goal', "?$urlBase#$generalParams&module=Goals&action=goalReport&idGoal=1"),

            // one page w/ segment
            array('visitors_overview_segment',
                "?$urlBase#$generalParams&module=VisitsSummary&action=index&segment=$segment"),

            // example ui pages
            array('exampleui_dataTables', "?$urlBase#$generalParams&module=ExampleUI&action=dataTables"),
            array('exampleui_barGraph', "?$urlBase#$generalParams&module=ExampleUI&action=barGraph"),
            array('exampleui_pieGraph', "?$urlBase#$generalParams&module=ExampleUI&action=pieGraph"),
            array('exampleui_tagClouds', "?$urlBase#$generalParams&module=ExampleUI&action=tagClouds"),
            array('exampleui_sparklines', "?$urlBase#$generalParams&module=ExampleUI&action=sparklines"),
            array('exampleui_evolutionGraph', "?$urlBase#$generalParams&module=ExampleUI&action=evolutionGraph"),

            // widgetize
            array("widgetize_visitor_log",
                "?$widgetizeParams&$generalParams&moduleToWidgetize=Live&actionToWidgetize=getVisitorLog"),
            array("widgetize_goals_table_ecommerce",
                "?$widgetizeParams&$generalParams&moduleToWidgetize=UserCountry&actionToWidgetize=getCountry"
                . "&viewDataTable=tableGoals&idGoal=ecommerceOrder"),
            array("widgetize_goals_table_single",
                "?$widgetizeParams&$generalParams&moduleToWidgetize=UserCountry&actionToWidgetize=getCountry"
                . "&viewDataTable=tableGoals&idGoal=1"),
            array("widgetize_goals_table_full",
                "?$widgetizeParams&$generalParams&moduleToWidgetize=UserCountry&actionToWidgetize=getCountry"
                . "&viewDataTable=tableGoals&idGoal=0"),
            array("widgetize_all_columns_table_sort_processed",
                "?$widgetizeParams&$generalParams&moduleToWidgetize=UserCountry&actionToWidgetize=getCountry"
                . "&viewDataTable=tableAllColumns&filter_sort_column=bounce_rate"),
            array("widgetize_evolution_graph",
                "?$widgetizeParams&$evolutionParams&moduleToWidgetize=UserCountry&actionToWidgetize=getCountry"
                . "&viewDataTable=graphEvolution"),
            array("widgetize_actions_search",
                "?$widgetizeParams&$generalParams&moduleToWidgetize=Actions&actionToWidgetize=getPageUrls"
                . "&filter_column_recursive=label&filter_pattern_recursive=i"),
            array("widgetize_actions_flat",
                "?$widgetizeParams&$generalParams&moduleToWidgetize=Actions&actionToWidgetize=getPageUrls"
                . "&flat=1"),
            array("widgetize_actions_excludelowpop",
                "?$widgetizeParams&$generalParams&moduleToWidgetize=Actions&actionToWidgetize=getPageUrls"
                . "&enable_filter_excludelowpop=1"),

            array("widgetize_dashboard", "?$widgetizeParams&$generalParams&moduleToWidgetize=Dashboard&actionToWidgetize=index"),
            array("widgetize_allwebsites", "?$widgetizeParams&$generalParams&moduleToWidgetize=MultiSites&actionToWidgetize=standalone"),

            // row evolution
            array("row_evolution_popup",
                "?$widgetizeParams&moduleToWidgetize=CoreHome&actionToWidgetize=getRowEvolutionPopover"
                . "&apiMethod=UserSettings.getBrowser&label=Chrome&disableLink=1&idSite=1&period=day"
                . "&date=2012-01-31"),
            array("multi_row_evolution_popup",
                "?$widgetizeParams&moduleToWidgetize=CoreHome&actionToWidgetize=getMultiRowEvolutionPopover"
                . "&label=" . urlencode("Chrome,Firefox") . "&apiMethod=UserSettings.getBrowser&idSite=1&period=day"
                . "&date=2012-01-31&disableLink=1"),

            // transitions popup
            array("transitions_popup",
                "?$urlBase#$generalParams#module=Actions&action=indexPageUrls&"
                . "popover=RowAction$3ATransitions$3Aurl$3Ahttp$3A$2F$2Fpiwik.net$2Fdocs$2Fmanage-websites$2F"),

            // Admin user settings
            array("admin_themes", "?$generalParams&module=CorePluginsAdmin&action=themes"),
            array("admin_security_info", "?$generalParams&module=SecurityInfo&tests_hide_piwik_version=1"),
            array("admin_user_settings", "?$generalParams&module=UsersManager&action=userSettings"),
            array("admin_plugin_settings", "?$generalParams&module=CoreAdminHome&action=pluginSettings"),
            //array("admin_plugins", "?$generalParams&module=CorePluginsAdmin&action=plugins"),

            // Notifications
            array("notifications", "?$generalParams&module=ExampleUI&action=notifications&idSite=1&period=day&date=yesterday"),

            // Fatal error safemode
            array("fatal_error_safemode", "?$generalParams&module=CorePluginsAdmin&action=safemode&idSite=1&period=day&date=yesterday&activated&error_message=Call%20to%20undefined%20function%20Piwik%5CPlugins%5CFoobar%5CPiwik_Translate()&error_file=%2Fhome%2Fvagrant%2Fwww%2Fpiwik%2Fplugins%2FFoobar%2FFoobar.php%20line%205&error_line=58&tests_hide_piwik_version=1"),

            // CustomAlerts plugin
            array("customalerts_list", "?$generalParams&module=CustomAlerts&action=index&idSite=1&period=day&date=yesterday&tests_hide_piwik_version=1"),
            array("customalerts_list_triggered", "?$generalParams&module=CustomAlerts&action=historyTriggeredAlerts&idSite=1&period=day&date=yesterday&tests_hide_piwik_version=1"),

            // Multisites
            array("all_websites", "?$generalParams&module=MultiSites&action=index"),

        );

        // date range clicked
        $result[] = array(
            'period_select_date_range_click',
            "?$urlBase#$generalParams&module=VisitTime&action=index",
            "page.evaluate(function () {
                $(document).ready(function () {
                    $('#date').click();
                    $('#period_id_range').click();
                    $('#inputCalendarFrom').val('2012-08-02');
                    $('#inputCalendarTo').val('2012-08-12');
                    setTimeout(function () {\$('#calendarRangeApply').click();}, 500);
                });
             });"
        );

        // adding new widget
        $result[] = array(
            'dashboard_add_widget',
            "?$urlBase#$generalParams&module=Dashboard&action=embeddedIndex&idDashboard=5",
            "page.evaluate(function () {
                $(document).ready(function () {
                    $('#dashboardSettings').click();
                    $('.widgetpreview-categorylist>li:first-child').triggerHandler('mouseover');
                    $('.widgetpreview-widgetlist>li:first-child').click();
                });
             });"
        );

        // only add the visitor_profile_popup test if the fixture's been setup
        if (!empty(static::$fixture->visitorIdDeterministic)) {
            $visitorIdDeterministic = static::$fixture->visitorIdDeterministic;

            // visitor profile popup
            $result[] = array("visitor_profile_popup",
                "?$widgetizeParams&$idSite2Params&moduleToWidgetize=Live&actionToWidgetize=getVisitorProfilePopup"
                . "&visitorId=$visitorIdDeterministic&forceNowValue=$forcedNowTimestamp",
                "page.evaluate(function () {
                    $(document).ready(function () {
                        $('.visitor-profile-show-map').click();
                    });
                 });");
        }

        return $result;
    }

    /**
     * @group UI
     * @group UIIntegrationTest
     * @dataProvider getUrlsForTesting
     */
    public function testUIUrl($name, $urlQuery)
    {
        $this->compareScreenshot($name, $urlQuery);
    }

    /**
     * Test the visitor profile popup. Can't be done w/ dataProvider since that will be called before
     * fixture is setup, and we need a visitor ID obtained from the database. (If we provide no visitor
     * ID, the most recent one will be used).
     *
     * @group UI
     * @group UIIntegrationTest
     */
    public function testVisitorProfilePopupWithMap()
    {
        foreach (self::getUrlsForTesting() as $args) {
            if ($args[0] == 'visitor_profile_popup') {
                return $this->compareScreenshot($args[0], $args[1]);
            }
        }
    }
}

//Test_Piwik_Integration_UIIntegrationTest::$fixture = new Test_Piwik_Fixture_OmniFixture();