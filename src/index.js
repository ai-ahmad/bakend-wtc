const express = require('express');
const connectDB = require('./config/db');
const ProductRouter = require('./router/ProductRouter');
const BannerRouter = require('./router/BannerRouter');
const CategoryRouter = require('./router/CategoryRouter');
const AuthRouter = require('./router/AuthRouter');
const ApplicationRouter = require('./router/ApplicationRouter')
const NewsCategoryRouter = require('./router/NewsCategoryModel')
const NewsRouter = require('./router/NewsRouter')

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
app.use('/api/v1/products', ProductRouter)
app.use('/api/v1/news-category', NewsCategoryRouter)
app.use('/api/v1/banners', BannerRouter)
app.use('/api/v1/upload', express.static('uploads'))
app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/applications', ApplicationRouter)
app.use('/api/v1/categories', CategoryRouter)
app.use('/api/v1/news', NewsRouter)


// Middleware for parsing JSON
app.use(express.json());

// Serve static files for the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
