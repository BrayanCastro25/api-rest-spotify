// Importar dependencias
const exprees = require("express");

// Cargar Router
const router = exprees.Router();

// Importar controlador
const AlbumController = require("../controllers/album");

// Definir rutas
router.get("/test", AlbumController.prueba);

// Exportar router
module.exports = router;