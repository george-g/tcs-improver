#!/bin/bash -e

[[ -d ./build ]] || mkdir ./build
./misc/crxmake.sh ./src ./misc/tcsi.pem 
mv src.crx ./build/tsci.crx