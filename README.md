## Piwik User Interface Tests

This repository contains user interface tests for Piwik, taking automated screenshots of particular Piwik pages and reports.

To learn more, read [this](https://github.com/piwik/piwik/blob/master/tests/README.md).
 
Screenshot tests Build  [![Build Status](https://travis-ci.org/piwik/piwik-ui-tests.png?branch=master)](https://travis-ci.org/piwik/piwik-ui-tests)

#### Deleting git history

Git is not designed to store binary files, so storing images that are constantly changing will drastically increase the repository's size. To fix this we periodically delete all version history. To perform a purge, execute the following commands:

    $ rm -rf .git
    $ git init
    $ git add .
    $ git commit -m "Purging version history, new initial commit."
    $ git remote add origin https://github.com/piwik/piwik-ui-tests.git
    $ git push -u --force origin master

Then update the submodule reference in Piwik:

    $ cd ..
    $ git add UI
    $ git commit -m "Updating UI submodule."
    $ git push origin master