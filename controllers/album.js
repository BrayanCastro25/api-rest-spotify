// Importación de modelo
const Album = require("../models/album");

const prueba = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Mensaje enviado desde: controllers/album.js"
    })
};

const save = (req, res) => {

    // Sacar datos del body
    let params = req.body;

    // Crear objeto
    let album = new Album(params);

    // Guardar el objeto
    album.save()
        .then((albumStored) => {
            return res.status(200).json({
                status: "success",
                message: "Metodo guardar album",
                albumStored
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                message: "Error al guardar el album"
            });
        });
}

const one = (req, res) => {
    // Sacar el id del album
    albumId = req.params.id;

    // Find y popular el artista
    Album.findById(albumId)
        .populate("artist")
        .then((album) => {
            return res.status(200).json({
                status: "success",
                message: "Metodo mostrar album",
                album
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "Error al consultar el album"
            });
        });

};

module.exports = {
    prueba,
    save,
    one
}