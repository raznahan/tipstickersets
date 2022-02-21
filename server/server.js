var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');
var myEnv = dotenv.config({ path: './config.env' });
dotenvExpand.expand(myEnv);
const winston = require('winston');
require('./startup/logging')();
const express = require('express');
const config = require('config');
const app = express();
require("./startup/db")();
require('./startup/cors')(app);
require('./startup/routes.js')(app);
require('config');
require('./startup/prod')(app);


const listeningPort =  process.env.PORT || config.get("port");
const server = app.listen(listeningPort, () => {
    winston.info(`listening on port ${listeningPort}`);
});


module.exports = server;