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
    "1_text": [
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
    "2_text": [
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
    "3_text": [
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
    "4_text": [
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
