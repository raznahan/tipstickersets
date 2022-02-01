var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');
var myEnv = dotenv.config({ path: './config.env' });
dotenvExpand.expand(myEnv);
const winston = require('winston');
require('./startup/logging')();
const express = require('express');
const config = require('config');
const app = express();
require('./startup/cors')(app);
require('./startup/routes')(app);
require("./startup/db")();
require('config');

const fillDummyData = false;

const insertDummyData = async () => {
    await require('./startup/dummydbdata')();
}

if (fillDummyData)
    insertDummyData();


const listeningPort = config.get("port") || 8080;
const server = app.listen(listeningPort, () => {
    winston.info(`listening on port ${listeningPort}`);
});


module.exports = server;