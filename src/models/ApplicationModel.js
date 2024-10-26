const { application } = require('express');
const mongoose = require('mongoose');


const ApplicationSchmea = mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    application_type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Application', ApplicationSchmea);