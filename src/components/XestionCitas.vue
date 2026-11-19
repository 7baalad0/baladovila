
<template>
  <div class="xestion-citas">
    <h4>🗓️ Xestión de citas</h4>

    <p
      v-if="!pacienteSeleccionado || !doctorSeleccionado"
      class="mensaje-contexto"
    >
      ⚠️ Para crear unha cita debes seleccionar primeiro un paciente
      en Xestión de pacientes e un doutor en Xestión de doctores.
    </p>

    <form @submit.prevent="gardarCita">
      <div class="fila">
        <div class="campo">
          <label for="idCita">ID cita:</label>
          <input
            id="idCita"
            :value="editandoId || 'Xerarase ao gardar'"
            type="text"
            readonly
          />
        </div>

        <div class="campo">
          <label for="pacienteDni">Paciente:</label>
          <input
            id="pacienteDni"
            v-model="novaCita.pacienteDni"
            type="text"
            readonly
            placeholder="Seleccionar paciente"
          />
        </div>

        <div class="campo">
          <label for="doctorNome">Doutor:</label>
          <input
            id="doctorNome"
            v-model="novaCita.doctorNome"
            type="text"
            readonly
            placeholder="Seleccionar doutor"
          />
        </div>
      </div>

      <div class="fila">
        <div class="campo">
          <label for="doctorId">ID doutor:</label>
          <input
            id="doctorId"
            v-model="novaCita.doctorId"
            type="text"
            readonly
          />
        </div>

        <div class="campo">
          <label for="fecha">Fecha:</label>
          <input
            id="fecha"
            v-model="novaCita.fecha"
            type="date"
            required
          />
        </div>

        <div class="campo">
          <label for="hora">Hora:</label>
          <input
            id="hora"
            v-model="novaCita.hora"
            type="time"
            required
          />
        </div>
      </div>

      <div class="fila">
        <div class="campo campo-motivo">
          <label for="motivo">Motivo:</label>
          <input
            id="motivo"
            v-model="novaCita.motivo"
            type="text"
            maxlength="200"
            required
          />
        </div>

        <div class="campo">
          <label for="estado">Estado:</label>
          <select id="estado" v-model="novaCita.estado" required>
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
          </select>
        </div>
      </div>

      <div class="fila fila-textarea">
        <div class="campo campo-textarea">
          <label for="diagnosticoTratamiento">
            Diagnóstico - tratamento:
          </label>

          <textarea
            id="diagnosticoTratamiento"
            v-model="novaCita.diagnosticoTratamiento"
            rows="4"
            placeholder="Escribe aquí o diagnóstico e o tratamento..."
          ></textarea>
        </div>
      </div>

      <p v-if="mensajeError" class="mensaje-error" role="alert">
        ⚠️ {{ mensajeError }}
      </p>

      <div class="botones-formulario">
        <button
          type="submit"
          class="btn-guardar"
          :disabled="!puedeGuardar || guardando"
        >
          {{
            guardando
              ? "Gardando..."
              : editandoId !== null
                ? "Actualizar"
                : "Gardar"
          }}
        </button>
<button
  type="button"
  class="btn-cancelar"
  @click="vaciarFormulario"
>
  {{ editandoId !== null ? "Cancelar" : "Vaciar" }}
</button>
      </div>
    </form>

    <h4>📋 Listaxe de citas do paciente</h4>

    <p v-if="!pacienteSeleccionado" class="mensaje-contexto">
      Non hai ningún paciente seleccionado. Selecciona un paciente
      na pantalla de Xestión de pacientes.
    </p>

    <div v-else>
      <p class="paciente-listado">
        Citas de: <strong>{{ pacienteSeleccionado.nome }}
        {{ pacienteSeleccionado.apelidos }}</strong>
        ({{ pacienteSeleccionado.dni }})
      </p>

      <p v-if="cargando" class="mensaje-listado">
        Cargando citas...
      </p>

      <div
        v-else-if="citasPaginadas.length > 0"
        class="tabla-contenedor"
      >
        <table>
          <thead>
            <tr>
              <th>ID cita</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Doutor</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Accións</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(cita, index) in citasPaginadas"
              :key="cita._id"
            >
              <td class="id-tabla">{{ cita._id }}</td>

              <td>{{ cita.fecha }}</td>

              <td>{{ cita.hora }}</td>

              <td>{{ cita.doctorNome }}</td>

              <td>{{ cita.motivo }}</td>

              <td class="estado-tabla">
                <span
                  :class="
                    cita.estado === 'Completada'
                      ? 'estado-completada'
                      : 'estado-pendiente'
                  "
                >
                  {{ cita.estado }}
                </span>
              </td>

              <td class="acciones">
                <button
                  type="button"
                  title="Editar cita"
                  @click="editarCita(cita)"
                >
                  ✏️
                </button>

                <button
                  type="button"
                  title="Eliminar cita"
                  @click="eliminarCita(cita)"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else-if="!cargando" class="mensaje-listado">
        Este paciente aínda non ten citas rexistradas.
      </p>

      <div
        v-if="citas.length > 0"
        class="paginacion"
      >
        <button
          type="button"
          @click="paginaAnterior"
          :disabled="paginaActual === 1"
          title="Páxina anterior"
        >
          ←
        </button>

        <span>
          Páxina {{ paginaActual }} de {{ totalPaginas }}
        </span>

        <button
          type="button"
          @click="paginaSiguiente"
          :disabled="paginaActual === totalPaginas"
          title="Páxina seguinte"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

