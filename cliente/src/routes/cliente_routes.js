const { Router } = require("express");
const { ClienteController } = require("../controllers/cliente_controller");

const router = Router();

router.post("/clients", ClienteController.create);
router.get("/clients", ClienteController.getAll);
router.get("/clients/:id", ClienteController.getById);
router.patch("/clients/:id", ClienteController.update);
router.delete("/clients/:id", ClienteController.delete);

// Alias paths to support API gateway mappings (/users -> /clients)
router.get("/users", ClienteController.getAll);
router.get("/users/:id", ClienteController.getById);

module.exports = router;