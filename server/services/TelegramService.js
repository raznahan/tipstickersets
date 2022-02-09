class TelegramService {
    constructor(bot) {
        this.bot = bot;
    };
    async sendMessage(userId, text) {
        await this.bot.sendMessage(userId, text);

    };
    async getStickerSet(name) {
        return await this.bot.getStickerSet(name);
    };
    async getFile(file_id){
        return await this.bot.getFile(file_id);
    };

};

module.exports = TelegramService;