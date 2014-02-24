<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

foreach ($argv as $arg) {
    if (strpos($arg, "--server=") === 0) {
        $serverStr = substr($arg, strlen("--server="));

        $_SERVER = json_decode($serverStr, true);
    }
}

require_once "PHPUnit/Autoload.php";
require_once dirname(__FILE__) . "/../../bootstrap.php";

$fixture = new \Piwik\Tests\Fixtures\UITestFixture();
if (in_array("--persist-fixture-data", $argv)) {
    $fixture->persistFixtureData = true;
}
$fixture->performSetUp("");

// make sure symbolic links exist (phantomjs doesn't support symlink-ing yet)
foreach (array('libs', 'plugins', 'tests') as $linkName) {
    $linkPath = PIWIK_INCLUDE_PATH . '/tests/PHPUnit/proxy/' . $linkName;
    if (!file_exists($linkPath)) {
        symlink(PIWIK_INCLUDE_PATH . '/' . $linkName, $linkPath);
    }
}