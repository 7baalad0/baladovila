
<template>
  <div class="xestion-doctores">
    <h4>👨‍⚕️ Xestión de doctores</h4>

    <form @submit.prevent="gardarDoctor">
      <div class="fila">
        <div class="campo">
          <label for="nomedoc">Nome:</label>
          <input
            id="nomedoc"
            v-model="novoDoctor.nomedoc"
            type="text"
            minlength="2"
            maxlength="60"
            required
          />
        </div>

        <div class="campo">
          <label for="apeldoc">Apelidos:</label>
          <input
            id="apeldoc"
            v-model="novoDoctor.apeldoc"
            type="text"
            minlength="2"
            maxlength="60"
            required
          />
        </div>

        <div class="campo">
          <label for="espedoc">Especialidade:</label>
          <select
            id="espedoc"
            v-model="novoDoctor.espedoc"
            required
          >
            <option value="">Seleccionar</option>
            <option
              v-for="especialidade in especialidades"
              :key="especialidade.id"
              :value="especialidade.nm"
            >
              {{ especialidade.nm }}
            </option>
          </select>
        </div>
      </div>

      <div class="fila">
        <div class="campo">
          <label for="coledoc">Colexiado:</label>
          <select
            id="coledoc"
            v-model="novoDoctor.coledoc"
            required
          >
            <option :value="null" disabled>Seleccionar</option>
            <option :value="true">Si</option>
            <option :value="false">Non</option>
          </select>
        </div>

        <div class="campo">
          <label for="movildoc">Móbil:</label>
          <input
            id="movildoc"
            v-model="novoDoctor.movildoc"
            type="tel"
            minlength="9"
            maxlength="9"
            pattern="[67][0-9]{8}"
            title="O móbil debe comezar por 6 ou 7 e ter 9 díxitos."
            required
          />
        </div>

        <div class="campo">
          <label for="maildoc">Correo:</label>
          <input
            id="maildoc"
            v-model="novoDoctor.maildoc"
            type="email"
            required
          />
        </div>
      </div>

      <p v-if="mensajeError" class="mensaje-error" role="alert">
        ⚠️ {{ mensajeError }}
      </p>

      <div class="botones-formulario">
        <button
          type="submit"
          class="btn-guardar"
          :disabled="especialidades.length === 0"
        >
          {{ editandoId !== null ? 'Actualizar' : 'Gardar' }}
        </button>

        <button
          type="button"
          class="btn-cancelar"
          v-if="editandoId !== null"
          @click="limparFormulario"
        >
          Cancelar
        </button>

        <button
          type="button"
          class="btn-vaciar"
          v-else
          @click="limparFormulario"
        >
          Vaciar
        </button>

        <button
          type="button"
          class="btn-buscar"
          @click="buscarDoctor"
          title="Buscar doutor por nome e apelidos"
        >
          🔍
        </button>
          <button
          type="button"
          class="btn-imprimir"
          @click="exportarDoctoresPDF"
          :disabled="doctores.length === 0"
          title="Exportar listado a PDF"
        >
          🖨️
        </button>
      </div>
    </form>

    <h4>📋 Listaxe de doctores</h4>

    <div
      v-if="doctores.length > 0"
      class="tabla-contenedor"
    >
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Apelidos</th>
            <th>Colexiado</th>
            <th>Móbil</th>
            <th>Correo</th>
            <th>Especialidade</th>
            <th>Accións</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(doctor, index) in doctoresPaginados"
            :key="doctor._id"
          >
            <td>
              {{ (paginaActual - 1) * doctoresPorPagina + index + 1 }}
            </td>

            <td>{{ doctor.nomedoc }}</td>
            <td>{{ doctor.apeldoc }}</td>

            <td class="colexiado-tabla">
              {{ doctor.coledoc ? 'Si' : 'Non' }}
            </td>

            <td>{{ doctor.movildoc }}</td>
            <td>{{ doctor.maildoc || '—' }}</td>
            <td>{{ doctor.espedoc }}</td>

            <td class="acciones">
              <button
                type="button"
                title="Editar doutor"
                @click="editarDoctor(doctor)"
              >
                ✏️
              </button>

              <button
                type="button"
                title="Eliminar doutor"
                @click="eliminarDoctor(doctor)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="sen-doctores">
      Non hai doctores cargados.
    </p>

    <!-- Paginación -->
    <div v-if="doctores.length > 0" class="paginacion">
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
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'

import {
  getDoctores,
  saveDoctor,
  modifyDoctor,
  deleteDoctor
} from '../api/doctores.js'

import {
  obtenerEspecialidades
} from '../api/especialidades.js'

import {
  alertaExito,
  alertaError,
  alertaConfirmacion
} from '../utils/alertas.js'

import { generarPDF } from "../utils/pdf.js";

const doctores = ref([])
const especialidades = ref([])
const editandoId = ref(null)
const mensajeError = ref('')

