// Importación de helpers
const validate = require("../helpers/validate");

// Importar modelo
const User = require("../models/user");

// Importar paquetes
const bcrypt = require('bcrypt');
const jwt = require("../helpers/jwt");

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
        .then((users) => {
            if(users && users.length >= 1){
                return res.status(200).json({
                    status: "error",
                    message: "El usuario ya existe"
                })
            }

            // Cifrar la contraseña
            bcrypt.hash(params.password, 10, (error, pwd) => {
                params.password = pwd;

                // Crear objeto del usuario
                let userToSave = new User(params);
                console.log(userToSave)

                // Guardar usuario en la BD
                userToSave.save()
                    .then((userStored) => {
                        // Limpiar el objeto a devolver
                        userCreated = userStored.toObject();
                        delete userCreated.password;
                        delete userCreated.role;

                        // Devolver un resultado
                        return res.status(200).json({
                            status: "success",
                            message: "Usuario guardado correctamente",
                            user: userCreated
                        })
                    })
                    .catch((error) => {
                        return res.status(400).json({
                            status: "error",
                            message: "Error al guardar el usuario en la BD"
                        })
                    });       
            });     
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error al realizar a consulta de usuarios duplicados"
            })
        });

};

const login = (req, res) => {
    // Recoger los parámetros de la petición
    let params = req.body;

    // Comprobar que me llegan
    if(!params.email || !params.password){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Buscar en la BD si existe el email
    User.findOne({email: params.email})
        .select("+password +role")
        .then((user) => {
            // Comprobar su contraseña
            const pwd = bcrypt.compareSync(params.password, user.password);

            if(!pwd){
                return res.status(400).json({
                    status: "error",
                    message: "Login incorrecto"
                });
            }

            let identityUser = user.toObject();
            delete identityUser.password;
            delete identityUser.role;

            // Conseguir token JWT (Crear servicio que permita crear el Token)
            const token = jwt.createToken(user);

            // Devolver datos usuario y Token
            return res.status(200).json({
                status: "success",
                message: "Método de login",
                user: identityUser,
                token 
            })
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                message: "No existe el usuario"
            })
        });

};

module.exports = {
    prueba,
    register,
    login
}
