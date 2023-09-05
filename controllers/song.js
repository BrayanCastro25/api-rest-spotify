const Song = require("../models/song");

const fs = require("fs");
const path = require("path");

const prueba = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Mensaje enviado desde: controllers/song.js"
    })
};

const save = (req, res) => {
    // Recoger los datos que me llegan
    let params = req.body;

    // Crear un objeto con mi modelo
    let song = new Song(params);

    // Guardarlo
    song.save()
        .then((songStored) => {
            return res.status(200).json({
                status: "success",
                message: "Método para guardar canción",
                songStored
            });
        })
        .catch((error) => {
            return res.status(404).json({
                success: "error",
                message: "La canción no se ha guardado"
            });
        });

    
};


const one = (req, res) => {
    let songId = req.params.id;

    Song.findById(songId)
        .populate("album")
        .then((song) => {
            return res.status(200).json({
                status: "success",
                message: "Método para mostrar una canción",
                song
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "La canción no existe"
            });
        });
};

const list = (req, res) => {
    // Recoger Id de album
    const albumId = req.params.id;

    // Find 
    Song.find({album: albumId})
        // Hacer un populate dentro de otro populate
        .populate({
            path: "album",
            populate: {
                path: "artist",
                model: "Artist"
            }
        })
        .sort("track")
        .then((songsAlbum) => {
            return res.status(200).json({
                status: "success",
                message: "Método para listar las canciones de un album",
                songsAlbum
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "No existe el album"
            });
        });

};

const update = (req, res) => {
    // Recoger parametro por url
    const songId = req.params.songId;

    // Recoger los datos para actualizar
    const data = req.body;

    // Busqueda y actualización
    Song.findByIdAndUpdate(songId, data, {new: true})
        .then((songUpdated) => {
            return res.status(200).json({
                status: "success",
                message: "Método para actualizar canción",
                songUpdated
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "No existe la canción"
            });
        });
    
};


const remove = (req, res) => {
    const songId = req.params.id;

    Song.findByIdAndRemove(songId)
        .then((songRemoved) => {
            return res.status(200).json({
                status: "success",
                message: "Método para remover una canción",
                songRemoved
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "No existe la canción"
            });
        });

};

const upload = (req, res) => {

    // Recoger song id
    let songId = req.params.id;

    // Recoger fichero de audio y comprobar si existe
    if(!req.file){
        return res.status(404).json({
            status: "error",
            message: "La petición no incluye el audio",
        })
    }

    // Conseguir el nombre de la imagen
    let image = req.file.originalname;

    // Sacar info de la imagen
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

    // Comprobar si la extensión es válida
    if(extension != "mp3" && extension != "ogg"){
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
    Song.findOneAndUpdate({_id: songId}, {file: req.file.filename}, {new: true})
        .then((songUpdated) => {
            return res.status(200).json({
                status: "success",
                song: songUpdated,
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


const audio = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/songs/" + file;

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

module.exports = {
    prueba,
    save,
    one,
    list,
    update,
    remove,
    upload,
    audio
}