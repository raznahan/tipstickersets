const StickerService = require('../../../services/StickerService');
const TelegramBot = require('node-telegram-bot-api');
const telegramToken = 'dummy token';


describe('getStickerSetsThumbnail', () => {
    let telegramBot = new TelegramBot()
    let stickerService;

    const telegramService = {
        getStickerSet: async (name) => {
            return { stickers: [{ thumb: { file_id: '' } }] };
        },
        getFile: async (file_id) => {
            return { file: { file_path: '' } }
        }
    };
    const fileService = {
        downloadImage: async () => {
            return true;
        }
    };
    const stickersets = [
        {
            name: 'name0',
            thumbnail: null,
            lastEdited: Date.now()
        },
        {
            name: 'name1',
            thumbnail: 'dummy thumbnail',
            lastEdited: Date.now()
        }
    ];
    const StickerSet = {
        updateOne: async () => {
            return true;
        }
    };

    beforeEach(() => {
        stickerService = new StickerService(telegramService, fileService, StickerSet);
    });
    it('should download and save thumbnail if a thumbnail is null', async () => {
        const result = await stickerService.downloadAndSaveStickerSetThumbnail(stickersets);

        expect(result.length).toBe(stickersets.length);
        expect(result[0].thumbnail).toBeTruthy();

    });

});