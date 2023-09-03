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

module.exports = {
    prueba,
    save
}