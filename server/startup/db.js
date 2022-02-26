const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');;
const importData = require('../startup/dummydbdata');
const {StickerSet} = require('../models/stickerSet');

module.exports = function () {
  const connectionString = config.get('connectionString');
  mongoose.connect(connectionString)
    .then(() => {
      winston.info(`Connected to ${connectionString}...`);
      mongoose.connection.collections["owners"].countDocuments()
        .then((count) => {
          if (count == 0) {
            winston.info('No data in database. Importing initial data...');
            importData();
          }
        })
    });




}