const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Product = require('../models/ProdutModel');

const router = express.Router();

// Папки для изображений и PDF
const productImageDir = './uploads/product';
const pdfDir = './uploads/pdf';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         rating:
 *           type: number
 *           description: The rating of the product
 *         volume:
 *           type: number
 *           description: The volume of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         discount_price:
 *           type: number
 *           description: The discounted price of the product
 *         promotion:
 *           type: boolean
 *           description: Whether the product is on promotion
 *         stock:
 *           type: number
 *           description: The stock of the product
 *         ruler:
 *           type: string
 *           description: The ruler of the product
 *         oils_type:
 *           type: string
 *           description: The type of oils in the product
 *         image:
 *           type: object
 *           properties:
 *             main_images:
 *               type: array
 *               items:
 *                 type: string
 *               description: Main images of the product
 *             all_images:
 *               type: array
 *               items:
 *                 type: string
 *               description: All images of the product
 *         product_info_pdf:
 *           type: string
 *           description: The path to the product information PDF
 *       example:
 *         id: "61b6c56e8f1d8e6c0dfab829"
 *         name: "Sample Product"
 *         category: "Category A"
 *         price: 99.99
 *         rating: 4.5
 *         volume: 1.5
 *         description: "This is a sample product."
 *         discount_price: 79.99
 *         promotion: true
 *         stock: 50
 *         ruler: "Sample Ruler"
 *         oils_type: "Synthetic"
 *         image:
 *           main_images: ["/uploads/product/123-main.jpg"]
 *           all_images: ["/uploads/product/123-main.jpg", "/uploads/product/123-other.jpg"]
 *         product_info_pdf: "/uploads/pdf/123-info.pdf"
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The product managing API
 */

// ========== CREATE Product ==========
/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               rating:
 *                 type: number
 *               price:
 *                 type: number
 *               volume:
 *                 type: number
 *               description:
 *                 type: string
 *               discount_price:
 *                 type: number
 *               promotion:
 *                 type: boolean
 *               stock:
 *                 type: number
 *               ruler:
 *                 type: string
 *               oils_type:
 *                 type: string
 *               all_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               main_images:
 *                 type: string
 *                 format: binary
 *               product_info_pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error creating product
 */

// Создаём (если нет)
if (!fs.existsSync(productImageDir)) {
  fs.mkdirSync(productImageDir, { recursive: true });
}
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

// Настраиваем Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Если это PDF => кладём в ./uploads/pdf, иначе в ./uploads/product
    if (file.mimetype === 'application/pdf') {
      cb(null, pdfDir);
    } else {
      cb(null, productImageDir);
    }
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ========== CREATE Product ==========
router.post('/create', upload.fields([
  { name: 'all_images', maxCount: 10 },
  { name: 'main_images', maxCount: 1 },
  { name: 'product_info_pdf', maxCount: 1 },
]), async (req, res) => {
  const { name, category, rating, price, volume, description, discount_price, promotion, stock, ruler, oils_type } = req.body;

  const allImages = req.files['all_images']
    ? req.files['all_images'].map(file => `/uploads/product/${file.filename}`)
    : [];
  const mainImages = req.files['main_images']
    ? req.files['main_images'].map(file => `/uploads/product/${file.filename}`)
    : [];
  const productInfoPdf = req.files['product_info_pdf']
    ? `/uploads/pdf/${req.files['product_info_pdf'][0].filename}`
    : '';

  try {
    const newProduct = new Product({
      name,
      category,
      rating,
      price,
      volume,
      stock,
      ruler,
      description,
      image: {
        main_images: mainImages,
        all_images: allImages,
      },
      product_info_pdf: productInfoPdf,
      discount_price,
      promotion,
      oils_type,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// ========== READ Product by ID ==========
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The product was found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error fetching product
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// ========== READ all Products ==========
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error fetching products
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// ========== UPDATE Product by ID ==========
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               rating:
 *                 type: number
 *               price:
 *                 type: number
 *               volume:
 *                 type: number
 *               description:
 *                 type: string
 *               discount_price:
 *                 type: number
 *               promotion:
 *                 type: boolean
 *               stock:
 *                 type: number
 *               ruler:
 *                 type: string
 *               oils_type:
 *                 type: string
 *               all_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               main_images:
 *                 type: string
 *                 format: binary
 *               product_info_pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error updating product
 */
router.put('/:id', upload.fields([
  { name: 'all_images', maxCount: 10 },
  { name: 'main_images', maxCount: 1 },
  { name: 'product_info_pdf', maxCount: 1 },
]), async (req, res) => {
  const { name, category, rating, price, volume, description, discount_price, promotion, stock, ruler, oils_type } = req.body;

  const allImages = req.files['all_images']
    ? req.files['all_images'].map(file => `/uploads/product/${file.filename}`)
    : [];
  const mainImages = req.files['main_images']
    ? req.files['main_images'].map(file => `/uploads/product/${file.filename}`)
    : [];
  const productInfoPdf = req.files['product_info_pdf']
    ? `/uploads/pdf/${req.files['product_info_pdf'][0].filename}`
    : '';

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name,
      category,
      rating,
      price,
      volume,
      stock,
      ruler,
      description,
      image: {
        main_images: mainImages,
        all_images: allImages,
      },
      product_info_pdf: productInfoPdf,
      discount_price,
      promotion,
      oils_type,
    }, { new: true });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// ========== DELETE Product ==========
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The product was successfully deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
