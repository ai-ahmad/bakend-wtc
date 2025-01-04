const express = require('express');
const router = express.Router();
const ProductCategory = require('../models/CategoryModels');
const mongoose = require('mongoose');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid product category ID' });
    }
    next();
}

// Middleware to get product category by ID
async function getProductCategory(req, res, next) {
    let productCategory;
    try {
        productCategory = await ProductCategory.findById(req.params.id);
        if (!productCategory) {
            return res.status(404).json({ message: 'Product category not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.productCategory = productCategory;
    next();
}

/**
 * @swagger
 * tags:
 *   name: Product Category
 *   description: Product category management API
 */

/**
 * @swagger
 * /api/product-categories/create:
 *   post:
 *     tags: [Product Category]
 *     description: Create a new product category
 *     parameters:
 *       - name: product_category_name
 *         in: body
 *         description: The name of the product category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Product category created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create', async (req, res) => {
    if (!req.body.product_category_name || req.body.product_category_name.trim() === '') {
        return res.status(400).json({ message: 'Product category name is required' });
    }

    const productCategory = new ProductCategory({
        product_category_name: req.body.product_category_name.trim(),
    });

    try {
        const savedProductCategory = await productCategory.save();
        res.status(201).json(savedProductCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/product-categories:
 *   get:
 *     tags: [Product Category]
 *     description: Get all product categories
 *     responses:
 *       200:
 *         description: A list of product categories
 */
router.get('/', async (req, res) => {
    try {
        const productCategories = await ProductCategory.find();
        res.status(200).json(productCategories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/product-categories/{id}:
 *   get:
 *     tags: [Product Category]
 *     description: Get a single product category by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product category ID
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product category details
 *       404:
 *         description: Product category not found
 */
router.get('/:id', validateObjectId, getProductCategory, (req, res) => {
    res.status(200).json(res.productCategory);
});

/**
 * @swagger
 * /api/product-categories/{id}:
 *   patch:
 *     tags: [Product Category]
 *     description: Update a product category by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product category ID
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *       - name: product_category_name
 *         in: body
 *         description: The name of the product category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product category not found
 */
router.patch('/:id', validateObjectId, getProductCategory, async (req, res) => {
    if (req.body.product_category_name && req.body.product_category_name.trim() !== '') {
        res.productCategory.product_category_name = req.body.product_category_name.trim();
    } else {
        return res.status(400).json({ message: 'Product category name is required for update' });
    }

    try {
        const updatedProductCategory = await res.productCategory.save();
        res.status(200).json(updatedProductCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/product-categories/{id}:
 *   delete:
 *     tags: [Product Category]
 *     description: Delete a product category by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product category ID
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product category deleted successfully
 *       404:
 *         description: Product category not found
 */
router.delete('/:id', validateObjectId, async (req, res) => {
    try {
        const deletedProductCategory = await ProductCategory.findByIdAndDelete(req.params.id);
        if (!deletedProductCategory) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).json({ message: 'Product category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
