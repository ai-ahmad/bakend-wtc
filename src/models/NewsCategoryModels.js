const mongoose = require('mongoose');


const CategroyNewsSchema = mongoose.Schema({
    category_name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('CategoryNews', CategroyNewsSchema)