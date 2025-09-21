// src/services/clientService.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10; // Fator de custo para o hash da senha

/**
 * Creates a new client in the database after hashing their password.
 * @param {object} clientData - The data for the new client (name, email, password).
 * @returns {Promise<object>} The created client object.
 */
const createClient = async (clientData) => {
  const { name, email, password } = clientData;

  // Gera o hash da senha antes de salvar
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const client = await prisma.clients.create({
    data: {
      name,
      email,
      password: hashedPassword, // Salva a senha com hash
    },
  });
  return client;
};

/**
 * Retrieves all non-deleted clients from the database.
 * The password field is excluded from the result.
 * @returns {Promise<Array<object>>} A list of all non-deleted clients.
 */
const getAllClients = async () => {
  const clients = await prisma.clients.findMany({
    where: {
      is_deleted: false,
    },
    // Seleciona os campos que queremos retornar, excluindo a senha
    select: {
      id: true,
      name: true,
      email: true,
      is_deleted: true,
    },
  });
  return clients;
};

/**
 * Retrieves a single non-deleted client by its ID.
 * The password field is excluded from the result.
 * @param {string|number} clientId - The ID of the client to retrieve.
 * @returns {Promise<object|null>} The client object or null if not found.
 */
const getClientById = async (clientId) => {
  const client = await prisma.clients.findUnique({
    where: {
      id: clientId,
      is_deleted: false,
    },
    // Novamente, excluindo a senha da consulta
    select: {
      id: true,
      name: true,
      email: true,
      is_deleted: true,
    },
  });
  return client;
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
};