// Importación de helpers
const validate = require("../helpers/validate");

// Importar modelo
const User = require("../models/user");

// Importar paquetes
const bcrypt = require('bcrypt');

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
    User.find({
        $or: [
            {email: params.email.toLowerCase()},
            {nick: params.nick.toLowerCase()}
        ]
    })
        .then(async (users) => {
            if(users && users.length >= 1){
                return res.status(200).json({
                    status: "error",
                    message: "El usuario ya existe"
                })
            }

            // Cifrar la contraseña
            let pwd = await bcrypt.hash(params.password, 10);
            params.password = pwd;

            // Crear objeto del usuario
            let userToSave = new User(params);

            // Guardar usuario en la BD

            // Limpiar el objeto a devolver

            // Devolver un resultado

            return res.status(200).json({
                status: "success",
                message: "Método de registro",
                userToSave
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error al realizar a consulta de usuarios duplicados"
            })
        });

};

module.exports = {
    prueba,
    register
}
