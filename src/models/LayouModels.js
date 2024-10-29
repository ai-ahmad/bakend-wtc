const mongoose = require('mongoose');

const LayoutSchema = new mongoose.Schema({
    sectionTheme: {
        type: [String], 
        required: true,
        enum: ['lemarc1', 'lemarc2', 'lemarc3', 'lemarc4', 'lemarc5', 'lemarc6'] 
    },
    images: {
        type: [String], 
        required: false
    },
    title: {
        type: [String], 
        required: false
    },
    badges: {
        type: [String], 
        required: false
    },
    description: {
        type: [String], 
        required: false
    }
});
const Layout = mongoose.model('LayoutWTC', LayoutSchema);
module.exports = Layout;
