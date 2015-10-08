#!/usr/bin/env bash

workpath=$(cd `dirname $0`; pwd)/
cd ${workpath}
cd ../

git submodule init
git submodule update
git submodule foreach git pull origin master
