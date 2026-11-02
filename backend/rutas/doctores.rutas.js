import express from "express";
import Doctor from "../modelos/Doctor.js";
import especialidadesData from "../data/especialidades.json" with { type: "json" };

const router = express.Router();


// Obtener todos
router.get("/", async (req, res) => {
  try {
    const doctores = await Doctor.find();

    console.log("Doctores obtenidos:", doctores);

    res.json(doctores);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener doctores",
    });
  }
});

// Obtener las especialidades del JSON
// Esta ruta debe ir antes de /:especialidad.
router.get("/especialidades", (req, res) => {
  res.json(especialidadesData.especialidades);
});

// Obtener doctores por especialidad
router.get("/:especialidad", async (req, res) => {
  try {
    const doctores = await Doctor.find({
      espedoc: req.params.especialidad,
    });

    res.json(doctores);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener doctores",
    });
  }
});

// Crear doctor
router.post("/", async (req, res) => {
  try {
    const doctor = new Doctor({
      nomedoc: req.body.nomedoc,
      apeldoc: req.body.apeldoc,
      coledoc: req.body.coledoc,
      movildoc: req.body.movildoc,
      maildoc: req.body.maildoc,
      espedoc: req.body.espedoc
    });

    const nuevoDoctor = await doctor.save();

    res.status(201).json(nuevoDoctor);
  } catch (error) {
    console.error("ERROR AL CREAR DOCTOR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Datos incorrectos: " + error.message
      });
    }

    res.status(500).json({
      mensaje: "Error al crear el doctor"
    });
  }
});

// Modificar doctor
router.put("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
    );

    if (!doctor) {
      return res.status(404).json({
        mensaje: "Doctor no encontrado",
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el doctor",
    });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({
      _id: req.params.id,
    });

    if (!doctor) {
      return res.status(404).json({
        mensaje: "Doctor no encontrado",
      });
    }

    res.json({
      mensaje: "Doctor eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el doctor",
    });
  }
});

export default router;