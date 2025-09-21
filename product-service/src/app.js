const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Main route for the product microservice
app.use('/products', productRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Product Microservice' });
});

module.exports = app;