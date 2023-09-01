// Importar dependencias
const exprees = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = exprees.Router();

// Importar controlador
const ArtistController = require("../controllers/artist");

// Definir rutas
router.get("/test", ArtistController.prueba);
router.post("/save", check.auth, ArtistController.save);
router.get("/profile/:id", check.auth, ArtistController.profile);

// Exportar router
module.exports = router;