// Importar modulos o dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar clave secreta
const {secret} = require("../helpers/jwt");

// Crear middleware (metodo o función)
exports.auth = (req, res, next) => {

    // Comprobar si me llega la cabecera de autenticación
    if(!req.headers.authorization){
        return res.status(403).json({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        });
    }

    // Limpiar Token
    let token = req.headers.authorization.replace(/['"]+/g, "")

    try{
        // Decodificar el token
        let payload = jwt.decode(token, secret);

        // Comprobar la expiración del Token
        if(payload.exp <= moment().unix()){
            return res.status(401).json({
                status: "error",
                message: "Token expirado"
            });
        }
    
        // Agregar datos del usuario a la request
        req.user = payload;

    }catch(error){
        return res.status(404).json({
            status: "error",
            message: "Token invalido",
            error
        });
    }

    // Pasar a la ejecución de la acción
    next();
}

