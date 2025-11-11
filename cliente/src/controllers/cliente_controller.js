const { clientService } = require("../services/cliente_service");

class ClienteController {
  static async create(req, res) {
    try {
      const client = await clientService.create(req.body);
      return res.status(201).json(client);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const clients = await clientService.getAll();
      return res.json(clients);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const client = await clientService.getById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      return res.json(client);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const client = await clientService.update(
        req.params.id,
        req.body
      );
      return res.json(client);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await clientService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = { ClienteController };