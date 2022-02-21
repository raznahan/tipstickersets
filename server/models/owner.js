var mongoose = require("mongoose");

var ownerSchema = new mongoose.Schema({
    wallet: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    lastConnected: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastEdited: {
        type: Date,
        default: Date.now
    }
});

const Owner = mongoose.model('Owner', ownerSchema);



module.exports.ownerSchema = ownerSchema;
module.exports.Owner = Owner;