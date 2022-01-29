const express = require('express');

const rootRouter = express.Router();


rootRouter.route('/').get((req, res) => {
    res.status(200).send('Hi there!');
});

module.exports = rootRouter;
