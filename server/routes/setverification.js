const express = require('express');
const listRouter = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const TelegramService = require('../services/TelegramService');
const token = process.env.TELEGRAM_TOKEN;
const telegramService = new TelegramService(new TelegramBot(token));
const StickerSetValidationService = require('../services/StickerSetValidationService');
const fs = require('fs');
const path = require('path');
const FileService = require('../services/FileService');
const { Owner } = require('../models/owner');
const { StickerSet } = require('../models/stickerSet');
const verificationImage = 'verificationimage.png';
const dirName = 'resources/';
const winston = require('winston');


const checkStickerSetName = async (stickerSetName) => {
    const stickerSetValidationService = new StickerSetValidationService(telegramService);
    if (await stickerSetValidationService.validateAndFetchStickerSet(stickerSetName))
        return true;
    else
        return false;
};

const fetchVerificationImage = () => {
    const verificationImagePath = path.join(dirName, 'images', verificationImage);
    const verificationImageBuffer = fs.readFileSync(verificationImagePath);
    const verificationImageBase64 = Buffer.from(verificationImageBuffer).toString('base64');

    return verificationImageBase64;
};

const checkStickSetOwnership = async (stickerSetName) => {
    const fileService = new FileService();
    const stickerSetValidationService = new StickerSetValidationService(telegramService, fileService);
    const isVerified = await stickerSetValidationService.verifyStickerSetOwnerShip(stickerSetName);

    return isVerified;

};

const updateOwnerVerified = async (stickerSetName, wallet) => {
    const owner = await Owner.findOne({ wallet: wallet });
    if (owner) {
        const stickerSet = await StickerSet.findOne({ name: stickerSetName, owner: owner._id }, null, { sort: { created: -1 } });
        stickerSet.isActive = true;
        stickerSet.ownerVerified = true;
        stickerSet.ownerVerifiedDate = Date.now();
        stickerSet.lastEdited = Date.now();
        await stickerSet.save();
        return true;
    }
    else return false;
};

listRouter.post('/validatesetname', async (req, res) => {

    if (await checkStickerSetName(req.body.stickerSetName))
        return res.sendStatus(200);
    else
        return res.status(400).send('invalid stickerset link');

});

listRouter.post('/showverificationimage', async (req, res) => {
    if (!req.body.stickerSetName || !req.body.wallet)
        return res.status(400).send('sticker set or wallet address is empty');

    if (await checkStickerSetName(req.body.stickerSetName)) {
        const imageBase64 = fetchVerificationImage();
        return res.send(imageBase64);
    }
    else
        return res.status(400).send('invalid sticker set name');

});

listRouter.post('/verifyownership', async (req, res) => {
    if (!req.body.stickerSetName || !req.body.wallet)
        return res.status(400).send('sticker set or wallet address is empty');

    if (await checkStickSetOwnership(req.body.stickerSetName)) {
        const result = await updateOwnerVerified(req.body.stickerSetName, req.body.wallet);
        if (result)
            return res.sendStatus(200);

    }

    return res.sendStatus(400);

})

module.exports = listRouter;

