const express = require('express');
const home = require('../routes/home');
const stickersets = require('../routes/stickersets');
const setverification = require('../routes/setverification.js');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/home',home);
    app.use('/api/stickersets',stickersets);
    app.use('/api/setverification',setverification);
    app.use('/media', express.static('media'));
    app.use('/resources',express.static('resources'));
    app.use(error);
}