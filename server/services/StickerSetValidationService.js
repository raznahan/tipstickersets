
const StringService = require('../services/StringService');

class StickerSetValidationService {
    constructor(telegramService){
        this.telegramService = telegramService;
    }

    async validateAndFetchStickerSet(link) {
        const stringService = new StringService();
        let stickerSet;
        let stickerSetName;
        let stickerSetUrl;
        try {
            stickerSetUrl = stringService.insertHttpsIfNeeded(link);
            stickerSetUrl = new URL(stickerSetUrl);
            stickerSetName = stickerSetUrl.toString().split("/").pop();
            stickerSet = await this.telegramService.getStickerSet(stickerSetName);
        }
        catch (err) {
            console.log(err);
            return null;
        }

        return stickerSet;
    };


};

module.exports = StickerSetValidationService;

