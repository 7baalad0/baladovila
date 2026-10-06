import express from 'express';
import Doctor from '../modelos/Doctor.js';

const router = express.Router();

// Obtener doctores
router.get('/', async (req, res) => {
    try {
        const doctores = await Doctor.find();
        res.json(doctores);
    } catch (error) {
        console.error("Error al obtener doctores:", error);
        res.status(500).json({
            mensaje: "Error al obtener doctores"
        });
    }
});

// Buscar doctor por DNI
router.get('/dni/:dni', async (req, res) => {
    try {
        const dni = req.params.dni.trim().toUpperCase();

        const doctor = await Doctor.findOne({
            dnipac: dni
        });

        if (!doctor) {
            return res.status(404).json({
                mensaje: "Non existe ningún doctor con ese DNI"
            });
        }

        res.json(doctor);

    } catch (error) {
        console.error("Error al buscar doctor:", error);
        res.status(500).json({
            mensaje: "Error al buscar doctor"
        });
    }
});

// Crear doctor
router.post('/', async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        // Verificar si ya existe un doctor con el mismo DNI
        const doctorExistente = await Doctor.findOne({
            dnipac: req.body.dni.trim().toUpperCase()
        });

        if (doctorExistente) {
            return res.status(409).json({
                mensaje: "Ya existe un doctor con el mismo DNI"
            });
        }

        // Si no existe, crear el doctor
        const doctor = new Doctor({
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

        const nuevoDoctor = await doctor.save();

        res.status(201).json(nuevoDoctor);

    } catch (error) {
        console.error("Error al crear doctor:", error);
        res.status(500).json({
            mensaje: "Error al crear doctor"
        });
    }
});

// Actualizar doctor
router.put('/:id', async (req, res) => {
    try {
        // Comprobar si el DNI ya pertenece a otro doctor
        const doctorExistente = await Doctor.findOne({
            dnipac: req.body.dni.trim().toUpperCase(),
            _id: { $ne: req.params.id }
        });

        if (doctorExistente) {
            return res.status(409).json({
                mensaje: "Ya existe otro doctor con el mismo DNI"
            });
        }

        const doctor = await Doctor.findByIdAndUpdate(
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

        res.json(doctor);

    } catch (error) {
        console.error("Error al actualizar doctor:", error);
        res.status(500).json({
            mensaje: "Error al actualizar doctor"
        });
    }
});

// Eliminar doctor
router.delete('/:id', async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: "Doctor eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar doctor:", error);
        res.status(500).json({
            mensaje: "Error al eliminar doctor"
        });
    }
});

export default router;