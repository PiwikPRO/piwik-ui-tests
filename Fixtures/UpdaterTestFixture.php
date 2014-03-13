<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Tests\Fixtures;

use \Piwik\Config;
use \Exception;

class UpdaterTestFixture extends \Piwik_Test_Fixture_SqlDump
{
    public function performSetUp($testCase, $setupEnvironmentOnly = false)
    {
        $this->dumpUrl = PIWIK_INCLUDE_PATH . "/tests/PHPUnit/UI/resources/piwik1.0.sql.gz";
        $this->dropDatabaseInSetUp = true;
        $this->resetPersistedFixture = true;

        parent::performSetUp($testCase, $setupEnvironmentOnly);
    }

    public function setUp()
    {
        parent::setUp();

        $this->testEnvironment->tablesPrefix = 'piwik_';
        $this->testEnvironment->save();
    }
}