import axios from "axios";

const URL = "http://localhost:3000/api/pacientes";

export async function getPacientes() {
  const respuesta = await axios.get(URL);

  return respuesta.data.map((p) => ({
    id: p._id,
    dni: p.dnipac,
    nome: p.nomepac,
    apelidos: p.apelpac,
    fechaNacimiento: p.nacipac,
    correo: p.mailpac,
    telefono: p.movilpac,
    direccion: p.dirpac,
    provincia: p.propac,
    municipio: p.munipac
  }));
}

export async function savePacientes(paciente) {
  const respuesta = await axios.post(URL, paciente);

  const p = respuesta.data;

  return {
    id: p._id,
    dni: p.dnipac,
    nome: p.nomepac,
    apelidos: p.apelpac,
    fechaNacimiento: p.nacipac,
    correo: p.mailpac,
    telefono: p.movilpac,
    direccion: p.dirpac,
    provincia: p.propac,
    municipio: p.munipac
  };
}

export async function updatePaciente(id, paciente) {
  const respuesta = await axios.put(`${URL}/${id}`, paciente);

  const p = respuesta.data;

  return {
    id: p._id,
    dni: p.dnipac,
    nome: p.nomepac,
    apelidos: p.apelpac,
    fechaNacimiento: p.nacipac,
    correo: p.mailpac,
    telefono: p.movilpac,
    direccion: p.dirpac,
    provincia: p.propac,
    municipio: p.munipac
  };
}

export async function deletePaciente(id) {
  await axios.delete(`${URL}/${id}`);
}