// Importación de modelo
const album = require("../models/album");
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

const list = (req, res) => {
    // Sacar el id del artista de la url
    const artistId = req.params.artistId;

    if(!artistId){
        return res.status(404).json({
            status: "error",
            message: "Falta el ID del artista en la petición"
        });
    }

    // Sacar todos los albums de la BBDD de un artista en concreto
    Album.find({artist: artistId}).populate("artist")
        .then((albums) => {
            return res.status(200).json({
                status: "success",
                message: "Metodo listar albums",
                albums
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "Error en la consulta de los albums"
            });
        });

};


const update = (req, res) => {
    // Recoger parametro por url
    const albumId = req.params.albumId;

    // Recoger el body
    const params = req.body;

    // Find y update
    Album.findByIdAndUpdate(albumId, params, {new: true})
        .then((albumUpdated) => {
            return res.status(200).json({
                status: "success",
                message: "Método para actualizar un album",
                album: albumUpdated
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "No se ha actualizado el album"
            });
        });
};

module.exports = {
    prueba,
    save,
    one,
    list,
    update
}