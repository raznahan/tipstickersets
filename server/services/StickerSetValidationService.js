const regexParser = require("regex-parser");


class StickerSetValidationService {
    constructor(telegramService){
        this.telegramService = telegramService;
    }

    async validateAndFetchStickerSet(name) {
        let stickerSet;
        try {
            // stickerSetUrl = stringService.insertHttpsIfNeeded(link);
            // stickerSetUrl = new URL(stickerSetUrl);
            // stickerSetUrl.toString().toLowerCase().search();
            // stickerSetName = stickerSetUrl.toString().split("/").pop();
            // console.log('stickerSetName is:'+stickerSetName);
            stickerSet = await this.telegramService.getStickerSet(name);
        }
        catch (err) {
           // console.log('error in validateAndFetchStickerSet-setName:'+name+'\n'+err);
            return null;
        }

        return stickerSet;
    };


};

module.exports = StickerSetValidationService;

