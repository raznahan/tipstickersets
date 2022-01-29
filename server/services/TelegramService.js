
 class TelegramService {
    
    constructor(bot){
        this.bot = bot;
    };

    async sendMessage(userId,text) {
        await this.bot.sendMessage(userId,text);

    };

    async getStickerSet(name){
        return await this.bot.getStickerSet(name);
    };

};

module.exports = TelegramService;