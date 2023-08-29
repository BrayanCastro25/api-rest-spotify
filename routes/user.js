// Importar dependencias
const exprees = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = exprees.Router();

// Importar controlador
const UserController = require("../controllers/user");

// Definir rutas
router.get("/test", check.auth, UserController.prueba);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.put("/update", check.auth, UserController.update);

// Exportar router
module.exports = router;