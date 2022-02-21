var mongoose = require('mongoose');
const winston = require('winston');

var stickerSetSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner'
    },
    ownerVerified: {
        type: Boolean,
        default: false
    },
    ownerVerifiedDate: {
        type: Date,
        default: Date.parse('1999-01-01')
    },
    tips: {
        type: Number,
        default: 0
    },
    isTipped: {
        type: Boolean,
        default: false
    },
    thumbnail:{
        type: String
    },
    created: {
        type: Date,
        default: Date.now,
    },
    lastEdited: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: false
    }
})

const StickerSet = mongoose.model('StickerSet', stickerSetSchema);

module.exports.stickerSetSchema = stickerSetSchema;
module.exports.StickerSet = StickerSet;
