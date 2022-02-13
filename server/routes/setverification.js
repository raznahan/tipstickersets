const express = require('express');
const winston = require('winston');
const listRouter = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const TelegramService = require('../services/TelegramService');
const token = process.env.TELEGRAM_TOKEN;
const telegramService = new TelegramService(new TelegramBot(token));
const StickerSetValidationService = require('../services/StickerSetValidationService');
const fs = require('fs');
const path = require('path');
const steggy = require('steggy-noencrypt');
const baseImage = 'baseimage.png';
const encodedImage = 'baseimage-encoded.png';
const dirName = 'resources/';
const tempDirName = 'resources/temp/';

const checkStickerSetName = async (stickerSetName) => {
    const stickerSetValidationService = new StickerSetValidationService(telegramService);
    if (await stickerSetValidationService.validateAndFetchStickerSet(stickerSetName))
        return true;
    else
        return false;
};

listRouter.post('/validatesetname', async (req, res) => {

    if (await checkStickerSetName(req.body.stickerSetName))
        return res.sendStatus(200);
    else
        return res.status(400).send('invalid stickerset link');

});

listRouter.post('/createverificationimage', async (req, res) => {
    if (!req.body.stickerSetName || !req.body.wallet)
        return res.status(400).send('input text or wallet address is empty');

    if (await checkStickerSetName(req.body.stickerSetName)) {
        const baseImagePath = path.join(dirName, 'images', baseImage);
        const encodedImagePath = path.join(tempDirName, 'images', encodedImage);
        const originalImage = fs.readFileSync(baseImagePath);
        const concealed = steggy.conceal(originalImage, req.body.stickerSetName + req.body.wallet);
        fs.writeFileSync(encodedImagePath, concealed)
        const imageBase64 = Buffer.from(concealed).toString('base64');
        return res.send(imageBase64);
    }
    else
        return res.status(400).send('invalid stickerset link');

});

module.exports = listRouter;

