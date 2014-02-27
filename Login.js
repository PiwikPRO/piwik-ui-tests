/*!
 * Piwik - Web Analytics
 *
 * login & password reset screenshot tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("Login", function () {
    this.timeout(0);

    before(function () {
        testEnvironment.testUseRegularAuth = 1;
        testEnvironment.save();
    });

    after(function () {
        testEnvironment.testUseRegularAuth = 0;
        testEnvironment.save();
    });

    it("should load correctly", function (done) {
        expect.screenshot("login_form").to.be.capture(function (page) {
            page.load("");
        }, done);
    });

    it("should fail when incorrect credentials are supplied", function (done) {
        expect.screenshot("login_fail").to.be.capture(function (page) {
            page.sendKeys('#login_form_login', 'superUserLogin');
            page.sendKeys('#login_form_password', 'wrongpassword');
            page.click('#login_form_submit');
        }, done);
    });

    it("should redirect to Piwik when correct credentials are supplied", function (done) {
        expect.screenshot("login_success").to.be.capture(function (page) {
            page.sendKeys("#login_form_login", "superUserLogin");
            page.sendKeys("#login_form_password", "superUserPass");
            page.click("#login_form_submit");
        }, done);
    });

    it("should redirect to login when logout link clicked", function (done) {
        expect.screenshot("login_form").to.be.capture("logout_form", function (page) {
            page.click("#topBars a:contains(Sign out)");
        }, done);
    });

    it("should display password reset form when forgot password link clicked", function (done) {
        expect.screenshot("forgot_password").to.be.capture(function (page) {
            page.reload();
            page.click("a#login_form_nav");
        }, done);
    });

    it("should send email when password reset form submitted", function (done) {
        expect.screenshot("password_reset").to.be.capture(function (page) {
            page.sendKeys("#reset_form_login", "superUserLogin");
            page.sendKeys("#reset_form_password", "superUserPass2");
            page.sendKeys("#reset_form_password_bis", "superUserPass2");
            page.click("#reset_form_submit", 3000);
        }, done);
    });

    it("should reset password when password reset link is clicked", function (done) {
        expect.screenshot("password_reset_complete").to.be.capture(function (page) {
            var expectedMailOutputFile = PIWIK_INCLUDE_PATH + '/tmp/Login.resetPassword.mail.json',
                mailSent = JSON.parse(require("fs").read(expectedMailOutputFile)),
                resetUrl = mailSent.contents.match(/http:\/\/.*/)[0];

            page.load(resetUrl);
        }, done);
    });

    it("should login successfully when new credentials used", function (done) {
        expect.screenshot("login_success").to.be.capture("login_success_new_credentials", function (page) {
            page.load("");
            page.sendKeys("#login_form_login", "superUserLogin");
            page.sendKeys("#login_form_password", "superUserPass2");
            page.click("#login_form_submit");
        }, done);
    });
});