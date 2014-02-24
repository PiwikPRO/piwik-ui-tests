echo ""
echo "View UI failures (if any) here http://builds-artifacts.piwik.org/ui-tests.master/$TRAVIS_JOB_NUMBER/screenshot-diffs/diffviewer.html"
echo "If the new screenshots are valid, then you can copy them over to tests/PHPUnit/UI/expected-ui-screenshots/."
echo ""

if [ -f ./UI/run-tests.js ]; then
    phantomjs ./UI/run-tests.js
else
    phpunit UI
fi