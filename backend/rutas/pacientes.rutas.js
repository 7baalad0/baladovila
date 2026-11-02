import express from 'express';
import Paciente from '../modelos/Paciente.js';
import { alertaExito,
        alertaError,
        alertaConfirmacion
 } from "../utils/alertas.js";

const router = express.Router();

// Obtener pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.json(pacientes);
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        res.status(500).json({
            mensaje: "Error al obtener pacientes"
             
        });
        alertaError("Error al obtener los pacientes")
    }
});

// Buscar paciente por DNI
router.get('/dni/:dni', async (req, res) => {
    try {
        const dni = req.params.dni.trim().toUpperCase();

        const paciente = await Paciente.findOne({
            dnipac: dni
        });

        if (!paciente) {
            return res.status(404).json({
                mensaje: "Non existe ningún paciente con ese DNI"
            });
        }

        res.json(paciente);

    } catch (error) {
        console.error("Error al buscar paciente:", error);
        res.status(500).json({
            mensaje: "Error al buscar paciente"
        });
       
    }
});

// Crear paciente
router.post('/', async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        // Verificar si ya existe un paciente con el mismo DNI
        const pacienteExistente = await Paciente.findOne({
            dnipac: req.body.dni.trim().toUpperCase()
        });

        if (pacienteExistente) {
            return res.status(409).json({
                mensaje: "Ya existe un paciente con el mismo DNI"
            });
        }

        // Si no existe, crear el paciente
        const paciente = new Paciente({
            dnipac: req.body.dni.trim().toUpperCase(),
            nomepac: req.body.nome,
            apelpac: req.body.apelidos,
            nacipac: req.body.fechaNacimiento,
            mailpac: req.body.correo,
            movilpac: req.body.telefono,
            dirpac: req.body.direccion,
            propac: req.body.provincia,
            munipac: req.body.municipio
        });

        const nuevoPaciente = await paciente.save();

        res.status(201).json(nuevoPaciente);

    } catch (error) {
        console.error("Error al crear paciente:", error);
        res.status(500).json({
            mensaje: "Error al crear paciente"
        });
        alertaError("Error al guardar")
    }
});

// Actualizar paciente
router.put('/:id', async (req, res) => {
    try {
        // Comprobar si el DNI ya pertenece a otro paciente
        const pacienteExistente = await Paciente.findOne({
            dnipac: req.body.dni.trim().toUpperCase(),
            _id: { $ne: req.params.id }
        });

        if (pacienteExistente) {
            return res.status(409).json({
                mensaje: "Ya existe otro paciente con el mismo DNI"
            });
        }

        const paciente = await Paciente.findByIdAndUpdate(
            req.params.id,
            {
                dnipac: req.body.dni.trim().toUpperCase(),
                nomepac: req.body.nome,
                apelpac: req.body.apelidos,
                nacipac: req.body.fechaNacimiento,
                mailpac: req.body.correo,
                movilpac: req.body.telefono,
                dirpac: req.body.direccion,
                propac: req.body.provincia,
                munipac: req.body.municipio
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.json(paciente);

    } catch (error) {
        console.error("Error al actualizar paciente:", error);
        res.status(500).json({
            mensaje: "Error al actualizar paciente"
        });
    }
});

// Eliminar paciente
router.delete('/:id', async (req, res) => {
    try {
        await Paciente.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: "Paciente eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar paciente:", error);
        res.status(500).json({
            mensaje: "Error al eliminar paciente"
        });
        alertaError("Error al eliminar los pacientes")
    }
});

export default router;