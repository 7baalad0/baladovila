<template>
  <div class="xestion-pacientes">
    <h4>👥 Xestión de pacientes</h4>

    <form @submit.prevent="gardarPaciente">
      <div class="fila">
        <div class="campo campo-dni">
          <label for="dni">DNI/CIF:</label>
          <input
            id="dni"
            v-model="novoPaciente.dni"
            type="text"
            required
            maxlength="9"
            style="text-align: center"
            :class="{
              'dni-valido': dniComprobado && dniValido,
              'dni-invalido': dniComprobado && !dniValido,
            }"
            @input="
              novoPaciente.dni = novoPaciente.dni.toUpperCase();
              dniComprobado = true;
            "
          />

        </div>




        <div class="campo campo-nome">
          <label for="nome">Nome:</label>
          <input id="nome" v-model="novoPaciente.nome" type="text" required />
        </div>

        <div class="campo campo-apelidos">
          <label for="apelidos">Apelidos:</label>
          <input
            id="apelidos"
            v-model="novoPaciente.apelidos"
            type="text"
            required
          />
        </div>
      </div>

      <div class="fila">
        <div class="campo campo-fechanacimiento">
          <label for="fechaNacimiento">Nacimiento:</label>
          <input
            id="fechaNacimiento"
            v-model="novoPaciente.fechaNacimiento"
            type="date"
            required
          />
        </div>

        <div class="campo campo-correo">
          <label for="correo">Correo:</label>
          <input
            id="correo"
            v-model="novoPaciente.correo"
            type="email"
            required
          />
        </div>

        <div class="campo campo-telefono">
          <label for="telefono">Telefono:</label>
          <input
            id="telefono"
            v-model="novoPaciente.telefono"
            type="tel"
            maxlength="9"
          />
        </div>
      </div>

      <div class="fila">
        <div class="campo campo-direccion">
          <label for="direccion">Dirección:</label>
          <input id="direccion" v-model="novoPaciente.direccion" type="text" />
        </div>

        <div class="campo campo-provincia">
          <label for="provincia">Provincia:</label>
          <select
            id="provincia"
            v-model="novoPaciente.provincia"
            @change="cargarMunicipios"
            required
          >
            <option value="">Seleccionar</option>
            <option
              v-for="provincia in provincias"
              :key="provincia.id"
              :value="provincia.id"
            >
              {{ provincia.nm }}
            </option>
          </select>
        </div>

        <div class="campo campo-municipio">
          <label for="municipio">Municipio:</label>
          <select
            id="municipio"
            v-model="novoPaciente.municipio"
            :disabled="!novoPaciente.provincia"
          >
            <option value="">Seleccionar</option>
            <option
              v-for="municipio in municipios"
              :key="municipio.id"
              :value="municipio.id"
            >
              {{ municipio.nm }}
            </option>
          </select>
        </div>
      </div>

      <p v-if="dniComprobado && !dniValido" class="mensaje-dni">
        ⚠️ O DNI introducido non é válido.
      </p>

      <p
        v-if="novoPaciente.telefono !== '' && !telefonoValido"
        class="mensaje-telefono"
      >
        ⚠️ O teléfono debe comezar por 6 ou 7 e ter 9 díxitos.
      </p>

<div v-if="editandoIndex === null" class="politica">
  <label>
    <input
      type="checkbox"
      v-model="politicaAceptada"
      @change="errorPolitica = false"
    />
    Acepto la
    <RouterLink to="/politica-privacidad">
      política de privacidad
    </RouterLink>
  </label>

  <p v-if="errorPolitica" class="mensaje-politica">
    ⚠️ Debes aceptar la política de privacidad para continuar.
  </p>
</div>

<div class="botones-formulario">
  <button
    type="submit"
    class="btn-guardar"
    :disabled="
      novoPaciente.dni === '' ||
      novoPaciente.nome === '' ||
      !dniValido ||
      (novoPaciente.telefono !== '' && !telefonoValido) ||
      novoPaciente.provincia === ''
    "
  >
    {{ editandoIndex !== null ? "Actualizar" : "Gardar" }}
  </button>

  <button
    v-if="editandoIndex !== null"
    type="button"
    class="btn-cancelar"
    @click="limpiarFormulario"
  >
    Cancelar
  </button>

  <button
    v-else
    type="button"
    class="btn-vaciar"
    @click="limpiarFormulario"
  >
    Vaciar
  </button>
                                         <button
    type="button"
    class="btn-buscar"
    @click="buscarPaciente"
    title="Buscar paciente por DNI"
  >
    🔍
  </button>


