// Importación de helpers
const validate = require("../helpers/validate");

const prueba = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Mensaje enviado desde: controllers/user.js"
    })
};

const register = (req, res) => {
    // Recoger los datos que llegan de la petición
    let params = req.body;

    // Comprobar que llegan bien
    if(!params.name || !params.nick || !params.email || !params.password){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Validar los datos
    try{
        validate(params);        
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Validación no superada"
        });
    }

    // Control de usuarios duplicados

    // Cifrar la contraseña

    // Crear objeto del usuario

    // Guardar usuario en la BD

    // Limpiar el objeto a devolver

    // Devolver un resultado

    return res.status(200).json({
        status: "success",
        message: "Método de registro"
    })
};

module.exports = {
    prueba,
    register
}
