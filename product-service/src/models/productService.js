const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Service to create a new product
const createProduct = async (productData) => {
    return await prisma.products.create({
        data: productData,
    });
};

// Service to find all products, with an option to filter by stock
const findAllProducts = async (withStock) => {
    const whereClause = {
        is_deleted: false,
    };

    if (withStock) {
        whereClause.stock = {
            gt: 0, // 'gt' means greater than
        };
    }

    return await prisma.products.findMany({
        where: whereClause,
    });
};

// Service to find a single product by its ID
const findProductById = async (id) => {
    return await prisma.products.findUnique({
        where: {
            id: id,
            is_deleted: false,
        },
    });
};

// Service to partially update a product's details
const updateProduct = async (id, updateData) => {
    return await prisma.products.update({
        where: { id: id },
        data: updateData,
    });
};

// Service to update only the stock of a product
const updateStock = async (id, newStock) => {
    return await prisma.products.update({
        where: { id: id },
        data: {
            stock: newStock,
        },
    });
};

// Service to soft delete a product
const softDeleteProduct = async (id) => {
    return await prisma.products.update({
        where: { id: id },
        data: {
            is_deleted: true,
        },
    });
};

module.exports = {
    createProduct,
    findAllProducts,
    findProductById,
    updateProduct,
    updateStock,
    softDeleteProduct,
};