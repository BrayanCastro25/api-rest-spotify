// Importar mongoose
const mongoose = require("mongoose");

// Metodo de conexión
const connection = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/app_music");
        console.log("Conectado correctamente a la BD: app_music");
    }catch(error){
        console.log(error);
        throw new Error("No se ha establecido la conexión a la BBDD");
    }
};

// Exportar conexión
module.exports = connection;