// Paginación
const paginaActual = ref(1)
const doctoresPorPagina = 5

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(doctores.value.length / doctoresPorPagina))
)

const doctoresPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * doctoresPorPagina

  return doctores.value.slice(inicio, inicio + doctoresPorPagina)
})

function paginaAnterior() {
  if (paginaActual.value > 1) {
    paginaActual.value--
  }
}

function paginaSiguiente() {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
  }
}

function ajustarPagina() {
  if (paginaActual.value > totalPaginas.value) {
    paginaActual.value = totalPaginas.value
  }
}


// Exportar todos los doctores a PDF
function exportarDoctoresPDF() {
    if (doctores.value.length === 0) {
        alertaError("No hay doctores para exportar.");
        return;
    }

    generarPDF(
        "Listado de doctores",
        [
            "#",
            "Nome",
            "Apelidos",
            "Colexiado",
            "Móbil",
            "Correo",
            "Especialidade"
        ],
        doctores.value.map((doctor, index) => [
            index + 1,
            doctor.nomedoc,
            doctor.apeldoc,
            doctor.coledoc ? "Si" : "Non",
            doctor.movildoc,
            doctor.maildoc || "—",
            doctor.espedoc
        ]),
        "listado_doctores.pdf",
        "landscape"
    );
}


function formularioInicial() {
  return {
    nomedoc: '',
    apeldoc: '',
    coledoc: null,
    movildoc: '',
    maildoc: '',
    espedoc: ''
  }
}

const novoDoctor = reactive(formularioInicial())

async function cargarDoctores() {
  doctores.value = await getDoctores()
  ajustarPagina()
}

async function cargarEspecialidades() {
  try {
    especialidades.value = await obtenerEspecialidades()

    if (especialidades.value.length === 0) {
      mensajeError.value = 'Non hai especialidades dispoñibles.'
    }
  } catch (error) {
    console.error('Erro ao cargar as especialidades:', error)

    mensajeError.value =
      'Non se puideron cargar as especialidades.'
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      cargarEspecialidades(),
      cargarDoctores()
    ])
  } catch (error) {
    console.error('Erro ao cargar os datos:', error)

    mensajeError.value =
      'Non se puideron cargar os datos dos doutores.'
  }
})

// Gardar ou actualizar doutor
async function gardarDoctor() {
  mensajeError.value = ''

  // Comprobar nome
  if (novoDoctor.nomedoc.trim().length < 2) {
    mensajeError.value = 'O nome debe ter polo menos 2 caracteres.'
    return
  }

  // Comprobar apelidos
  if (novoDoctor.apeldoc.trim().length < 2) {
    mensajeError.value = 'Os apelidos deben ter polo menos 2 caracteres.'
    return
  }

  // Comprobar colexiado
  if (novoDoctor.coledoc === null) {
    mensajeError.value = 'Debes indicar se o doutor está colexiado.'
    return
  }

  // Comprobar móbil
  if (!/^[67]\d{8}$/.test(novoDoctor.movildoc.trim())) {
    mensajeError.value =
      'O móbil debe comezar por 6 ou 7 e ter 9 díxitos.'
    return
  }

  // Comprobar correo
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoDoctor.maildoc.trim())) {
    mensajeError.value = 'O correo electrónico non ten un formato válido.'
    return
  }

  // Comprobar especialidade
  if (!novoDoctor.espedoc) {
    mensajeError.value = 'Debes seleccionar unha especialidade.'
    return
  }

  const doctor = {
    nomedoc: novoDoctor.nomedoc.trim(),
    apeldoc: novoDoctor.apeldoc.trim(),
    coledoc: novoDoctor.coledoc,
    movildoc: novoDoctor.movildoc.trim(),
    maildoc: novoDoctor.maildoc.trim(),
    espedoc: novoDoctor.espedoc
  }

  try {
    if (editandoId.value === null) {
      await saveDoctor(doctor)
      await alertaExito('Doutor gardado correctamente.')
    } else {
      await modifyDoctor(editandoId.value, doctor)
      await alertaExito('Doutor actualizado correctamente.')
    }

    await cargarDoctores()
    limparFormulario()

  } catch (error) {
    console.error('Erro ao gardar o doutor:', error)

    mensajeError.value =
      error.response?.data?.mensaje ||
      'Non se puido gardar o doutor.'
  }
}

// Buscar doutor por nome e apelidos
function buscarDoctor() {
  mensajeError.value = ''

  const nome = novoDoctor.nomedoc.trim().toLocaleLowerCase('es')
  const apelidos = novoDoctor.apeldoc.trim().toLocaleLowerCase('es')

  if (!nome || !apelidos) {
    mensajeError.value = 'Introduce o nome e os apelidos para buscar.'
    return
  }

  const coincidencias = doctores.value.filter(doctor =>
    doctor.nomedoc.trim().toLocaleLowerCase('es') === nome &&
    doctor.apeldoc.trim().toLocaleLowerCase('es') === apelidos
  )

  if (coincidencias.length === 0) {
    mensajeError.value = 'Non existe ningún doutor con ese nome e apelidos.'
    return
  }

  if (coincidencias.length > 1) {
    mensajeError.value =
      'Hai varios doutores con ese nome e apelidos. Non se pode identificar un único rexistro.'
    return
  }

  editarDoctor(coincidencias[0])
}

