// Importar dependencias
const exprees = require("express");

// Cargar Router
const router = exprees.Router();

// Importar middleware auth
const check = require("../middlewares/auth");

// Importar controlador
const SongController = require("../controllers/song");

// Definir rutas
router.get("/test", SongController.prueba);
router.post("/save", check.auth, SongController.save);
router.get("/one/:id", check.auth, SongController.one);

// Exportar router
module.exports = router;