import { usePacienteStore } from "../store/pacienteStore.js";
import { useDoctorStore } from "../store/doctorStore.js";

import {
  getCitasPaciente,
  saveCita,
  updateCita,
  deleteCita
} from "../api/citas.js";

import {
  alertaExito,
  alertaError,
  alertaConfirmacion
} from "../utils/alertas.js";

// Stores
const pacienteStore = usePacienteStore();
const doctorStore = useDoctorStore();

// Datos seleccionados en las otras pantallas
const pacienteSeleccionado = computed(
  () => pacienteStore.pacienteSeleccionado
);

const doctorSeleccionado = computed(
  () => doctorStore.doctorSeleccionado
);

// Datos del formulario
function formularioInicial() {
  return {
    pacienteId: "",
    pacienteDni: "",
    doctorId: "",
    doctorNome: "",
    fecha: "",
    hora: "",
    motivo: "",
    estado: "Pendiente",
    diagnosticoTratamiento: ""
  };
}

const novaCita = reactive(formularioInicial());

// Datos del listado
const citas = ref([]);

const editandoId = ref(null);
const mensajeError = ref("");
const guardando = ref(false);
const cargando = ref(false);

// Paginación
const paginaActual = ref(1);
const citasPorPagina = 5;

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(citas.value.length / citasPorPagina))
);

const citasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * citasPorPagina;

  return citas.value.slice(inicio, inicio + citasPorPagina);
});

// Comprobar si se puede guardar
const puedeGuardar = computed(() => {
  return (
    Boolean(novaCita.pacienteId) &&
    Boolean(novaCita.doctorId) &&
    novaCita.fecha !== "" &&
    novaCita.hora !== "" &&
    novaCita.motivo.trim() !== ""
  );
});

// Copiar los datos seleccionados desde Pinia al formulario
function cargarSeleccionados() {
  const paciente = pacienteSeleccionado.value;
  const doctor = doctorSeleccionado.value;

  novaCita.pacienteId = paciente?.id ?? "";
  novaCita.pacienteDni = paciente?.dni ?? "";

  novaCita.doctorId = doctor?.id ?? "";
  novaCita.doctorNome = doctor?.nome ?? "";
}

function limparFormulario() {
  console.log("BOTÓN VACIAR PULSADO");

  Object.assign(novaCita, {
    pacienteId: pacienteSeleccionado.value?.id ?? "",
    pacienteDni: pacienteSeleccionado.value?.dni ?? "",
    doctorId: doctorSeleccionado.value?.id ?? "",
    doctorNome: doctorSeleccionado.value?.nome ?? "",
    fecha: "",
    hora: "",
    motivo: "",
    estado: "Pendiente",
    diagnosticoTratamiento: ""
  });

  editandoId.value = null;
  mensajeError.value = "";
}

function vaciarFormulario() {
  pacienteStore.limpiarPaciente();
  doctorStore.limpiarDoctor();

  limparFormulario();

  citas.value = [];
  paginaActual.value = 1;
}
// Obtener las citas del paciente seleccionado
async function cargarCitas() {
  const paciente = pacienteSeleccionado.value;

  if (!paciente?.id) {
    citas.value = [];
    paginaActual.value = 1;
    return;
  }

  cargando.value = true;
  mensajeError.value = "";

  try {
    citas.value = await getCitasPaciente(paciente.id);

    paginaActual.value = 1;
    ajustarPagina();
  } catch (error) {
    console.error("Erro ao cargar as citas:", error);

    citas.value = [];

    mensajeError.value =
      error.response?.data?.mensaje ||
      "Non se puideron cargar as citas.";
  } finally {
    cargando.value = false;
  }
}

// Actualizar el formulario y el listado cuando cambia el paciente
watch(
  () => pacienteStore.pacienteSeleccionado,
  async () => {
    limparFormulario()
    await cargarCitas();
  },
  { immediate: true, deep: true }
);

// Actualizar el doctor del formulario cuando cambia la selección
watch(
  () => doctorStore.doctorSeleccionado,
  () => {
    if (editandoId.value === null) {
      cargarSeleccionados();
    }
  },
  { immediate: true, deep: true }
);

