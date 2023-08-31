// Importar modelo
const Artist = require("../models/artist");

const prueba = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Mensaje enviado desde: controllers/artist.js"
    })
};

// Acción guardar artista
const save = (req, res) => {
    // Recoger datos del body
    let params = req.body;

    // Crear el objeto a guardar
    let artist = new Artist(params);

    // Guardar en BBDD
    artist.save()
        .then((artistSaved) => {
            return res.status(200).json({
                status: "success",
                message: "Metodo guardar artista",
                artist: artistSaved
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                message: "No se ha guardado el artista"
            });
        });
    
};

module.exports = {
    prueba,
    save
}