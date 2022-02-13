
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
        it('should return 400 if invalid sticker set name provided', async () => {
            const stickerSetName = 'invalid sticker set link';
            postData = { stickerSetName };

            const result = await sendPOSTRequest(postData)

            expect(result.status).toBe(400);

        });
        it('should return 200 if valid sticker set link provided', async () => {
            const stickerSetName = 'WorldArt';
            postData = { stickerSetName };

            const result = await sendPOSTRequest(postData)

            expect(result.status).toBe(200);

        });


    });
    describe('POST /createverificationimage', () => {
        let stickerSetName='';
        let wallet='';
        beforeEach(() => {
            path = path + '/createverificationimage';
            stickerSetName = '';
            wallet = '';
        });

        it('should return 400 if invalid stickerset name provided.', async () => {
            stickerSetName = 'invalid sticker set link';
            postData = { stickerSetName };

            const result = await sendPOSTRequest(postData)

            expect(result.status).toBe(400);
        });
        it('should return 400 if wallet address not provided', async () => {
            stickerSetName = 'worldart';
            postData = { stickerSetName };

            const result = await sendPOSTRequest(postData)

            expect(result.status).toBe(400);
        });
        it('should return 400 if stickerset name not provided', async () => {
            wallet = '0x3078c9Cd04dCf7307841DeF8EC53b6BAa480F34f';
            postData = { wallet };

            const result = await sendPOSTRequest(postData)

            expect(result.status).toBe(400);
        });
        it('should return 200 if valid stickerset name and wallet address are provided', async () => {
            stickerSetName = 'worldart';
            wallet = '0x3078c9Cd04dCf7307841DeF8EC53b6BAa480F34f';
            postData = { stickerSetName, wallet };

            const result = await sendPOSTRequest(postData);

            expect(result.status).toBe(200);
        });



    })

});