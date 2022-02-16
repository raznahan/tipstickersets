const winston = require('winston');
const ReadText = require('text-from-image');
const webp = require('webp-converter');
webp.grant_permission();

class StickerSetValidationService {
    constructor(telegramService, fileService) {
        this.telegramService = telegramService;
        this.fileService = fileService;
        this.stickerDownloadPath = './resources/temp/images/';
    }

    async validateAndFetchStickerSet(name) {
        let stickerSet;
        try {
            stickerSet = await this.telegramService.getStickerSet(name);
        }
        catch (err) {
            return null;
        }

        return stickerSet;
    };

    async verifyStickerSetOwnerShip(stickerSetName) {
        const stickerSet = await this.telegramService.getStickerSet(stickerSetName);
        const lastSticker = stickerSet.stickers[stickerSet.stickers.length - 1];
        if (lastSticker.is_animated)
            return false;
        const lastStickerPath = await this.fetchLastStickerInSet(lastSticker);

        const message = await this.fetchTextMessage(lastStickerPath);
        if (message == null)
            return false;
        if (message == process.env.VERIFYTEXT)
            return true;
        else return false;

    };

    async fetchLastStickerInSet(lastSticker) {
        const fileId = lastSticker.file_id;
        const file = await this.telegramService.getFile(fileId);
        const stickerDownloadLink = process.env.TELEGRAM_DOWNLOAD_PATH + file.file_path;
        const savingPath = `${this.stickerDownloadPath}${lastSticker.set_name}-${file.file_path}`;
        await this.fileService.downloadImage(stickerDownloadLink, savingPath);
        const pngPath = await this.convertWebpToPNG(savingPath);
        return pngPath;
    };

    async fetchTextMessage(imagePath) {
        winston.info('fetchTextMessage imagePath: ' + imagePath);

        try {
            const textInImage = await ReadText(imagePath);
            return textInImage;
        }
        catch (err) {
            winston.info('fetchTextMessage - error in reading text from image:' + err);
            return null;
        }

    };

    async convertWebpToPNG(webpPath) {
        const pngPath = webpPath.replace(".webp", ".png");
        await webp.dwebp(webpPath, pngPath, "-o", "-v");

        return pngPath;

    }


};

module.exports = StickerSetValidationService;

