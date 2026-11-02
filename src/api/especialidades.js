import axios from "axios";

const URL = "http://localhost:3000/api/especialidades";

export async function obtenerEspecialidades() {
    const respuesta = await axios.get(URL);

    return respuesta.data.especialidades;
}