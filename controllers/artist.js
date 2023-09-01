// Importar modelo
const Artist = require("../models/artist");

// Importar dependencias
const mongoosePagination = require("mongoose-pagination");

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

module.exports = {
    prueba,
    save,
    profile,
    list,
    update
}