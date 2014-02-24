<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
namespace Piwik\Tests\UI;

use Piwik\Option;
use \Test_Piwik_Fixture_OmniFixture;

/**
 * Tests normal login and password reset.
 */
class LoginTest extends UIUnitTest
{
    public static $fixture = null; // initialized below class definition    

    public static function getUrlToTest()
    {
        return "";
    }

    public static function getScreensToCapture()
    {
        $result = array();

        // initial load screenshot
        $result[] = array('initial', '');

        // login failure
        $result[] = array('login_fail', "page.sendKeys('#login_form_login', 'superUserLogin');
                                         page.sendKeys('#login_form_password', 'wrongpassword');
                                         page.click('#login_form_submit');");

        // login success
        $result[] = array('login_success', 'page.sendKeys("#login_form_login", "superUserLogin");
                                            page.sendKeys("#login_form_password", "superUserPass");
                                            page.click("#login_form_submit", 10000);');

        // logout
        $result[] = array('logout', 'page.click("#topBars a:contains(Sign out)", 10000);');

        // password reset start
        $result[] = array('forgot_password', 'page.reload(10000);
                                              page.click("a#login_form_nav", 2000);');

        // password reset submit
        $result[] = array('password_reset', 'page.sendKeys("#reset_form_login", "superUserLogin");
                                             page.sendKeys("#reset_form_password", "superUserPass2");
                                             page.sendKeys("#reset_form_password_bis", "superUserPass2");
                                             page.click("#reset_form_submit", 10000);');

        // password reset finish
        $expectedMailOutputFile = PIWIK_INCLUDE_PATH . '/tmp/Login.resetPassword.mail.json';
        $result[] = array('password_reset_complete',
            'var mailSent = JSON.parse(require("fs").read("' . $expectedMailOutputFile . '"));
             var resetUrl = mailSent.contents.match(/http:\/\/.*/)[0];
             page.load(resetUrl, 10000);');

        // login again
        $result[] = array('password_reset_login', 'page.load("' . self::getProxyUrl() . '", 100);
                                                   page.sendKeys("#login_form_login", "superUserLogin");
                                                   page.sendKeys("#login_form_password", "superUserPass2");
                                                   page.click("#login_form_submit", 10000);');

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

LoginTest::$fixture = new Test_Piwik_Fixture_OmniFixture();
LoginTest::$fixture->testOptions['testUseRegularAuth'] = 1;