// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "Clave_SecREta_DE_Mi_Proyecto_DE_La_APi_MUsicaL_837562892735";

// Crear función para generar token
const createToken = (user) => {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix
    }

    // Devolver token
    return jwt.encode(payload, secret);
};


// Exportar modulo
module.exports = {
    secret,
    createToken
}