// Cargar os datos no formulario
function editarDoctor(doctor) {
  Object.assign(novoDoctor, {
    nomedoc: doctor.nomedoc ?? '',
    apeldoc: doctor.apeldoc ?? '',
    coledoc: doctor.coledoc ?? null,
    movildoc: doctor.movildoc ?? '',
    maildoc: doctor.maildoc ?? '',
    espedoc: doctor.espedoc ?? ''
  })

  editandoId.value = doctor._id
  mensajeError.value = ''

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Eliminar doutor
async function eliminarDoctor(doctor) {
  mensajeError.value = ''

  try {
    const respuesta = await alertaConfirmacion(
      'Seguro que quieres eliminar este doutor?'
    )

    if (!respuesta.isConfirmed) {
      return
    }

    await deleteDoctor(doctor._id)

    if (editandoId.value === doctor._id) {
      limparFormulario()
    }

    await cargarDoctores()

    await alertaExito('Doutor eliminado correctamente.')

  } catch (error) {
    console.error('Erro ao eliminar o doutor:', error)

    alertaError('Non se puido eliminar o doutor.')
  }
}

// Limpar formulario ou cancelar edición
function limparFormulario() {
  Object.assign(novoDoctor, formularioInicial())

  editandoId.value = null
  mensajeError.value = ''
}
</script>

<style scoped>
.xestion-doctores {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

/* =========================
   FORMULARIO
   ========================= */

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
.campo select {
  width: 183px;
  height: 36px;
  padding: 0 0.65rem;
  border: 1px solid #d9dfe3;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 0.88rem;
  box-sizing: border-box;
  outline: none;
}

.campo input:hover,
.campo select:hover {
  border-color: #b8c2c8;
}

.campo input:focus,
.campo select:focus {
  border-color: #87e474;
  box-shadow: 0 0 0 2px rgba(135, 228, 116, 0.15);
}

/* =========================
   MENSAJES
   ========================= */

.mensaje-error {
  margin: -0.4rem 0 0;
  color: #c0392b;
  font-size: 0.85rem;
  text-align: center;
}

/* =========================
   BOTONES
   ========================= */

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

.btn-guardar:active:not(:disabled) {
  transform: translateY(0);
}

.btn-guardar:disabled {
  background-color: #b8bdb9;
  border-color: #b8bdb9;
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-cancelar,
.btn-vaciar {
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

.btn-cancelar:hover,
.btn-vaciar:hover {
  background-color: #f2c4c4;
  border-color: #e3a3a3;
}

.btn-buscar {
  width: 36px;
  height: 32px;
  padding: 0;
  margin-left: 0.4rem;
  background-color: #f4f4f4;
  color: #59636b;
  border: 1px solid #d9dfe3;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn-buscar:hover {
  background-color: #e9e9e9;
  border-color: #b8c2c8;
}

/* =========================
   TÍTULOS
   ========================= */

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

/* =========================
   TABLA
   ========================= */

.tabla-contenedor {
  width: 100%;
  overflow-x: hidden;
  border: 1px solid #e1e5e8;
  border-radius: 6px;
}

table {
  width: 100%;
  min-width: 0;
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
}

th,
td {
  overflow-wrap: break-word;
  word-break: normal;
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

tbody td:first-child {
  width: 35px;
  text-align: center;
  color: #8a9399;
}

.colexiado-tabla {
  text-align: center;
}

.acciones {
  text-align: center;
  white-space: nowrap;
  width: 90px;
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

.sen-doctores {
  color: #7a8389;
  text-align: center;
  padding: 1.5rem;
  margin: 0;
}

/* =========================
   PAGINACIÓN
   ========================= */

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

/* =========================
   MÓVIL
   ========================= */

@media (max-width: 900px) {
  .xestion-doctores {
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
}

@media (max-width: 600px) {
  .xestion-doctores {
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
  .campo select {
    width: 100%;
  }

  .tabla-contenedor {
    overflow-x: auto;
  }

  table {
    min-width: 650px;
  }

  .botones-formulario {
    flex-wrap: wrap;
    gap: 0.8rem;
  }
}

.btn-imprimir {
  width: 36px;
  height: 32px;
  padding: 0;
  background-color: #f4f4f4;
  color: #59636b;
  border: 1px solid #d9dfe3;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn-imprimir:hover:not(:disabled) {
  background-color: #e9e9e9;
  border-color: #b8c2c8;
}

.btn-imprimir:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
