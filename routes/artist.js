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
router.get("/list/:page?", check.auth, ArtistController.list);
router.put("/update/:id", check.auth, ArtistController.update);

// Exportar router
module.exports = router;