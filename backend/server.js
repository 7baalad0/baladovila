import express from "express";
import fs from "fs";
import cors from "cors"; //evita bloqueos entre servidores
import "dotenv/config";
import mongoose from "mongoose";


import pacientesRutas from './rutas/pacientes.rutas.js'; //importa el modelo de paciente
// Creamos la aplicación Express
const app = express();
app.use(cors());
app.use(express.json()); //para que pueda leer json
app.use('/api/pacientes', pacientesRutas); //usa el modelo de paciente
//USA EL PUERTO definido en la variables de entorno y si no coge el 3000
const PORT = process.env.PORT || 3000;

//URL conexion con mongodb

const MONGO_URI = process.env.MONGO_URI;

// Ruta de la API para obtener provincias y municipios
app.get("/api/municipios", (req, res) => {
  
  // Leemos el fichero JSON
  const datos = fs.readFileSync("./backend/data/municipios.json", "utf8");

  // Convertimos el texto JSON en un objeto JavaScript
  const datosJson = JSON.parse(datos);

  // Enviamos los datos como respuesta al cliente
  res.json(datosJson);
});

// Ponemos el servidor a escuchar en el puerto 3000

async function iniciaServer(){
    try{
      //conectamos con mongodb
      await  mongoose.connect(MONGO_URI);
      console.log("Conectado a MongoDB");
      app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });
    } catch(error){
      console.error("error de conexion", error)
    }
  }

iniciaServer();
