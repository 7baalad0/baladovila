
import mongoose from "mongoose";

const citaSchema = new mongoose.Schema(
  {
    pacienteId: {
      type: String,
      required: true,
      index: true
    },

    pacienteDni: {
      type: String,
      required: true,
      trim: true
    },

    doctorId: {
      type: String,
      required: true
    },

    doctorNome: {
      type: String,
      required: true,
      trim: true
    },

    fecha: {
      type: String,
      required: true
    },

    hora: {
      type: String,
      required: true
    },

    motivo: {
      type: String,
      required: true,
      trim: true
    },

    estado: {
      type: String,
      enum: ["Pendiente", "Completada"],
      default: "Pendiente"
    },

    diagnosticoTratamiento: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    collection: "citas"
  }
);

const Cita =
  mongoose.models.Cita ||
  mongoose.model("Cita", citaSchema);

export default Cita;
