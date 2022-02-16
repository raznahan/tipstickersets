const request = require('supertest');
const StickerSetValidationService = require('../../../services/StickerSetValidationService');
const {Owner} = require('../../../models/owner');
const {StickerSet} = require('../../../models/stickerSet');

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
    const createOwner = async (walletAddress) => {
        let owner = new Owner({
            wallet: walletAddress
        });
        return await owner.save();
    }
    const createStickerSet = async (name,owner) => {
        let stickerSet = new StickerSet({
            owner: owner._id,
            name:name,
            title:'title'
        });
        return await stickerSet.save();
    }
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
    describe('POST /showverificationimage', () => {
        let stickerSetName = '';
        let wallet = '';
        beforeEach(() => {
            path = path + '/showverificationimage';
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



    });
    describe('POST /verifyownership',()=>{
        let stickerSetName = '';
        let wallet = '';
        beforeEach(() => {
            path = path + '/verifyownership';
            stickerSetName = '';
            wallet = '';
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
            stickerSetName = 'ghalbtest34_by_demybot';
            const owner = await createOwner('0x36141f8675BA2976a96509885dE13B3dFAE6Df7D');
            await createStickerSet(stickerSetName,owner);
            postData = { stickerSetName, wallet:owner.wallet };

            const result = await sendPOSTRequest(postData);

            expect(result.status).toBe(200);
        });
    })

});