const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const clientService = {
  async create(data) {
    if (!data.email || !data.name) {
      throw new Error("Email and name are required");
    }
    return prisma.client.create({ data });
  },

  async getAll() {
    return prisma.client.findMany();
  },

  async getById(id) {
    return prisma.client.findUnique({ where: { id } });
  },

  async update(id, data) {
    return prisma.client.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.client.delete({ where: { id } });
  },
};

module.exports = { clientService };