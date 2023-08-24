// Importar dependencias
const exprees = require("express");

// Cargar Router
const router = exprees.Router();

// Importar controlador
const SongController = require("../controllers/song");

// Definir rutas
router.get("/test", SongController.prueba);

// Exportar router
module.exports = router;