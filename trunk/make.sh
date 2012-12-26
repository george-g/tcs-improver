#!/bin/bash -e

[[ -d ./build ]] || mkdir ./build
./misc/crxmake.sh ./src ./misc/tcsi_googlechrome.pem 
mv src.crx ./build/tsci.crx