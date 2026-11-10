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
        {{ mensajeError }}
      </p>

          <p v-if="mensajeExito" class="mensaje-exito">
      {{ mensajeExito }}
    </p>

      <p
        v-if="mensajeEspecialidades"
        class="mensaje-error"
        role="alert"
      >
        {{ mensajeEspecialidades }}
      </p>

      <div class="botones-formulario">
        <button
          type="submit"
          class="btn-principal"
          :disabled="especialidades.length === 0"
        >
          {{ editandoId === null ? 'Gardar' : 'Actualizar' }}
        </button>

        <div class="botones-secundarios">
          <button
            type="button"
            class="btn-secundario"
            @click="limparFormulario"
          >
            {{ editandoId === null ? 'Vaciar formulario' : 'Cancelar' }}
          </button>
        </div>
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
            <td>{{ (paginaActual - 1) * doctoresPorPagina + index + 1 }}</td>
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

  

    <p v-if="doctores.length === 0" class="sen-doctores">
      Non hai doctores cargados.
    </p>
  </div>

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

import { alertaExito,
        alertaError,
        alertaConfirmacion
 } from "../utils/alertas.js";

const doctores = ref([])
const especialidades = ref([])
const editandoId = ref(null)
const mensajeError = ref('')
const mensajeEspecialidades = ref('')
const mensajeExito = ref('')

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
}

async function cargarEspecialidades() {
  try {
    especialidades.value = await obtenerEspecialidades()
    mensajeEspecialidades.value = ''

    if (especialidades.value.length === 0) {
      mensajeEspecialidades.value =
        'Non hai especialidades dispoñibles.'
    }
  } catch (error) {
    console.error('Erro ao cargar as especialidades:', error)

    mensajeEspecialidades.value =
      'Non se puideron cargar as especialidades.'
  }
}

onMounted(async () => {
  await Promise.all([
    cargarEspecialidades(),
    cargarDoctores().catch((error) => {
      console.error('Erro ao cargar os doutores:', error)

      mensajeError.value =
        'Non se puideron cargar os doutores.'
    })
  ])
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
    mensajeError.value = 'O móbil debe comezar por 6 ou 7 e ter 9 díxitos.'
    return
  }

  // Comprobar correo
  if (
    novoDoctor.maildoc.trim() !== '' &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoDoctor.maildoc.trim())
  ) {
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
      await saveDoctor(doctor);
      await alertaExito('Doutor gardado correctamente.')
    } else {
      await modifyDoctor(editandoId.value, doctor);
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
    await deleteDoctor(doctor._id)

    if (editandoId.value === doctor._id) {
      limparFormulario()
    }

    await cargarDoctores()
  } catch (error) {
    console.error('Erro ao eliminar o doutor:', error)

    mensajeError.value =
      error.response?.data?.mensaje ||
      'Non se puido eliminar o doutor.'
  }
}

// Limpar formulario ou cancelar edición
function limparFormulario() {
  Object.assign(novoDoctor, formularioInicial())

  editandoId.value = null
  mensajeError.value = ''
  mensajeExito.value = ''
}
</script>

<style scoped>
.xestion-doctores {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.2rem;
}

.fila {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
  width: 100%;
}

.campo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.campo label {
  flex: 0 0 auto;
  color: #4b5563;
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
}

.campo input,
.campo select {
  width: 100%;
  min-width: 0;
  flex: 1;
  height: 36px;
  padding: 0 0.65rem;
  border: 1px solid #d9dfe3;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 0.88rem;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.campo input:hover,
.campo select:hover {
  border-color: #b8c2c8;
}

.campo input:focus,
.campo select:focus {
  border-color: #aa3bff;
  box-shadow: 0 0 0 2px rgba(170, 59, 255, 0.14);
}

.botones-formulario {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  margin-top: 0.3rem;
}

.btn-principal {
  grid-column: 2;
  min-height: 38px;
  padding: 0.55rem 1.8rem;
  border: none;
  border-radius: 5px;
  background: #aa3bff;
  color: #fff;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-principal:hover:not(:disabled) {
  background: #9227e5;
}

.btn-principal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.botones-secundarios {
  grid-column: 3;
  justify-self: end;
}

.btn-secundario {
  min-height: 32px;
  padding: 0.4rem 0.8rem;
  border: 1px solid #f0b7bd;
  border-radius: 5px;
  background: #fff1f2;
  color: #a33b46;
  font-size: 0.82rem;
  cursor: pointer;
}

.btn-secundario:hover {
  background: #ffe1e4;
}

.mensaje-error {
  margin: 0;
  color: #b42318;
  font-size: 0.9rem;
  text-align: center;
}

.tabla-contenedor {
  width: 100%;
  overflow-x: hidden;
  border: 1px solid #e1e5e8;
  border-radius: 6px;
}

table {
  width: 100%;
  min-width: 0;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 0;
  font-size: 0.82rem;
  background: #fff;
}

th {
  padding: 0.7rem 0.35rem;
  background-color: #f4f7f5;
  color: #4b5563;
  border-bottom: 2px solid #dfe5e1;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  overflow-wrap: anywhere;
}

td {
  padding: 0.65rem 0.4rem;
  border-bottom: 1px solid #edf0ee;
  color: #59636b;
  vertical-align: middle;
  overflow-wrap: anywhere;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background-color: #faf7ff;
}

tbody td:first-child,
.colexiado-tabla {
  text-align: center;
}

tbody td:first-child {
  color: #8a9399;
}

.acciones {
  text-align: center;
  white-space: nowrap;
}

.acciones button {
  width: 28px;
  height: 30px;
  margin: 0 1px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.acciones button:hover {
  background-color: #f0e5ff;
  transform: scale(1.08);
}

.sen-doctores {
  margin: 0;
  padding: 1.5rem;
  color: #7a8389;
  text-align: center;
}

@media (max-width: 900px) {
  .xestion-doctores {
    padding: 1.3rem;
  }

  .fila {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .campo {
    width: 100%;
  }

  .campo label {
    min-width: 130px;
  }

  .botones-formulario {
    display: flex;
    flex-direction: column;
  }

  .botones-secundarios {
    align-self: flex-end;
  }
}

@media (max-width: 600px) {
  .xestion-doctores {
    padding: 1rem;
    border-radius: 4px;
  }

  .campo {
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
  }

  .campo label {
    min-width: 0;
  }

  .tabla-contenedor {
    overflow-x: auto;
  }

  table {
    min-width: 650px;
  }

  
}

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
  border: 1px solid #aa3bff;
  border-radius: 5px;
  background: #fff;
  color: #9227e5;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.paginacion button:hover:not(:disabled) {
  background: #f3e5ff;
}

.paginacion button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>