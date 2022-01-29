const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');;

module.exports = function() {
    const connectionString = config.get('connectionString');
    mongoose.connect(connectionString)
      .then(() => winston.info(`Connected to ${connectionString}...`));
  }