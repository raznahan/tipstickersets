const { StickerSet } = require('../models/stickerSet');
const { Owner } = require('../models/owner');
const stickersetData = require('../resources/data/stickersets-initialdata.json');
const ownersData = require('../resources/data/owners-initialdata.json');

const importData = async () => {
    await Owner.insertMany(ownersData);
    await StickerSet.insertMany(stickersetData);
}

module.exports = importData;
