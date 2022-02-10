
const request = require('supertest');
const StickerSetValidationService = require('../../../services/StickerSetValidationService');
//let stickerSetValidationService = new StickerSetValidationService();

describe('/api/setverification ', () => {

    let postData;
    let server;
    let path = '';
    beforeEach(() => {
        server = require('../../../server');
        path = '/api/setverification';
        postData = null;
    });
    afterEach(async () => {
        await server.close();
    });
    const sendPOSTRequest = async (postData) => {
        return await request(server)
            .post(path)
            .send(postData);
    }
    describe('POST /validatesetname', () => {

        beforeEach(() => {
            path = path + '/validatesetname';
        });
        it('should return 400 if invalid sticker set link provided', async () => {
            const stickerSetLink = 'invalid sticker set link';
            postData = { stickerSetLink };

            const result = await sendPOSTRequest(postData)

            expect(result.status).toBe(400);

        });
        it('should return 200 if valid sticker set link provided', async () => {
            const stickerSetLink = 'https://t.me/addstickers/WorldArt';
            postData = { stickerSetLink };

            const result = await sendPOSTRequest(postData)

            expect(result.status).toBe(200);

        });


    });

});