
import axios from "axios";

const API_URL = "http://localhost:3000/api/citas";

// Obtener las citas de un paciente
export async function getCitasPaciente(pacienteId) {
  const res = await axios.get(
    `${API_URL}/paciente/${encodeURIComponent(pacienteId)}`
  );

  return res.data;
}

// Guardar una cita
export async function saveCita(cita) {
  const res = await axios.post(API_URL, cita);

  return res.data;
}

// Actualizar una cita
export async function updateCita(id, cita) {
  const res = await axios.put(`${API_URL}/${id}`, cita);

  return res.data;
}

// Eliminar una cita
export async function deleteCita(id) {
  const res = await axios.delete(`${API_URL}/${id}`);

  return res.data;
}
