#!/bin/bash

if [ ! -f piwik_commit.txt ]; then
    echo "Cannot find piwik_commit.txt!"

    PIWIK_BRANCH=master
else
    read -a lines -d '\n' < piwik_commit.txt

    PIWIK_COMMIT="${lines[0]}"
    PIWIK_BRANCH="${lines[1]}"
fi

echo "Cloning branch $PIWIK_BRANCH..."

cd ..
git clone --depth=50 "--branch=$PIWIK_BRANCH" git://github.com/piwik/piwik.git piwik

cd piwik

if [ "$PIWIK_COMMIT" != "" ]; then
    echo "Checking out commit $PIWIK_COMMIT..."
    git checkout -qf "$PIWIK_COMMIT"
else
    echo "No commit to checkout."
fi

echo "Updating submodules..."

git submodule update --init --recursive

if [ ! -d tests/PHPUnit/UI/specs ]; then
    echo "Getting latest UI test submodule..."
    cd tests/PHPUnit/UI
    git pull --rebase origin master
    cd ../../..
fi
