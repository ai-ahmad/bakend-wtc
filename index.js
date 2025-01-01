const express = require('express');
const connectDB = require('./src/config/db');
const ProductRouter = require('./src/router/ProductRouter');
const BannerRouter = require('./src/router/BannerRouter');
const AuthRouter = require('./src/router/AuthRouter');
const ApplicationRouter = require('./src/router/ApplicationRouter');
const NewsRouter = require('./src/router/NewsRouter');
const CategoryRouter = require('./src/router/CategoryRouter');
const NewsTypeRouter = require('./src/router/NewsTypeRouter');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));

// Static file serving for uploads
const uploadDir = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

// API routes
app.use('/api/v1/products', ProductRouter);
app.use('/api/v1/banners', BannerRouter);
app.use('/api/v1/news-type', NewsTypeRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/applications', ApplicationRouter);
app.use('/api/v1/categories', CategoryRouter);
app.use('/api/v1/news', NewsRouter);

// Route to retrieve list of files in uploads directory
app.get('/api/v1/uploads', (req, res) => {
  const { folder } = req.query; // Optional query parameter to specify subfolder
  const directoryPath = folder ? path.join(uploadDir, folder) : uploadDir;

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading directory', error: err.message });
    }
    res.status(200).json({ files });
  });
});

// Start the server
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
