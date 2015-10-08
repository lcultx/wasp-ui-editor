#!/usr/bin/env bash

workpath=$(cd `dirname $0`; pwd)/
cd ${workpath}
cd ../

cd Engine
git config receive.denyCurrentBranch updateInstead
git checkout master
git pull
git add -A
git commit -m 'submit submodule'
git push
