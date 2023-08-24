// Importar dependencias
const exprees = require("express");

// Cargar Router
const router = exprees.Router();

// Importar controlador
const ArtistController = require("../controllers/artist");

// Definir rutas
router.get("/test", ArtistController.prueba);

// Exportar router
module.exports = router;