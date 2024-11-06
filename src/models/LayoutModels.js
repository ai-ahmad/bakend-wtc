const mongoose = require('mongoose');

const layoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    text1: [
        {
            number_text: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }
    ],
    text2: [
        {
            number_text: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }
    ],
    text3: [
        {
            number_text: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }
    ],
    text4: [
        {
            number_text: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }
    ],
    bg_images: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Layout', layoutSchema);
