// Importar dependencias
const exprees = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = exprees.Router();

// Importar controlador
const AlbumController = require("../controllers/album");

// Definir rutas
router.get("/test", AlbumController.prueba);
router.post("/save", check.auth, AlbumController.save)

// Exportar router
module.exports = router;