// Guardar o actualizar una cita
async function gardarCita() {
  mensajeError.value = "";

  if (!pacienteSeleccionado.value?.id) {
    mensajeError.value = "Debes seleccionar un paciente.";
    return;
  }

  if (!doctorSeleccionado.value?.id) {
    mensajeError.value = "Debes seleccionar un doutor.";
    return;
  }

  if (!puedeGuardar.value) {
    mensajeError.value = "Completa todos os campos obrigatorios.";
    return;
  }

  const datosCita = {
    pacienteId: novaCita.pacienteId,
    pacienteDni: novaCita.pacienteDni,
    doctorId: novaCita.doctorId,
    doctorNome: novaCita.doctorNome,
    fecha: novaCita.fecha,
    hora: novaCita.hora,
    motivo: novaCita.motivo.trim(),
    estado: novaCita.estado,
    diagnosticoTratamiento: novaCita.diagnosticoTratamiento.trim()
  };

  try {
    guardando.value = true;

    if (editandoId.value === null) {
      await saveCita(datosCita);

      await alertaExito("Cita gardada correctamente.");
    } else {
      const confirmacion = await alertaConfirmacion(
        "Seguro que quieres actualizar esta cita?"
      );

      if (!confirmacion.isConfirmed) {
        return;
      }

      await updateCita(editandoId.value, datosCita);

      await alertaExito("Cita actualizada correctamente.");
    }

    await cargarCitas();
     limparFormulario()

  } catch (error) {
    console.error("Erro ao gardar a cita:", error);

    mensajeError.value =
      error.response?.data?.mensaje ||
      "Non se puido gardar a cita.";

    alertaError(mensajeError.value);

  } finally {
    guardando.value = false;
  }
}

// Cargar una cita en el formulario para editarla
function editarCita(cita) {
  Object.assign(novaCita, {
    pacienteId: cita.pacienteId,
    pacienteDni: cita.pacienteDni,
    doctorId: cita.doctorId,
    doctorNome: cita.doctorNome,
    fecha: cita.fecha,
    hora: cita.hora,
    motivo: cita.motivo,
    estado: cita.estado,
    diagnosticoTratamiento: cita.diagnosticoTratamiento || ""
  });

  editandoId.value = cita._id;
  mensajeError.value = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Eliminar una cita
async function eliminarCita(cita) {
  try {
    const confirmacion = await alertaConfirmacion(
      "Seguro que quieres eliminar esta cita?"
    );

    if (!confirmacion.isConfirmed) {
      return;
    }

    await deleteCita(cita._id);

    if (editandoId.value === cita._id) {
       limparFormulario()
    }

    await cargarCitas();

    await alertaExito("Cita eliminada correctamente.");

  } catch (error) {
    console.error("Erro ao eliminar a cita:", error);

    alertaError(
      error.response?.data?.mensaje ||
      "Non se puido eliminar a cita."
    );
  }
}

// Paginación
function paginaAnterior() {
  if (paginaActual.value > 1) {
    paginaActual.value--;
  }
}

function paginaSiguiente() {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++;
  }
}

function ajustarPagina() {
  if (paginaActual.value > totalPaginas.value) {
    paginaActual.value = totalPaginas.value;
  }
}
</script>

<style scoped>
.xestion-citas {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

/* FORMULARIO */

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.2rem;
}