</div>
    </form>

    <h4>📋 Listaxe de pacientes</h4>

    <div class="tabla-contenedor" v-if="pacientes.length > 0">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>DNI/CIF</th>
            <th>Nome</th>
            <th>Correo</th>
            <th>Provincia</th>
            <th>Accións</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(u, index) in pacientes" :key="index">
            <td>{{ index + 1 }}</td>
            <td class="dni-tabla">{{ u.dni }}</td>
            <td>{{ u.nome }}</td>
            <td>{{ u.correo }}</td>
            <td>{{ u.provincia }}</td>


            <td class="acciones">
              <button
                type="button"
                @click="editarPaciente(index)"
                title="Editar"
              >
                ✏️
              </button>

              <button
                type="button"
                @click="eliminarPaciente(index)"
                title="Eliminar"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>Non hai pacientes cargados.</p>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { obtenerProvincias, obtenerMunicipios } from "../api/municipios.js";
import {
  savePacientes,
  getPacientes,
  updatePaciente,
  deletePaciente
} from "../api/pacientes.js";
const pacientes = ref([]);

const provincias = ref([]);
const municipios = ref([]);

const novoPaciente = reactive({
  dni: "",
  nome: "",
  apelidos: "",
  fechaNacimiento: "",
  correo: "",
  telefono: "",
  direccion: "",
  provincia: "",
  municipio: ""
});

// Índice del paciente que estamos editando.
// null significa que estamos creando uno nuevo.
const editandoIndex = ref(null);

const dniComprobado = ref(false);

const politicaAceptada = ref(false);

const errorPolitica = ref(false);

const dniValido = computed(() => {
  const dni = novoPaciente.dni.trim().toUpperCase();

  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

  // DNI: 8 números + letra
  if (/^\d{8}[A-Z]$/.test(dni)) {
    const numero = parseInt(dni.substring(0, 8), 10);
    const letra = dni.charAt(8);

    return letras[numero % 23] === letra;
  }

  // NIE: X/Y/Z + 7 números + letra
  if (/^[XYZ]\d{7}[A-Z]$/.test(dni)) {
    const prefijo = {
      X: "0",
      Y: "1",
      Z: "2",
    };

    const numero = prefijo[dni.charAt(0)] + dni.substring(1, 8);
    const letra = dni.charAt(8);

    return letras[parseInt(numero, 10) % 23] === letra;
  }

  return false;
});

const telefonoValido = computed(() => {
  const telefono = novoPaciente.telefono.trim();

  // Debe empezar por 6 o 7 y tener exactamente 9 dígitos
  return /^[67]\d{8}$/.test(telefono);
});

onMounted(async () => {
  provincias.value = await obtenerProvincias();
  pacientes.value = await getPacientes();
});

async function cargarMunicipios() {
  if (novoPaciente.provincia === "") {
    municipios.value = [];
    return;
  }

  municipios.value = await obtenerMunicipios(novoPaciente.provincia);
}

async function gardarPaciente() {
  if (editandoIndex.value === null && !politicaAceptada.value) {
    errorPolitica.value = true;
    return;
  }
  try {
    const provincia = provincias.value.find(
      (p) => String(p.id) === String(novoPaciente.provincia)
    );

    const municipio = municipios.value.find(
      (m) => String(m.id) === String(novoPaciente.municipio)
    );

    const paciente = {
      ...novoPaciente,
      provincia: provincia.nm,
      municipio: municipio.nm
    };

    if (editandoIndex.value === null) {
      await savePacientes(paciente);
    } else {
      const pacienteActual = pacientes.value[editandoIndex.value];

      await updatePaciente(pacienteActual.id, paciente);
    }

    // La tabla se carga SIEMPRE desde MongoDB
    pacientes.value = await getPacientes();

    limpiarFormulario();

    console.log("Paciente gardado correctamente");
  } catch (error) {
    console.error("Error ao gardar paciente:", error);
  }
}

// Limpiar formulario
function limpiarFormulario() {
  Object.assign(novoPaciente, {
    dni: "",
    nome: "",
    apelidos: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    direccion: "",
    provincia: "",
    municipio: ""
  });

  editandoIndex.value = null;
  dniComprobado.value = false;
  politicaAceptada.value = false;
  errorPolitica.value = false;
}

async function eliminarPaciente(index) {
  try {
    const paciente = pacientes.value[index];

    await deletePaciente(paciente.id);

    pacientes.value = await getPacientes();

    if (editandoIndex.value === index) {
      limpiarFormulario();
    }
  } catch (error) {
    console.error("Error ao eliminar paciente:", error);
  }
}

