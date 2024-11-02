const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    images: {
        type: Array, 
        required: true
    },
    news_type: { // Corrected typo here
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('NewsWTC', NewsSchema);
