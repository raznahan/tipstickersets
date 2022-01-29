const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const validateObjectId = require('../middleware/validateObjectId');
const listRouter = express.Router();
const walletValidator = require('wallet-address-validator');
const TelegramService = require('../services/TelegramService');
const TelegramBot = require('node-telegram-bot-api');
const { StickerSet } = require('../models/stickerSet');
const { Owner } = require('../models/owner');
const { json } = require('express');
const token = '536155432:AAFbV3HIYQed4WwG7TJPN8Gdu1-sl3Vcf70';


listRouter.get('/', async (req, res) => {

    const { StickerSet } = require('../models/stickerSet');
    let count = 100;
    let skip = 0;

    if (req.query.count && req.query.page) {
        count = Number(req.query.count);
        skip = count * (Number(req.query.page) - 1);
    }

    const stickersetList = await StickerSet.find({ isActive: true, ownerVerified: true }, null,
        { skip: skip, limit: count, sort: { tips: -1, created: 1 } })
        .populate('owner', 'wallet -_id');

    const itemsCount = await StickerSet.count({ isActive: true, ownerVerified: true });
    const result = {stickersetList:stickersetList,itemsCount:itemsCount};
    
    res.send(result);

});

listRouter.get('/:id', validateObjectId, async (req, res) => {

    var stickerset = await StickerSet.findOne({ _id: req.params.id, isActive: true, ownerVerified: true })
        .populate('owner', 'wallet -_id');

    if (!stickerset)
        return res.status(404).send('stickerset with given id was not found.');

    res.send(stickerset);

});

listRouter.post('/add', async (req, res) => {

    if (!walletValidator.validate(req.body.ownerWalletAddress, 'ETH'))
        return res.status(400).send('invalid wallet address.');

    const telegramService = new TelegramService(new TelegramBot(token));
    let stickerSet;
    try {
        stickerSet = await telegramService.getStickerSet(req.body.stickerSetLink);
    }
    catch (err) {
        return res.status(400).send('invalid stickerset name.');
    }

    const owner = await Owner.findOne({ ownerWalletAddress: req.body.ownerWalletAddress });
    if (!owner)
        return res.status(400).send('wallet address not found.');

    const newStickerSet = new StickerSet({
        title: stickerSet.title,
        name: req.body.stickerSetLink,
        owner: owner._id
    });
    await newStickerSet.save();

    res.sendStatus(200);
    //const result = await bot.sendMessage(29384830, 'sdfsdf');

});

listRouter.post('/updateTip', async (req, res) => {
    let stickerset = await StickerSet.findOne({ name: req.body.name, isActive: true, ownerVerified: true });
    if (!stickerset)
        return res.status(404).send('stickerset name not found.');

    stickerset.tips += parseFloat(req.body.tips);
    stickerset.tips = parseFloat(stickerset.tips).toFixed(4);
    stickerset.isTipped = true;
    stickerset.lastEdited = Date.now();

    await stickerset.save();
    res.send(stickerset);

});

module.exports = listRouter;