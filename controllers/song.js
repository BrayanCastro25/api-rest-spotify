const Song = require("../models/song");

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

module.exports = {
    prueba,
    save,
    one,
    list,
    update,
    remove
}