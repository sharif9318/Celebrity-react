#!/bin/bash

#PRODUCTION

git reset --hard
git checkout main
git pull origin main

npm i yarn -g
yarn global add serve
yarn install
yarn run build
pm2 start "yarn run start:prod" --name=celebrity-react