const mongoose = require('mongoose');

const BannerSchema = mongoose.Schema({
    images: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('BannerWTC', BannerSchema);