const mongoose = require('mongoose');

const AboutTypeSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('TypeLayoutAbout', AboutTypeSchema);
