const express = require('express');
const connectDB = require('./src/config/db');
const ProductRouter = require('./src/router/ProductRouter');
const BannerRouter = require('./src/router/BannerRouter');
const AuthRouter = require('./src/router/AuthRouter');
const ApplicationRouter = require('./src/router/ApplicationRouter')
const NewsRouter = require('./src/router/NewsRouter')
const CategoryRouter = require('./src/router/CategoryRouter')
const NewsTypeRouter = require('./src/router/NewsTypeRotuer')
const cors = require('cors');
const path = require('path');

const app = express();
connectDB();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:3000', 'https://wts-admin-xyyj.vercel.app'],
}));

app.use(cors(corsOptions));
app.use('/api/v1/products', ProductRouter)
app.use('/api/v1/banners', BannerRouter)
app.use('/api/v1/news-type', NewsTypeRouter)
app.use('/api/v1/upload', express.static('uploads'))
app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/applications', ApplicationRouter)
app.use('/api/v1/categories', CategoryRouter)
app.use('/api/v1/news', NewsRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
