const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db'); // Assuming this is your MongoDB connection file

// Import routers
const ProductRouter = require('./src/router/ProductRouter');
const BannerRouter = require('./src/router/BannerRouter');
const AuthRouter = require('./src/router/AuthRouter');
const LayoutRouter = require('./src/router/LayoutAboutRouter');
const ApplicationRouter = require('./src/router/ApplicationRouter');
const NewsRouter = require('./src/router/NewsRouter');
const LayoutTypeRouter = require('./src/router/AboutLayoutTypeRouter');
const CategoryRouter = require('./src/router/CategoryRouter');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }))  // Parse incoming JSON requests
app.use(cors(corsOptions));  // Enable CORS for frontend

// Static file serving (for image uploads, etc.)
app.use('/api/v1/upload', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/products', ProductRouter);
app.use('/api/v1/banners', BannerRouter);
app.use('/api/v1/layout', LayoutRouter);
app.use('/api/v1/layout-type', LayoutTypeRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/applications', ApplicationRouter);
app.use('/api/v1/categories', CategoryRouter);
app.use('/api/v1/news', NewsRouter);

// Root route to check server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Port setup
const PORT = process.env.PORT || 9000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
