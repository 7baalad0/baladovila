import axios from "axios";

// En produción úsase a URL do servidor
// const API_URL = "https://servidor.com/api";
const API_URL = "http://localhost:3000/api";

// Gardar doutor
export async function saveDoctor(doctor) {
  const res = await axios.post(`${API_URL}/doctores`, doctor);
  return res.data;
}

// Obter todos os doutores
export async function getDoctores() {
  const res = await axios.get(`${API_URL}/doctores`);

  res.data.sort((a, b) =>
    a.apeldoc.localeCompare(b.apeldoc, "es", {
      sensitivity: "base"
    })
  );

  return res.data;
}

// Obter a lista de especialidades do JSON do backend
export async function getEspecialidades() {
  const res = await axios.get(`${API_URL}/doctores/especialidades`);
  return res.data;
}

// Obter doutores por especialidade
export async function getDoctorByEspecialidad(especialidad) {
  const res = await axios.get(
    `${API_URL}/doctores/${encodeURIComponent(especialidad)}`
  );

  return res.data;
}

// Actualizar doutor
export async function modifyDoctor(_id, doctor) {
  const res = await axios.put(`${API_URL}/doctores/${_id}`, doctor);
  return res.data;
}

// Eliminar doutor
export async function deleteDoctor(_id) {
  const res = await axios.delete(`${API_URL}/doctores/${_id}`);
  return res.data;
}