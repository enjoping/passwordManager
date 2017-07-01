#!/usr/bin/env bash
rm -r build
gulp
cp ./package.json ./build/application/
cp ./Dockerfile ./build/
cp ./.dockerignore ./build/
cp ./docker-compose.yml ./build/
cp ./init.sh ./build/
mkdir ./build/application/config
cp ./config/build.json ./build/application/config/default.json
mkdir ./build/application/dist
cp -r ./frontend/ ./build/application/dist
cp -r ./installation ./build/application/
tar czf build.tar.gz ./build
