import axios from "axios";

const URL = "http://localhost:3000/api/pacientes";

export async function guardarPacientes(formData) {
    const res = await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return res.data;
        }




export async function obtenerPacientes() {
    const res = await axios.get(API_URL);
    return res.data;
}