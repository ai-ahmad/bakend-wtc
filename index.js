const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./src/config/db');
const ProductRouter = require('./src/router/ProductRouter');
const BannerRouter = require('./src/router/BannerRouter');
const AuthRouter = require('./src/router/AuthRouter');
const ApplicationRouter = require('./src/router/ApplicationRouter');
const NewsRouter = require('./src/router/NewsRouter');
const CategoryRouter = require('./src/router/CategoryRouter');
const NewsTypeRouter = require('./src/router/NewsTypeRotuer');

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow all origins with CORS
app.use(cors()); // This will allow requests from any origin

// Static file serving for uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, 'uploads', req.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }
  next();
}, express.static(uploadDir));

// API routes
app.use('/api/v1/products', ProductRouter);
app.use('/api/v1/banners', BannerRouter);
app.use('/api/v1/news-type', NewsTypeRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/applications', ApplicationRouter);
app.use('/api/v1/categories', CategoryRouter);
app.use('/api/v1/news', NewsRouter);

// Start the server
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
