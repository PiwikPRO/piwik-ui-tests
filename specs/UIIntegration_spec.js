/*!
 * Piwik - Web Analytics
 *
 * Screenshot integration tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("UIIntegrationTest", function () { // TODO: Rename to Piwik?
    this.timeout(0);

    var generalParams = 'idSite=1&period=year&date=2012-08-09',
        idSite2Params = 'idSite=2&period=year&date=2012-08-09',
        evolutionParams = 'idSite=1&period=day&date=2012-01-31&evolution_day_last_n=30',
        urlBase = 'module=CoreHome&action=index&' + generalParams,
        widgetizeParams = "module=Widgetize&action=iframe",
        segment = encodeURIComponent("browserCode==FF") // from OmniFixture
        ;

    // dashboard tests
    it("should load dashboard1 correctly", function (done) {
        expect.screenshot("dashboard1").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Dashboard&action=embeddedIndex&idDashboard=1");
        }, done);
    });

    it("should load dashboard2 correctly", function (done) {
        expect.screenshot("dashboard2").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Dashboard&action=embeddedIndex&idDashboard=2");
        }, done);
    });

    it("should load dashboard3 correctly", function (done) {
        expect.screenshot("dashboard3").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Dashboard&action=embeddedIndex&idDashboard=3");
        }, done);
    });

    it("should load dashboard4 correctly", function (done) {
        expect.screenshot("dashboard4").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Dashboard&action=embeddedIndex&idDashboard=4");
        }, done);
    });

    it("should display dashboard correctly on a mobile phone", function (done) {
        expect.screenshot("dashboard5_mobile").to.be.capture(function (page) {
            page.setViewportSize(480, 320);
            page.load("?" + urlBase + "#" + generalParams + "&module=Dashboard&action=embeddedIndex&idDashboard=5");
        }, done);
    });

    // visitors pages
    it('should load visitors > overview page correctly', function (done) {
        expect.screenshot("visitors_overview").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=VisitsSummary&action=index");
        }, done);
    });

    it('should load visitors > visitor log page correctly', function (done) {
        expect.screenshot("visitors_visitorlog").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Live&action=indexVisitorLog");
        }, done);
    });

    it('should load the visitors > devices page correctly', function (done) {
        expect.screenshot("visitors_devices").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=DevicesDetection&action=index");
        }, done);
    });

    it('should load visitors > locations & provider page correctly', function (done) {
        expect.screenshot("visitors_locations_provider").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=UserCountry&action=index");
        }, done);
    });

    it('should load the visitors > settings page correctly', function (done) {
        expect.screenshot("visitors_settings").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=UserSettings&action=index");
        }, done);
    });

    it('should load the visitors > times page correctly', function (done) {
        expect.screenshot("visitors_times").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=VisitTime&action=index");
        }, done);
    });

    it('should load the visitors > engagement page correctly', function (done) {
        expect.screenshot("visitors_engagement").to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=VisitFrequency&action=index");
        }, done);
    });

    it('should load the visitors > custom variables page correctly', function (done) {
        expect.screenshot('visitors_custom_vars').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=CustomVariables&action=index");
        }, done);
    });

    it('should load the visitors > real-time map page correctly', function (done) {
        expect.screenshot('visitors_realtime_map').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + idSite2Params + "&module=UserCountryMap&action=realtimeWorldMap"
                    + "&showDateTime=0&realtimeWindow=last2&changeVisitAlpha=0&enableAnimation=0&doNotRefreshVisits=1"
                    + "&removeOldVisits=0");
        }, done);
    });

    // actions pages
    it('should load the actions > pages page correctly', function (done) {
        expect.screenshot('actions_pages').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Actions&action=indexPageUrls");
        }, done);
    });

    it('should load the actions > entry pages page correctly', function (done) {
        expect.screenshot('actions_entry_pages').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Actions&action=indexEntryPageUrls");
        }, done);
    });

    it('should load the actions > exit pages page correctly', function (done) {
        expect.screenshot('actions_exit_pages').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Actions&action=indexExitPageUrls");
        }, done);
    });

    it('should load the actions > page titles page correctly', function (done) {
        expect.screenshot('actions_page_titles').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Actions&action=indexPageTitles");
        }, done);
    });

    it('should load the actions > site search page correctly', function (done) {
        expect.screenshot('actions_site_search').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Actions&action=indexSiteSearch");
        }, done);
    });

    it('should load the actions > outlinks page correctly', function (done) {
        expect.screenshot('actions_outlinks').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Actions&action=indexOutlinks");
        }, done);
    });

    it('should load the actions > downloads page correctly', function (done) {
        expect.screenshot('actions_downloads').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Actions&action=indexDownloads");
        }, done);
    });

    // referrers pages
    it('should load the referrers > overview page correctly', function (done) {
        expect.screenshot('referrers_overview').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Referrers&action=index");
        }, done);
    });

    it('should load the referrers > search engines & keywords page correctly', function (done) {
        expect.screenshot('referrers_search_engines_keywords').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Referrers&action=getSearchEnginesAndKeywords");
        }, done);
    });

    it('should load the referrers > websites & social page correctly', function (done) {
        expect.screenshot('referrers_websites_social').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Referrers&action=indexWebsites");
        }, done);
    });

    it('should load the referrers > campaigns page correctly', function (done) {
        expect.screenshot('referrers_campaigns').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Referrers&action=indexCampaigns");
        }, done);
    });

    // goals pages
    it('should load the goals > ecommerce page correctly', function (done) {
        expect.screenshot('goals_ecommerce').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Goals&action=ecommerceReport&idGoal=ecommerceOrder");
        }, done);
    });

    it('should load the goals > overview page correctly', function (done) {
        expect.screenshot('goals_overview').to.be.capture(function (page) {
            page.load( "?" + urlBase + "#" + generalParams + "&module=Goals&action=index");
        }, done);
    });

    it('should load the goals > single goal page correctly', function (done) {
        expect.screenshot('goals_individual_goal').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=Goals&action=goalReport&idGoal=1");
        }, done);
    });

    // one page w/ segment
    it('should load the visitors > overview page correctly when a segment is specified', function (done) {
        expect.screenshot('visitors_overview_segment').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=VisitsSummary&action=index&segment=" + segment);
        }, done);
    });

    // example ui pages
    it('should load the example ui > dataTables page correctly', function (done) {
        expect.screenshot('exampleui_dataTables').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=ExampleUI&action=dataTables");
        }, done);
    });

    it('should load the example ui > barGraph page correctly', function (done) {
        expect.screenshot('exampleui_barGraph').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=ExampleUI&action=barGraph");
        }, done);
    });

    it('should load the example ui > pieGraph page correctly', function (done) {
        expect.screenshot('exampleui_pieGraph').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=ExampleUI&action=pieGraph");
        }, done);
    });

    it('should load the example ui > tagClouds page correctly', function (done) {
        expect.screenshot('exampleui_tagClouds').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=ExampleUI&action=tagClouds");
        }, done);
    });

    it('should load the example ui > sparklines page correctly', function (done) {
        expect.screenshot('exampleui_sparklines').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=ExampleUI&action=sparklines");
        }, done);
    });

    it('should load the example ui > evolution graph page correctly', function (done) {
        expect.screenshot('exampleui_evolutionGraph').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=ExampleUI&action=evolutionGraph");
        }, done);
    });

    it('should load the example ui > treemap page correctly', function (done) {
        expect.screenshot('exampleui_treemap').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=ExampleUI&action=treemap");
            page.wait(2000);
        }, done);
    });

    // widgetize
    it('should load the widgetized visitor log correctly', function (done) {
        expect.screenshot('widgetize_visitor_log').to.be.capture(function (page) {
            page.load("?" + widgetizeParams + "&" + generalParams + "&moduleToWidgetize=Live&actionToWidgetize=getVisitorLog");
        }, done);
    });

    it('should load the widgetized all websites dashboard correctly', function (done) {
        expect.screenshot('widgetize_allwebsites').to.be.capture(function (page) {
            page.load("?" + widgetizeParams + "&" + generalParams + "&moduleToWidgetize=MultiSites&actionToWidgetize=standalone");
        }, done);
    });

    // transitions popup
    it('should load the transitions popup correctly', function (done) {
        expect.screenshot('transitions_popup').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "#module=Actions&action=indexPageUrls&"
                    + "popover=RowAction$3ATransitions$3Aurl$3Ahttp$3A$2F$2Fpiwik.net$2Fdocs$2Fmanage-websites$2F");
        }, done);
    });

    // Admin user settings (plugins not displayed)
    it('should load the themes admin page correctly', function (done) {
        expect.screenshot('admin_themes').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=CorePluginsAdmin&action=themes");
        }, done);
    });

    it('should load the security info admin page correctly', function (done) {
        expect.screenshot('admin_security_info').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=SecurityInfo&tests_hide_piwik_version=1");
        }, done);
    });

    it('should load the user settings admin page correctly', function (done) {
        expect.screenshot('admin_user_settings').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=UsersManager&action=userSettings");
        }, done);
    });

    it('should load the plugin settings admin page correctly', function (done) {
        expect.screenshot('admin_plugin_settings').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=CoreAdminHome&action=pluginSettings");
        }, done);
    });

    it('should load the Manage > Websites admin page correctly', function (done) {
        expect.screenshot('admin_manage_websites').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=SitesManager&action=index");
        }, done);
    });

    it('should load the Manage > Users admin page correctly', function (done) {
        expect.screenshot('admin_manage_users').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=UsersManager&action=index");
        }, done);
    });

    it('should load the Manage > Tracking Code admin page correctly', function (done) {
        expect.screenshot('admin_manage_tracking_code').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=CoreAdminHome&action=trackingCodeGenerator");
        }, done);
    });

    it('should load the Settings > General Settings admin page correctly', function (done) {
        expect.screenshot('admin_settings_general').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=CoreAdminHome&action=generalSettings");
        }, done);
    });

    it('should load the Settings > Privacy admin page correctly', function (done) {
        expect.screenshot('admin_privacy_settings').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=PrivacyManager&action=privacySettings");
        }, done);
    });

    it('should load the Settings > Mobile Messaging admin page correctly', function (done) {
        expect.screenshot('admin_settings_mobilemessaging').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=MobileMessaging&action=index");
        }, done);
    });

    it('should load the Settings > Visitor Generator admin page correctly', function (done) {
        expect.screenshot('admin_visitor_generator').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=VisitorGenerator&action=index");
        }, done);
    });

    // Notifications
    it('should load the notifications page correctly', function (done) {
        expect.screenshot('notifications').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=ExampleUI&action=notifications&idSite=1&period=day&date=yesterday");
        }, done);
    });

    // Fatal error safemode
    it('should load the safemode fatal error page correctly', function (done) {
        var message = "Call%20to%20undefined%20function%20Piwik%5CPlugins%5CFoobar%5CPiwik_Translate()",
            file = "%2Fhome%2Fvagrant%2Fwww%2Fpiwik%2Fplugins%2FFoobar%2FFoobar.php%20line%205",
            line = 58;

        expect.screenshot('fatal_error_safemode').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=CorePluginsAdmin&action=safemode&idSite=1&period=day&date=yesterday&activated"
                    + "&error_message=" + message + "&error_file=" + file + "&error_line=" + line + "&tests_hide_piwik_version=1");
        }, done);
    });

    // CustomAlerts plugin
    it('should load the custom alerts list correctly', function (done) {
        expect.screenshot('customalerts_list').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=CustomAlerts&action=index&idSite=1&period=day&date=yesterday&tests_hide_piwik_version=1");
        }, done);
    });

    it('should load the triggered custom alerts list correctly', function (done) {
        expect.screenshot('customalerts_list_triggered').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=CustomAlerts&action=historyTriggeredAlerts&idSite=1&period=day&date=yesterday&tests_hide_piwik_version=1");
        }, done);
    });

    // Multisites
    it('should load the all websites dashboard correctly', function (done) {
        expect.screenshot('all_websites').to.be.capture(function (page) {
            page.load("?" + generalParams + "&module=MultiSites&action=index");
        }, done);
    });

    // date range clicked
    it('should reload to the correct date when a date range is selected in the period selector', function (done) {
        expect.screenshot('period_select_date_range_click').to.be.capture(function (page) {
            page.load("?" + urlBase + "#" + generalParams + "&module=VisitTime&action=index");
            page.evaluate(function () {
                $(document).ready(function () {
                    $('#date').click();
                    $('#period_id_range').click();
                    $('#inputCalendarFrom').val('2012-08-02');
                    $('#inputCalendarTo').val('2012-08-12');
                    setTimeout(function () {$('#calendarRangeApply').click();}, 500);
                });
            });
        }, done);
    });

    // visitor profile popup
    it('should load the visitor profile popup correctly', function (done) {
        expect.screenshot('visitor_profile_popup').to.be.capture(function (page) {
            page.load("?" + widgetizeParams + "&" + idSite2Params + "&moduleToWidgetize=Live&actionToWidgetize=getVisitorProfilePopup"
                    + "&enableAnimation=0");

            page.evaluate(function () {
                $(document).ready(function () {
                    $('.visitor-profile-show-map').click();
                });
            });

            page.wait(1000);
        }, done);
    });
});