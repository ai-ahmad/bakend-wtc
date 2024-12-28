const mongoose = require('mongoose');

const LayoutAbout1 = mongoose.Schema({
    images: {
        type: [String],  // Assuming it's an array of image URLs (strings)
        required: true,
    },
    date: {
        type: Date,  // Changed to Date for proper date handling
        required: true,
    },
    description: {
        type: [String],
        required: true,
        default: []  // Default to an empty array if not provided
    },
    title: {
        type: String,
        required: true,
    },
    layout_type: {
        type: String,
        default: 'LayoutAbout',
    },
    type: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('LayoutAbout1', LayoutAbout1);
