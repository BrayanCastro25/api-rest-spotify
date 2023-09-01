// Importar dependencias
const exprees = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = exprees.Router();

// Importar controlador
const ArtistController = require("../controllers/artist");

// Configuración de subida
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/artists/");
    },
    filename: (req, file, cb) => {
        cb(null, "artist-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

// Definir rutas
router.get("/test", ArtistController.prueba);
router.post("/save", check.auth, ArtistController.save);
router.get("/profile/:id", check.auth, ArtistController.profile);
router.get("/list/:page?", check.auth, ArtistController.list);
router.put("/update/:id", check.auth, ArtistController.update);
router.delete("/remove/:id", check.auth, ArtistController.remove)
router.post("/upload/:id", [check.auth, uploads.single("file0")], ArtistController.upload);
router.get("/image/:file", ArtistController.image);

// Exportar router
module.exports = router;