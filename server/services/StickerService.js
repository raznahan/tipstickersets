const winston = require('winston');
const {create,urlSource} = require('ipfs-http-client');
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

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
                const ipfsResult = await ipfs.add(urlSource(thumbnailDownloadLink));
                winston.info('result:'+ipfsResult.cid);
                item.thumbnail = ipfsResult.cid;
                item.lastEdited = Date.now();
                await this.StickerSet.updateOne({ _id: item._id }, { $set: { thumbnail: item.thumbnail, lastEdited: item.lastEdited } });
            }
        }
        return stickersets;
    };

   
}

module.exports = StickerService;