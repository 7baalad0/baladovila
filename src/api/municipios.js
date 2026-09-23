import axios from "axios";

const URL = "http://localhost:3000/api/municipios";

export async function obtenerProvincias() {
    const respuesta = await axios.get(URL);

    return respuesta.data.provincias;
}


export async function obtenerMunicipios(idProvincia) {
    const respuesta = await axios.get(URL);
    
    const municipios = respuesta.data.municipios

    return municipios.filter(
        municipio => municipio.id.substring(0, 2) === idProvincia
    )
}