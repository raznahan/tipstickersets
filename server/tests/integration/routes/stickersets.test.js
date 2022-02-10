const request = require('supertest');
const mongoose = require('mongoose');
const { StickerSet } = require('../../../models/stickerSet');
const { Owner } = require('../../../models/owner');
const winston = require('winston');
const CombinedStream = require('combined-stream');
const TelegramBot = require('node-telegram-bot-api');
const TelegramService = require('../../../services/TelegramService');
const token = 'fake token';
const telegramService = new TelegramService(new TelegramBot(token));
const StickerService = require('../../../services/StickerService');
const FileService = require('../../../services/FileService');
const fileService = new FileService();
const stickerService = new StickerService(telegramService, fileService);

let server;

describe('/api/stickersets', () => {
    let path = '';
    const stickerSetBulkSize = 120;
    const stickerSetLimit = 100;
    let dummyStickerSets = [];
    let page, count;
    let postData;

    beforeEach(() => {
        server = require('../../../server');
        postData = null;
        path = '/api/stickersets';
        dummyStickerSets = [];
    });
    afterEach(async () => {
        await server.close();
        await StickerSet.deleteMany({});
        await Owner.deleteMany({});
    });

    const sendGETRequest = async () => {
        return await request(server)
            .get(path);
    }
    const sendPOSTRequest = async (postData) => {
        return await request(server)
            .post(path)
            .send(postData);
    }
    const createDummyStickerSets = (count) => {
        for (let i = 0; i < count; i++) {
            dummyStickerSets.push(createSet(i));
        }
    };
    const createOwner = async () => {
        const walletAddress = '0x3078c9Cd04dCf7307841DeF8EC53b6BAa480F34f';
        let owner = new Owner({
            wallet: walletAddress
        });
        return await owner.save();
    }
    const createSet = (index) => {
        return { name: 'name' + index, title: 'title' + index, tips: index, thumbnail: 'dummy thumbnail', isActive: true, ownerVerified: true };
    }

    describe('GET /', () => {
        it('should return up to 100 active stickersets whose owner wallets are verified, if no pagination provided', async () => {
            createDummyStickerSets(stickerSetBulkSize);
            await StickerSet.collection.insertMany(dummyStickerSets);
            stickerService.getStickerSetsThumbnail = async (dummyStickerSets) => {
                return dummyStickerSets;
            };
            const result = await sendGETRequest();

            expect(result.status).toBe(200);
            expect(result.body.stickersetList.length).toBeLessThan(stickerSetLimit + 1);
            expect(result.body.stickersetList.length).toBeGreaterThan(0);
            //expect(result.body.some(s => s.name === 'name1')).toBeTruthy();

        });
        it.each(
            [[10, 3, 3],
            [10, 3, 4],
            [10, 3, 5],
            [10, 1, 10],
            [10, 1, 9],
            [9, 2, 5],
            [10, 1, 12],
            [10, 2, 5]]
        )('shoud return paginated list of stickersets whose owner wallets are verified  dummyDataSize:%s, count:%s, page:%s',
            async (dummyDataSize, count, page) => {
                createDummyStickerSets(dummyDataSize);
                await StickerSet.collection.insertMany(dummyStickerSets);
                path += '?count=' + count + '&page=' + page;
                const result = await sendGETRequest();
                let skip = (page - 1) * count;
                let remainingItems = dummyDataSize - skip;
                let expectedNumberOfItemsReceived = (remainingItems <= 0) ? 0 : ((remainingItems < count) ? remainingItems % count : count);
                expect(result.status).toBe(200);
                expect(result.body.stickersetList.length).toBe(expectedNumberOfItemsReceived);

            });

    });

    describe('GET /:id', () => {

        it('should return a stickerset if valid id is provided and stickerset is active and owner verified', async () => {
            const stickerSet = new StickerSet({ name: 'stickerset1', title: 'title1', isActive: true, ownerVerified: true });
            await stickerSet.save();

            path = path + "/" + stickerSet._id;

            const result = await sendGETRequest();

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('_id', stickerSet._id.toHexString());

        });
        it('should return 404 if valid id is provided and stickerset is active and owner not verified', async () => {
            const stickerSet = new StickerSet({ name: 'stickerset1', title: 'title1', isActive: true, ownerVerified: false });
            await stickerSet.save();

            path = path + "/" + stickerSet._id;

            const result = await sendGETRequest();

            expect(result.status).toBe(404);

        });

        it('should return 404 if invalid id is provided', async () => {
            path = path + "/1";
            const result = await sendGETRequest();

            expect(result.status).toBe(404);
        });

        it('should return 404 if valid id is provided and stickerset is not found', async () => {
            const id = mongoose.Types.ObjectId();
            path = path + "/" + id;
            const result = await sendGETRequest();

            expect(result.status).toBe(404);
        });

    });

    describe('POST /register', () => {

        beforeEach(() => {
            path = path + '/register';
        })
        let stickerSetLink;
        let ownerWalletAddress;

        it('should return 400 if owner wallet address is invalid', async () => {
            ownerWalletAddress = '0x0';
            postData = { stickerSetLink, ownerWalletAddress };
            const result = await sendPOSTRequest(postData);

            expect(result.status).toBe(400);

        });

        it.each([
            ['https://t.me/addstickers/invalidstickerset'],
            ['https://www.google.com'],
            ['http://telegram.me/addstickers/invalidstickerset'],
            ['htp://t.me/addstickers/invalidstickerset']
        ])
            ('should return 400 if stickerset link is invalid. link: %s', async (stickerSetLink) => {
                ownerWalletAddress = '0x3078c9Cd04dCf7307841DeF8EC53b6BAa480F34f';
                postData = { stickerSetLink, ownerWalletAddress };
                const result = await sendPOSTRequest(postData);

                expect(result.status).toBe(400);

            });

        it('should return 200 if owner wallet address is not found', async () => {

            //await createOwner();
            stickerSetLink = 'WorldArt';
            ownerWalletAddress = '0xfE76197fb8b0E19B8750E51694b7d585D91A554a';
            postData = { stickerSetLink, ownerWalletAddress };
            const result = await sendPOSTRequest(postData);

            expect(result.status).toBe(400);

        });
        it.each([
            ['http://t.me/addstickers/WorldArt'],
            ['https://t.me/addstickers/WorldAr'],
            ['t.me/addstickers/Buddy_Bear']
        ])
            ('should return 200 if both stickerset link and owner wallet address are valid. Link is: %s', async (stickerSetLink) => {

                const owner = await createOwner();
                ownerWalletAddress = owner.wallet;
                postData = { stickerSetLink, ownerWalletAddress };
                const result = await sendPOSTRequest(postData);

                expect(result.status).toBe(200);

            });


    });

    describe('POST /updateTip', () => {
        let stickerSetName;
        let currentTip;
        let tips;
        beforeEach(() => {
            stickerSetName = '';
            currentTip = 0;
            tips = 0;
            path = path + '/updateTip';
        });
        const createNewStickerSet = async () => {
            const newStickerSet = new StickerSet({ name: 'some_name', title: 'some_title', tips: currentTip, isActive: true, ownerVerified: true });
            await newStickerSet.save();
            return newStickerSet;

        };
        it('should return 404 if stickerset not found', async () => {
            await createNewStickerSet();
            stickerSetName = 'nonexisting_stickerset_name';
            postData = { name: stickerSetName, tips: tips };
            const result = await sendPOSTRequest(postData);

            expect(result.status).toBe(404);

        });
        it('should update the tip amount', async () => {
            currentTip = 1;
            tips = 0.1;
            const stickerset = await createNewStickerSet();
            stickerSetName = stickerset.name;
            postData = { name: stickerSetName, tips: tips };
            const result = await sendPOSTRequest(postData);

            const finalTipAmount = currentTip + tips;

            expect(result.status).toBe(200);
            expect(result.body.tips).toBe(finalTipAmount);


        });

    });

    // describe('POST /validatesetname',()=>{
    //     beforeEach(() => {        
    //         path = '/api/stickersets/validatesetname';
    //     });
    //     let stickerSetLink;

    //     it.each([
    //         ['https://t.me/addstickers/invalidstickerset'],
    //         ['https://www.google.com'],
    //         ['http://telegram.me/addstickers/invalidstickerset'],
    //         ['htp://t.me/addstickers/invalidstickerset']
    //     ])
    //     ('should return 400 if invalid stickerset link provided. Link is: %s',async(link)=>{
    //         postData ={stickerSetLink:link};
    //         const result = await sendPOSTRequest(postData);

    //         expect(result.status).toBe(400);

    //     });

    //     it.each([
    //         ['https://t.me/addstickers/WorldArt'],
    //         ['t.me/addstickers/WorldArt']
    //     ])
    //     ('should return 200 if valid stickerset link provided. Link is: %s',async(link)=>{
    //         postData={stickerSetLink:link}
    //         const result = await sendPOSTRequest(postData);

    //         expect(result.status).toBe(200);
    //     });
    // });

});
