// Importar modelo
const Artist = require("../models/artist");

const prueba = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Mensaje enviado desde: controllers/artist.js"
    })
};

module.exports = {
    prueba
}