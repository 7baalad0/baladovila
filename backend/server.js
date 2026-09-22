import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/municipios", (req, res) => {
  console.log("Received request for municipios");

  const datos = fs.readFileSync("./backend/data/municipios.json", "utf8");

  const datosJson = JSON.parse(datos);

  res.json(datosJson);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
