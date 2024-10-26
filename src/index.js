const express = require('express');
const connectDB = require('./config/db');
const ProductRouter = require('./router/ProductRouter');
const BannerRouter = require('./router/BannerRouter');
const AuthRouter = require('./router/AuthRouter');
const LayoutRouter = require('./router/LayoutRouter');
const cors = require('cors');
const path = require('path');

const app = express();
connectDB();

const corsOptions = {
    origin: 'http://localhost:3000', // frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// Serve static files for the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routers
app.use('/api/v1/products', ProductRouter);
app.use('/api/v1/banners', BannerRouter);  // Ensure BannerRouter path is correct
app.use('/api/v1/layout', LayoutRouter);
app.use('/api/v1/auth', AuthRouter);

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
