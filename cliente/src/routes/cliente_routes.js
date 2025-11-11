const { Router } = require("express");
const { ClienteController } = require("../controllers/cliente_controller");

const router = Router();

router.post("/clients", ClienteController.create);
router.get("/clients", ClienteController.getAll);
router.get("/clients/:id", ClienteController.getById);
router.patch("/clients/:id", ClienteController.update);
router.delete("/clients/:id", ClienteController.delete);


module.exports = router;