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

const profile = (req, res) => {

    // Recoger id user url
    const id = req.params.id;

    // Consulta para sacar los datos del perfil
    User.findById(id)
        .then((userProfile) => {

            // Devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Metodo de perfil",
                userProfile
            })
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "No se encontró el perfil del usuario",
                id
            })
        })

}


const update = (req, res) => {
    // Recoger datos usuario identificado
    let userIdentity = req.user;

    // Recoger datos body
    let userToUpdate = req.body;

    // Validar los datos
    try{
        validate(userToUpdate);        
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "Validación no superada"
        });
    }

    // Comprobar si el usuario existe
    User.find({
        $or: [
            {email: userToUpdate.email.toLowerCase()},
            {nick: userToUpdate.nick.toLowerCase()},
        ]
    })
        .then(async (users) => {
            // Comprobar si el usuario existe y no soy yo (el identificado)
            let userIsset = false;
            
            users.forEach(user => {
                if(user && user._id != userIdentity.id){
                    userIsset = true;
                }
            });

            // Si ya existe devuelve un mensaje
            if(userIsset){
                return res.status(200).json({
                    status: "success",
                    message: "El usuario ya existe"
                });
            }

            // Cifrar password si me llega
            if(userToUpdate.password){
                let pwd = await bcrypt.hash(userToUpdate.password, 10);
                userToUpdate.password = pwd;
            }else{
                delete userToUpdate.password;
            }

            try{
                // Buscar el usuario en la BD y actualizar datos
                let userUpdated = await User.findByIdAndUpdate({_id: userIdentity.id}, userToUpdate, {new:true});

                if(!userUpdated){
                    return res.status(400).json({
                        status: "error",
                        message: "Error al actualizar"
                    });
                }

                // Devolver respuesta
                return res.status(200).json({
                    status: "success",
                    message: "Metodo actualizar datos usuario",
                    user: userUpdated
                });
            }catch(error){
                return res.status(500).json({
                    status: "error",
                    message: "Error al actualizar"
                });
            }
            
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "Error al consultar usuario",
                id
            })
        });
};


module.exports = {
    prueba,
    register,
    login,
    profile,
    update
}
