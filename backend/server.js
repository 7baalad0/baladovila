import express from 'express'
import fs from 'fs'
import cors from 'cors'
import "dotenv/config"
import { MongoClient } from 'mongodb' //importa modulo de conexion a mongodb

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);

async function iniciarServer() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        app.listen(PORT, () => {
            console.log(`servidor funcionando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error de conexion:", error.message);
    }
}

iniciarServer();

app.get('/api/municipios', (req,res) => {
    console.log("peticion recibida");

    const datos = fs.readFileSync(
        './backend/data/municipios.json',
        'utf8'
    )

    const datosJson = JSON.parse(datos)

    res.json(datosJson)

})



//arrancarlo: node backend/server.js