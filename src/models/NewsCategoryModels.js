const mongoose = require('mongoose') 


const NewsCategorySchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    }
})


module.exports = mongoose.model("NewsCategory", NewsCategorySchema)