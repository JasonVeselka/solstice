#!/bin/bash

# exit with non-zero exit code on failure
set -e

# clear and re-create the out directory
rm -rf out || exit 0;
mkdir out;

# go to the out directory and create a *new* Git repo
cd out
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Travis CI"
git config user.email "jason.veselka@live.com"

# add all and commit
git add .
git commit -m "[travis build #$TRAVIS_JOB_NUMBER] Auto-deploy from https://travis-ci.org/JasonVeselka/solstice"

# force push to master
git push --force "https://${GH_TOKEN}@${GH_REF}" master > /dev/null 2>&1
