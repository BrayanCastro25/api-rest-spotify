// Importar conexión a base de datos
const connection = require("./database/connection");

// Importar dependencias
const express = require("express");
const cors = require("cors");

// Mensaje de bienvenida
console.log("API REST con Node para la app de música arrancada")

// Ejecutar conexión a la BD
connection();

// Crear servidor de Node
const app = express();
const port = 3910;

// Configurar cors
app.use(cors());

// Convertir los datos del body a objetos de JS
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar configuraciones de rutas

// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json({
        status: "succes",
        message: "Ruta de prueba"
    })
})

// Poner el servidor a escuchar peticiones HTTP
app.listen(port, () => {
    console.log("El servidor de Node esta escuchando en el puerto: ", port);
});
