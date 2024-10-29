const mongoose = require('mongoose');

const LayoutSchema = new mongoose.Schema({
    sectionTheme: {
        type: [String], 
        required: true,
        enum: ['lemarc1', 'lemarc2', 'lemarc3', 'lemarc4', 'lemarc5', 'lemarc6'] 
    },
    images: {
        type: [String], 
        required: true
    },
    title: {
        type: [String], 
        required: true
    },
    badges: {
        type: [String], 
        required: true
    },
    description: {
        type: [String], 
        required: true
    }
});
const Layout = mongoose.model('Layout', LayoutSchema);
module.exports = Layout;
