const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// POST /products -> Create a new product
router.post('/', productController.createProduct);

// GET /products?ws=true -> Get all products (ws = with stock)
router.get('/', productController.getAllProducts);

// GET /products/:id -> Get a single product by ID
router.get('/:id', productController.getProductById);

// PATCH /products/:id -> Partially update a product's details
router.patch('/:id', productController.updateProduct);

// DELETE /products/:id -> Soft delete a product
router.delete('/:id', productController.deleteProduct);

// PATCH /products/:id/stock -> Update only the stock of a product
router.patch('/:id/stock', productController.updateStock);

module.exports = router;