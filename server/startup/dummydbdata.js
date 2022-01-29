const { StickerSet } = require('../models/stickerSet');
const { Owner } = require('../models/owner');
const winston = require('winston');

const createSet = (index, owner) => {
    return { name: 'name' + index, title: 'title' + index, owner: owner, tips: index, isActive: true, ownerVerified: true };
}

module.exports = async () => {
    var owner1 = new Owner({ wallet: '0x0112bEf73098Ca5Cb9d62fDD35BEA9cD778a40F1' });
    var owner2 = new Owner({ wallet: '0xF395524d4a731462448f6747306a2ca4bb1B7038' });
    var owner3 = new Owner({ wallet: '0x2ebEe25fDfe3F9f427358dBD7d45102065Ab2f26' });
    var owner4 = new Owner({ wallet: '0xcF01c62272ed383fb7b4Cec15439Ed8cEF4cF09C' });

    var owners = [owner1, owner2, owner3, owner4];

    await Owner.insertMany(owners);

    const dummyStickerSets = [];

    for (let i = 0; i < 100; i++) {
        dummyStickerSets.push(createSet(i, owner4._id));
    }


    // var stickerset1 = new StickerSet({ title: 'title1', name: 'name1', owner: owner4._id, ownerVerified: true, isActive: true });
    // var stickerset2 = new StickerSet({ title: 'title2', name: 'name2', owner: owner4._id, ownerVerified: true, isActive: true });
    // var stickerset3 = new StickerSet({ title: 'title3', name: 'name3', owner: owner4._id, ownerVerified: true, isActive: true });
    // var stickerset4 = new StickerSet({ title: 'title4', name: 'name4', owner: owner4._id, ownerVerified: true, isActive: true });
    // var stickerset5 = new StickerSet({ title: 'title5', name: 'name5', owner: owner4._id, ownerVerified: true, isActive: true });
    // var stickerset6 = new StickerSet({ title: 'title6', name: 'name6', owner: owner4._id, ownerVerified: true, isActive: true });
    // var stickerset7 = new StickerSet({ title: 'title7', name: 'name7', owner: owner4._id, ownerVerified: true, isActive: true });
    // var stickerset8 = new StickerSet({ title: 'title8', name: 'name8', owner: owner4._id, ownerVerified: true, isActive: true });

    // var stickersets = [stickerset1, stickerset2, stickerset3, stickerset4, stickerset5, stickerset6, stickerset7, stickerset8];

    await StickerSet.insertMany(dummyStickerSets);


}
