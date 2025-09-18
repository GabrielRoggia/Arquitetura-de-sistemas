// src/controllers/clientController.js

const clientService = require('../services/clientService');

/**
 * Controller to handle the creation of a new client.
 * POST /clients
 */
const createClientController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação básica dos dados de entrada
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Bad Request: Name, email, and password are required.' });
    }

    const newClient = await clientService.createClient({ name, email, password });
    
    // NUNCA retorne a senha na resposta
    const { password: _, ...clientWithoutPassword } = newClient;

    res.status(201).json(clientWithoutPassword); // 201 Created
  } catch (error) {
    // Erro comum do Prisma para violação de campo único (ex: email já existe)
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Bad Request: Email already in use.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Controller to handle fetching all clients.
 * GET /clients
 */
const getAllClientsController = async (req, res) => {
  try {
    const allClients = await clientService.getAllClients();
    res.status(200).json(allClients); // 200 OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Controller to handle fetching a single client by ID.
 * GET /clients/:id
 */
const getClientByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Se você estiver usando ID autoincremental, precisa converter para Int
    // const clientId = parseInt(id, 10);
    // if (isNaN(clientId)) {
    //   return res.status(400).json({ message: 'Bad Request: Invalid client ID format.' });
    // }
    // const client = await clientService.getClientById(clientId);
    
    // Se estiver usando UUID (string), a conversão não é necessária
    const client = await clientService.getClientById(id);

    if (!client) {
      return res.status(404).json({ message: 'Not Found: Client not found.' }); // 404 Not Found
    }

    res.status(200).json(client); // 200 OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createClientController,
  getAllClientsController,
  getClientByIdController,
};