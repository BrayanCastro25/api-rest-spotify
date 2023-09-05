// Importación de modelo
const Album = require("../models/album");
const Song = require("../models/song");

// Importar dependencias
const fs = require("fs");
const path = require("path");

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


const upload = (req, res) => {

    // Recoger album id
    let albumId = req.params.id;

    // Recoger fichero de imagen y comprobar si existe
    if(!req.file){
        return res.status(404).json({
            status: "error",
            message: "La petición no incluye la imagen",
        })
    }

    // Conseguir el nombre de la imagen
    let image = req.file.originalname;

    // Sacar info de la imagen
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

    // Comprobar si la extensión es válida
    if(extension != "jpg" && extension != "png" && extension != "gif" && extension != "jpeg"){
        // Borrar archivo
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        // Devover error
        return res.status(400).json({
            status: "error",
            message: "La extensión no es válida"
        })
    }

    // Si es correcto, guardar la imagen en la BBDD
    Album.findOneAndUpdate({_id: albumId}, {image: req.file.filename}, {new: true})
        .then((albumUpdated) => {
            return res.status(200).json({
                status: "success",
                album: albumUpdated,
                file: req.file
            });
        })
        .catch((error) => {
            return res.status(200).json({
                status: "error",
                message: "Error en la subida de la imagen del artista"
            });
        })

    
};


const image = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/albums/" + file;

    // Comprobar que existe el fichero
    fs.stat(filePath, (error, exists) => {
        if(error || !exists){
            return res.status(404).json({
                status: "error",
                message: "No existe la imagen"
            })
        }

        return res.sendFile(path.resolve(filePath))
    })

    // Devolve el fichero
};

const remove = async(req, res) => {
    // Sacar el id del album de la url
    const albumId = req.params.id;

    try{
        // Hacer consulta para buscar y eliminar el album con un await
        const albumRemoved = await Album.findById(albumId).deleteOne();
        const songRemoved = await Song.find({album: albumId}).deleteMany();

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Método eliminar artista",
            albumRemoved,
            songRemoved
        });
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Error al eliminar el album o canciones"
        });
    }
    
};

module.exports = {
    prueba,
    save,
    one,
    list,
    update,
    upload,
    image,
    remove
}