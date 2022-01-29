const mongoose = require('mongoose');

const tipSchema = mongoose.Schema({
    tipper: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'owner',
        required: true,
        index: true
    },
    amount:{
        type:Number,
        required: true
    },
    hash: {
        type:String,
        required:true
    },
    created: {
        type:Date,
        default:Date.now
    }

});

const Tip = mongoose.model('tip',tipSchema);

module.exports.tipSchema = tipSchema;
module.exports.Tip = Tip;