const productService = require('../models/productService');

const createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ message: 'Name and price are required.' });
        }

        const newProduct = await productService.createProduct({ name, price, stock });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const withStock = req.query.ws === 'true';
        const products = await productService.findAllProducts(withStock);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.findProductById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        // Ensure we don't update forbidden fields
        const updateData = {};
        if (name) updateData.name = name;
        if (price !== undefined) updateData.price = price;
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update.' });
        }

        const updatedProduct = await productService.updateProduct(id, updateData);
        res.status(200).json(updatedProduct);
    } catch (error) {
        // Prisma throws an error if the record to update is not found
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productService.softDeleteProduct(id);
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (stock === undefined || typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ message: 'A valid stock number is required.' });
        }

        const updatedProduct = await productService.updateStock(id, stock);
        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateStock,
};