.fila {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.campo {
  display: grid;
  grid-template-columns: 110px 183px;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

.campo label {
  width: 110px;
  color: #4b5563;
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  text-align: left;
}

.campo input,
.campo select,
.campo textarea {
  width: 183px;
  min-width: 0;
  height: 36px;
  padding: 0 0.65rem;
  border: 1px solid #d9dfe3;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 0.88rem;
  box-sizing: border-box;
  outline: none;
  font-family: inherit;
}

.campo textarea {
  height: auto;
  min-height: 100px;
  padding: 0.65rem;
  resize: vertical;
}

.campo input:hover,
.campo select:hover,
.campo textarea:hover {
  border-color: #b8c2c8;
}

.campo input:focus,
.campo select:focus,
.campo textarea:focus {
  border-color: #87e474;
  box-shadow: 0 0 0 2px rgba(135, 228, 116, 0.15);
}

.campo input[readonly] {
  background-color: #f5f7f5;
  color: #69736d;
  cursor: default;
}

.campo-motivo {
  grid-column: span 2;
  width: 100%;
  grid-template-columns: 110px minmax(0, 1fr);
}

.campo-motivo input {
  width: 100%;
}

.fila-textarea {
  grid-template-columns: 1fr;
}

.campo-textarea {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
}

.campo-textarea label {
  width: auto;
  white-space: normal;
}

.campo-textarea textarea {
  width: 100%;
  min-height: 120px;
}

/* MENSAXES */

.mensaje-contexto {
  margin: 0 0 1.2rem;
  padding: 0.75rem;
  border: 1px solid #edcf91;
  border-radius: 4px;
  background: #fffaf0;
  color: #896b35;
  font-size: 0.85rem;
  text-align: center;
}

.mensaje-error {
  margin: -0.3rem 0 0;
  color: #c0392b;
  font-size: 0.85rem;
  text-align: center;
}

.paciente-listado {
  margin: 0 0 1rem;
  color: #59636b;
  font-size: 0.88rem;
  text-align: center;
}

.mensaje-listado {
  color: #7a8389;
  text-align: center;
  padding: 1.5rem;
  margin: 0;
}

/* BOTONES */

.botones-formulario {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.4rem;
}

.btn-guardar {
  align-self: center;
  min-width: 110px;
  height: 36px;
  padding: 0 1.5rem;
  background-color: #87e474;
  color: white;
  border: 1px solid #75d863;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #72d461;
  transform: translateY(-1px);
}

.btn-guardar:disabled {
  background-color: #b8bdb9;
  border-color: #b8bdb9;
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-cancelar {
  min-width: 90px;
  height: 32px;
  padding: 0 1rem;
  background-color: #f8d7d7;
  color: #9b4f4f;
  border: 1px solid #edbaba;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn-cancelar:hover {
  background-color: #f2c4c4;
  border-color: #e3a3a3;
}

/* TÍTULOS */

h4 {
  margin: 0 0 1.2rem;
  padding: 0.7rem 1rem;
  border-radius: 4px;
  background-color: #87e474;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}

/* TABLA */

.tabla-contenedor {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e1e5e8;
  border-radius: 6px;
}

table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
  margin: 0;
  font-size: 0.82rem;
  background: white;
  table-layout: fixed;
}

th {
  padding: 0.75rem 0.6rem;
  background-color: #f4f7f5;
  color: #4b5563;
  border-bottom: 2px solid #dfe5e1;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

td {
  padding: 0.7rem 0.6rem;
  border-bottom: 1px solid #edf0ee;
  color: #59636b;
  vertical-align: middle;
  overflow-wrap: break-word;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background-color: #f8fcf7;
}

th:nth-child(1),
td:nth-child(1) {
  width: 19%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 10%;
}

th:nth-child(3),
td:nth-child(3) {
  width: 8%;
}

th:nth-child(4),
td:nth-child(4) {
  width: 16%;
}

th:nth-child(5),
td:nth-child(5) {
  width: 19%;
}

th:nth-child(6),
td:nth-child(6) {
  width: 12%;
}

th:nth-child(7),
td:nth-child(7) {
  width: 16%;
}

.id-tabla {
  font-size: 0.72rem;
  text-align: center;
  overflow-wrap: anywhere;
}

.estado-tabla {
  text-align: center;
}

.estado-pendiente,
.estado-completada {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.estado-pendiente {
  background: #fff4d6;
  color: #946c17;
}

.estado-completada {
  background: #e5f7e1;
  color: #43813a;
}

/* ACCIONES */

.acciones {
  text-align: center;
  white-space: nowrap;
}

.acciones button {
  width: 32px;
  height: 30px;
  margin: 0 2px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.acciones button:hover {
  background-color: #f0f5f1;
  transform: scale(1.08);
}

/* PAGINACIÓN */

.paginacion {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.2rem;
}

.paginacion span {
  color: #59636b;
  font-size: 0.85rem;
  font-weight: 500;
}

.paginacion button {
  width: 34px;
  height: 32px;
  border: 1px solid #87e474;
  border-radius: 5px;
  background: #fff;
  color: #4b8f3c;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.paginacion button:hover:not(:disabled) {
  background: #effbea;
}

.paginacion button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* MÓVIL */

@media (max-width: 900px) {
  .xestion-citas {
    padding: 1.3rem;
  }

  .fila {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .campo {
    grid-template-columns: 135px minmax(0, 1fr);
    width: 100%;
  }

  .campo label {
    width: 135px;
  }

  .campo input,
  .campo select {
    width: 100%;
  }

  .campo-motivo,
  .campo-textarea {
    grid-column: auto;
    grid-template-columns: 135px minmax(0, 1fr);
  }
}

@media (max-width: 600px) {
  .xestion-citas {
    padding: 1rem;
    border-radius: 4px;
  }

  .campo {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
  }

  .campo label {
    width: auto;
  }

  .campo input,
  .campo select,
  .campo textarea {
    width: 100%;
  }

  h4 {
    font-size: 0.9rem;
  }

  .botones-formulario {
    flex-wrap: wrap;
    gap: 0.8rem;
  }
}
</style>
