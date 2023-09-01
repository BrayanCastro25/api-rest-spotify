// Importar modelo
const Artist = require("../models/artist");

// Importar dependencias
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

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


const profile = (req, res) => {
    // Sacar el parametro por la url
    const artistId = req.params.id;

    // Find
    Artist.findById(artistId)
        .then((artistFound) => {
            return res.status(200).json({
                status: "success",
                message: "Acción de mostrar un artista",
                artistFound
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                message: "No existe el artista"
            });
        });
};


const list = (req, res) => {
    // Sacar la página
    let page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    // Definir número de elementos por página
    const itemsPerPage = 2;

    // Find, ordenarlo y paginarlo
    Artist.find()
        .sort("name")
        .paginate(page, itemsPerPage)
        .then(async (artists) => {

            const totalArtists = await Artist.countDocuments({"__v": 0}).exec();

            return res.status(200).json({
                status: "success",
                message: "Metodo listar artistas",
                artists,
                totalArtists,
                page,
                pages: Math.ceil(totalArtists/itemsPerPage)
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                message: "Error al listar los artistas"
            });
        });

};


const update = (req, res) => {
    // Recoger id artista
    const id = req.params.id;

    // Recoger datos del body
    const data = req.body

    // Buscar y actualizar artista
    Artist.findByIdAndUpdate(id, data, {new: true})
        .then((artistUpdated) => {
            return res.status(200).json({
                status: "Artista actualizado exitosamente",
                artistUpdated
            });
        })
        .catch((error) => {
            return res.status(200).json({
                status: "error",
                message: "No se ha actualizado el artista"
            });
        });

}


const remove = async(req, res) => {
    // Sacar el id del artista de la url
    const artistId = req.params.id;

    try{
        // Hacer consulta para buscar y eliminar el artista con un await
        const artistRemoved = await Artist.findByIdAndDelete(artistId);

        // Eliminar albumes

        // Eliminar canciones

        // Devolver resultado

        return res.status(200).json({
            status: "success",
            message: "Método eliminar artista",
            artistRemoved
        });
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Error al eliminar el artista"
        });
    }
    
};


const upload = (req, res) => {

    // Recoger artist id
    let artistId = req.params.id;

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
    Artist.findOneAndUpdate({_id: artistId}, {image: req.file.filename}, {new: true})
        .then((artistUpdated) => {
            return res.status(200).json({
                status: "success",
                artist: artistUpdated,
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
    const filePath = "./uploads/artists/" + file;

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
    profile,
    list,
    update,
    remove,
    upload,
    image
}