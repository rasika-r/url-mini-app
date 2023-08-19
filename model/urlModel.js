const mongoose = require('mongoose')
const {generate} = require("shortid")
const urlSchema = new mongoose.Schema({
    original: {
        type: String,
        required: true,
    },
    shorten: {
        type: String,
        default:generate
    },
    created: {
        type: Number,
        default: Date.now,
    },
    clicks: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model('UrlSchema', urlSchema);