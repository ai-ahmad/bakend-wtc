const express = require('express');
const connectDB = require('./config/db');
const  ProductRouter = require('./router/ProductRouter')
const BannerRouter = require('./router/BannerRouter')
const AuthRouter = require('./router/AuthRouter')
const LayoutRouter = require('./router/LayoutRouter')
connectDB()

const app = express();
app.use('/api/v1/products', ProductRouter)
app.use('/api/v1/banners', BannerRouter)
app.use('/api/v1/upload', express.static('uploads'))
app.use('/api/v1/layout', LayoutRouter)
app.use('/api/v1/auth', AuthRouter)


const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})