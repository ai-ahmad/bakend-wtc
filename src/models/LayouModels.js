const mongoose = require('mongoose');

// Define the layout schema
const LayoutSchema = new mongoose.Schema({
    images: {
        type: [String], // Array of image URLs or file paths
        required: true
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    layout_text_position: {
        type: String,
        required: true,
        enum: ['left', 'right'] // Restrict the position to 'left' or 'right'
    },
    layout_images_position: {
        type: String,
        required: true,
        enum: ['left', 'right'] // Restrict the position to 'left' or 'right'
    }
});

// Create the model using the schema
const Layout = mongoose.model('Layout', LayoutSchema);

// Export the model for use in other parts of your application
module.exports = Layout;
