const winston = require('winston');
const StringService = require('../services/StringService');

class StickerService {
    constructor(telegramService, fileService, stickerset) {
        this.telegramService = telegramService;
        this.fileService = fileService;
        this.StickerSet = stickerset;
        this.thumbnailDownloadPath = './media/';
    }

    async downloadAndSaveStickerSetThumbnail(stickersets) {
        for (const item of stickersets) {
            if (!item.thumbnail) {
                const stickerset = await this.telegramService.getStickerSet(item.name);
                const fileId = stickerset.stickers[0].thumb.file_id;
                const file = await this.telegramService.getFile(fileId);
                const thumbnailDownloadLink = process.env.TELEGRAM_DOWNLOAD_PATH + file.file_path;
                const savingPath = this.thumbnailDownloadPath + item.name + '/' + file.file_path;
                await this.fileService.downloadImage(thumbnailDownloadLink, savingPath);
                item.thumbnail = savingPath.substring(1);
                item.lastEdited = Date.now();
                await this.StickerSet.updateOne({ _id: item._id }, { $set: { thumbnail: item.thumbnail, lastEdited: item.lastEdited } });
            }
        }
        return stickersets;
    };

   
}

module.exports = StickerService;