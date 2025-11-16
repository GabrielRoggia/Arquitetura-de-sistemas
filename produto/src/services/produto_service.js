const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const produtoService = {
  async create(data) {
    if (!data.name || data.price === undefined) {
      throw new Error("Name and price are required");
    }
    return prisma.product.create({ data });
  },

  async getAll() {
    return prisma.product.findMany({
      where: { is_deleted: false },
    });
  },

  async getById(id) {
    return prisma.product.findFirst({
      where: {
        id: id, 
        is_deleted: false,
      },
    });
  },

  async update(id, data) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  async softDelete(id) {
    return prisma.product.update({
      where: { id },
      data: { is_deleted: true },
    });
  },

  async updateStock(id, quantity) {
    if (typeof quantity !== "number") {
      throw new Error("Quantity must be a number");
    }
    const product = await this.getById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new Error("Stock cannot be negative");
    }
    return prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
  },
};

module.exports = { produtoService };