#!/bin/bash

# based on:
# https://javascript.plainenglish.io/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4

npm install -g typeorm
typeorm init --name jwt-express-typeorm --database mysql --express
npm install
npm install -s helmet cors jsonwebtoken bcryptjs class-validator ts-node-dev
npm install -s @types/bcryptjs @types/body-parser @types/cors @types/helmet @types/jsonwebtoken

# create migration to insert first admin user
typeorm migration:create -n CreateAdminUser
# then edit the file that is created and move it to './src/migration/'

# generate tables in the db
npm start

# run the migration
npx ts-node ./node_modules/typeorm/cli.js -d ./src/data-source.ts migration:run
