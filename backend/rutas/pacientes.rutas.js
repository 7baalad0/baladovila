import express from 'express';
import Paciente from '../modelos/Paciente.js';

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
    }
});

// Crear paciente
router.post('/', async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        const paciente = new Paciente({
            dnipac: req.body.dni,
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
    }

    // Actualizar paciente
router.put('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByIdAndUpdate(
            req.params.id,
            {
                dnipac: req.body.dni,
                nomepac: req.body.nome,
                apelpac: req.body.apelidos,
                nacipac: req.body.fechaNacimiento,
                mailpac: req.body.correo,
                movilpac: req.body.telefono,
                dirpac: req.body.direccion,
                propac: req.body.provincia,
                munipac: req.body.municipio
            },
            { new: true, runValidators: true }
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
    }
});
});

export default router;