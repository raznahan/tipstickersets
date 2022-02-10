const express = require('express');
const winston = require('winston');
const listRouter = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const TelegramService = require('../services/TelegramService');
const token = process.env.TELEGRAM_TOKEN;
const telegramService = new TelegramService(new TelegramBot(token));
const StickerSetValidationService = require('../services/StickerSetValidationService');
const stickerSetValidationService = new StickerSetValidationService(telegramService);
const fs = require('fs');
const path = require('path');
const steggy = require('steggy-noencrypt');
const baseImage = 'baseimage.png';
const encodedImage = 'baseimage-encoded.png';
const dirName = 'resources/';
const tempDirName = 'resources/temp/';



listRouter.post('/validatesetname', async (req, res) => {
     //stickerSetValidationService = new StickerSetValidationService(telegramService);
    if (await stickerSetValidationService.validateAndFetchStickerSet(req.body.stickerSetLink))
        return res.send(200);
    else
        return res.status(400).send('invalid stickerset link');
});

listRouter.post('/createverificationimage', async (req, res) => {
    if (!req.body.link || !req.body.wallet)
        return res.status(400).send('input text or wallet address is empty');

    const baseImagePath = path.join(dirName, 'images', baseImage);
    const encodedImagePath = path.join(tempDirName, 'images', encodedImage);
    const originalImage = fs.readFileSync(baseImagePath);
    const concealed = steggy.conceal(originalImage, req.body.link + req.body.wallet);
    fs.writeFileSync(encodedImagePath, concealed)

    res.sendFile('temp/images/' + encodedImage, { root: 'resources' });

});

module.exports = listRouter;