// Editar paciente
async function editarPaciente(index) {
  const paciente = pacientes.value[index];

  Object.assign(novoPaciente, paciente);

  const provincia = provincias.value.find(
    (p) => p.nm === paciente.provincia
  );

  if (provincia) {
    novoPaciente.provincia = provincia.id;

    municipios.value = await obtenerMunicipios(provincia.id);

    const municipio = municipios.value.find(
      (m) => m.nm === paciente.municipio
    );

    if (municipio) {
      novoPaciente.municipio = municipio.id;
    }
  }

  editandoIndex.value = index;

  dniComprobado.value = true;


  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
async function buscarPaciente() {
  const dni = novoPaciente.dni.trim().toUpperCase();

  // Comprobar que el DNI sea válido
  if (!dniValido.value) {
    dniComprobado.value = true;
    return;
  }

  // Buscar paciente por DNI
  const index = pacientes.value.findIndex(
    (paciente) => paciente.dni.toUpperCase() === dni
  );

  // Si no existe
  if (index === -1) {
    alert("No existe ningún paciente con ese DNI.");
    return;
  }

  // Si existe, cargar sus datos
  await editarPaciente(index);
}
</script>



<style scoped>
.xestion-pacientes {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

/* =========================
   FORMULARIO LIMPIO
   ========================= */

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.2rem;
}

/*
 * Las 3 filas utilizan exactamente
 * las mismas columnas.
 */
.fila {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  width: 100%;
}

/* Cada grupo ocupa solo el espacio que necesita */
.campo {
  display: grid;
  grid-template-columns: 90px 183px;
  align-items: center;
  gap: 0.35rem;
}

/* Primera columna → izquierda */
.fila .campo:nth-child(1) {
  justify-self: start;
}

/* Segunda columna → centro */
.fila .campo:nth-child(2) {
  justify-self: center;
}

/* Tercera columna → derecha */
.fila .campo:nth-child(3) {
  justify-self: end;
}

.campo label {
  width: 90px;
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

.campo select:disabled {
  background-color: #f4f5f5;
  color: #9ca3af;
  cursor: not-allowed;
}

/* DNI válido */
.campo input.dni-valido {
  border-color: #87e474;
  background-color: #f8fff7;
}

/* DNI inválido */
.campo input.dni-invalido {
  border-color: #e57373;
  background-color: #fff8f8;
}

/* Mensaje DNI */
.mensaje-dni {
  margin: -0.4rem 0 0;
  color: #c0392b;
  font-size: 0.85rem;
  text-align: center;
}

/* Mensaje teléfono */
.mensaje-telefono {
  margin: -0.4rem 0 0;
  color: #c0392b;
  font-size: 0.85rem;
  text-align: center;
}

/* =========================
   BOTÓN GUARDAR
   ========================= */


  .politica {
  text-align: center;
  margin-bottom: 0.8rem;
}

.politica label {
  color: #59636b;
  font-size: 0.82rem;
  cursor: pointer;
}

.politica input {
  margin-right: 0.4rem;
  cursor: pointer;
}

.politica a {
  color: #4b8f3c;
  text-decoration: underline;
}

.mensaje-politica {
  margin-top: 0.35rem;
  color: #c0392b;
  font-size: 0.8rem;
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
.botones-formulario {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.4rem;
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

.mensaje-busqueda {
  margin: -0.3rem 0 0.5rem;
  color: #c0392b;
  font-size: 0.8rem;
  text-align: center;
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

/* Tamaño de las columnas */
th:nth-child(1),
td:nth-child(1) {
  width: 5%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 13%;
}

th:nth-child(3),
td:nth-child(3) {
  width: 12%;
}

/* Correo: más espacio */
th:nth-child(4),
td:nth-child(4) {
  width: 28%;
  white-space: nowrap;
}

/* Provincia */
th:nth-child(5),
td:nth-child(5) {
  width: 18%;
}

/* Accións */
th:nth-child(6),
td:nth-child(6) {
  width: 14%;
}
/* Cabecera */
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

/* Celdas */
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

/* Quitar borde de la última fila */
tbody tr:last-child td {
  border-bottom: none;
}

/* Efecto al pasar por una fila */
tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background-color: #f8fcf7;
}

/* Número */
tbody td:first-child {
  width: 35px;
  text-align: center;
  color: #8a9399;
}

/* DNI */
.dni-tabla {
  text-align: center;
  white-space: nowrap;
  font-weight: 500;
  color: #4b5563;
}

/* Acciones */
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

/* Mensaje cuando no hay pacientes */
.xestion-pacientes > p {
  color: #7a8389;
  text-align: center;
  padding: 1.5rem;
  margin: 0;
}

/* =========================
   MÓVIL
   ========================= */

@media (max-width: 900px) {
  .xestion-pacientes {
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
    text-align: left;
  }

  .campo input,
  .campo select {
    width: 100%;
  }
}
@media (max-width: 600px) {
  .xestion-pacientes {
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

  h4 {
    font-size: 0.9rem;
  }
}
</style>
