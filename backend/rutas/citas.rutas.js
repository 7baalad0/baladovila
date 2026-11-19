
import express from "express";
import mongoose from "mongoose";
import Cita from "../modelos/Cita.js";

const router = express.Router();

// Obtener todas las citas de un paciente
router.get("/paciente/:pacienteId", async (req, res) => {
  try {
    const citas = await Cita.find({
      pacienteId: req.params.pacienteId
    }).sort({
      fecha: 1,
      hora: 1
    });

    res.json(citas);

  } catch (error) {
    console.error("ERROR AL OBTENER CITAS:", error);

    res.status(500).json({
      mensaje: "Error al obtener las citas."
    });
  }
});

// Crear una cita
router.post("/", async (req, res) => {
  try {
    const {
      pacienteId,
      pacienteDni,
      doctorId,
      doctorNome,
      fecha,
      hora,
      motivo,
      estado,
      diagnosticoTratamiento
    } = req.body;

    if (
      !pacienteId ||
      !pacienteDni ||
      !doctorId ||
      !doctorNome ||
      !fecha ||
      !hora ||
      !motivo
    ) {
      return res.status(400).json({
        mensaje: "Faltan campos obligatorios."
      });
    }

    if (!["Pendiente", "Completada"].includes(estado)) {
      return res.status(400).json({
        mensaje: "El estado de la cita no es válido."
      });
    }

    const cita = new Cita({
      pacienteId,
      pacienteDni,
      doctorId,
      doctorNome,
      fecha,
      hora,
      motivo,
      estado,
      diagnosticoTratamiento: diagnosticoTratamiento || ""
    });

    const nuevaCita = await cita.save();

    res.status(201).json(nuevaCita);

  } catch (error) {
    console.error("ERROR AL CREAR CITA:", error);

    res.status(500).json({
      mensaje: "Error al crear la cita."
    });
  }
});

// Actualizar una cita
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID de la cita no es válido."
      });
    }

    const {
      pacienteId,
      pacienteDni,
      doctorId,
      doctorNome,
      fecha,
      hora,
      motivo,
      estado,
      diagnosticoTratamiento
    } = req.body;

    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      {
        pacienteId,
        pacienteDni,
        doctorId,
        doctorNome,
        fecha,
        hora,
        motivo,
        estado,
        diagnosticoTratamiento
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrada."
      });
    }

    res.json(cita);

  } catch (error) {
    console.error("ERROR AL ACTUALIZAR CITA:", error);

    res.status(500).json({
      mensaje: "Error al actualizar la cita."
    });
  }
});

// Eliminar una cita
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID de la cita no es válido."
      });
    }

    const cita = await Cita.findByIdAndDelete(req.params.id);

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrada."
      });
    }

    res.json({
      mensaje: "Cita eliminada correctamente."
    });

  } catch (error) {
    console.error("ERROR AL ELIMINAR CITA:", error);

    res.status(500).json({
      mensaje: "Error al eliminar la cita."
    });
  }
});

export default router;
