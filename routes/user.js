// Importar dependencias
const exprees = require("express");

// Cargar Router
const router = exprees.Router();

// Importar controlador
const UserController = require("../controllers/user");

// Definir rutas
router.get("/test", UserController.prueba);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Exportar router
module.exports = router;