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

      <button
        type="submit"
        class="btn-guardar"
        :disabled="
          novoPaciente.dni === '' ||
          novoPaciente.nome === '' ||
          !dniValido ||
          !telefonoValido ||
          novoPaciente.provincia === ''
        "
      >
        {{ editandoIndex !== null ? "Actualizar" : "Gardar" }}
      </button>
    </form>

    <h4>📋 Listaxe de pacientes</h4>

    <div class="tabla-contenedor" v-if="pacientes.length > 0">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>DNI/CIF</th>
            <th>Nome</th>
            <th>Apelidos</th>
            <th>Fecha Nacimiento</th>
            <th>Correo</th>
            <th>Telefono</th>
            <th>Dirección</th>
            <th>Provincia</th>
            <th>Municipio</th>
            <th>Accións</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(u, index) in pacientes" :key="index">
            <td>{{ index + 1 }}</td>
            <td class="dni-tabla">{{ u.dni }}</td>
            <td>{{ u.nome }}</td>
            <td>{{ u.apelidos }}</td>
            <td>{{ u.fechaNacimiento }}</td>
            <td>{{ u.correo }}</td>
            <td>{{ u.telefono }}</td>
            <td>{{ u.direccion }}</td>
            <td>{{ u.provincia }}</td>
            <td>{{ u.municipio }}</td>

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
import { obtenerProvincias } from "../api/municipios.js";
import { obtenerMunicipios } from "../api/municipios.js";

const pacientes = ref([]);

const provincias = ref([]);
const municipios = ref([]);

const novoPaciente = reactive({
  dni: "",
  nome: "",
  apelidos: "",
  fechaNacimiento: "",
  correo: "",
  provincia: "",
  municipio: "",
  telefono: "",
  direccion: "",
  activo: false,
  tipoCuenta: "",
});

// Índice del paciente que estamos editando.
// null significa que estamos creando uno nuevo.
const editandoIndex = ref(null);

const dniComprobado = ref(false);

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

// Pacientes de ejemplo
onMounted(async () => {
  pacientes.value = [
    {
      dni: "12345678Z",
      nome: "María",
      apelidos: "Pérez García",
      fechaNacimiento: "1985-03-15",
      correo: "maria.perez@email.com",
      provincia: "A Coruña",
      municipio: "",
      telefono: "600123456",
      direccion: "Rúa Real, 15",
      activo: true,
      tipoCuenta: "particular",
    },
    {
      dni: "X1234567L",
      nome: "Xosé",
      apelidos: "López Fernández",
      fechaNacimiento: "1990-07-22",
      correo: "xose.lopez@email.com",
      provincia: "Lugo",
      municipio: "",
      telefono: "611234567",
      direccion: "Rúa Maior, 24",
      activo: true,
      tipoCuenta: "particular",
    },
    {
      dni: "87654321X",
      nome: "Ana",
      apelidos: "Rodríguez Castro",
      fechaNacimiento: "1978-11-08",
      correo: "ana.rodriguez@email.com",
      provincia: "Ourense",
      municipio: "",
      telefono: "622345678",
      direccion: "Avenida Galicia, 8",
      activo: false,
      tipoCuenta: "particular",
    },
    {
      dni: "Y1234567X",
      nome: "Laura",
      apelidos: "Gómez Martínez",
      fechaNacimiento: "1995-05-30",
      correo: "laura.gomez@email.com",
      provincia: "Pontevedra",
      municipio: "",
      telefono: "633456789",
      direccion: "Rúa do Príncipe, 12",
      activo: true,
      tipoCuenta: "particular",
    },
  ];

  provincias.value = await obtenerProvincias();
});

async function cargarMunicipios() {
  if (novoPaciente.provincia === "") {
    municipios.value = [];
    return;
  }

  municipios.value = await obtenerMunicipios(novoPaciente.provincia);
}

// Gardar ou actualizar paciente
function gardarPaciente() {
  if (!dniValido.value) {
    dniComprobado.value = true;
    return;
  }

  if (editandoIndex.value === null) {
    // Crear paciente nuevo
    pacientes.value.push({
      ...novoPaciente,
    });
  } else {
    // Actualizar paciente existente
    pacientes.value[editandoIndex.value] = {
      ...novoPaciente,
    };
  }

  limpiarFormulario();
}

// Limpiar formulario
function limpiarFormulario() {
  Object.assign(novoPaciente, {
    dni: "",
    nome: "",
    apelidos: "",
    fechaNacimiento: "",
    correo: "",
    provincia: "",
    municipio: "",
    telefono: "",
    direccion: "",
    activo: false,
    tipoCuenta: "",
  });

  editandoIndex.value = null;
  dniComprobado.value = false;
}

// Eliminar paciente
function eliminarPaciente(index) {
  pacientes.value.splice(index, 1);

  // Si estábamos editando ese paciente,
  // limpiamos el formulario
  if (editandoIndex.value === index) {
    limpiarFormulario();
  }
}

// Editar paciente
function editarPaciente(index) {
  const paciente = pacientes.value[index];

  Object.assign(novoPaciente, paciente);

  editandoIndex.value = index;

  // Mostrar el estado de validación del DNI
  dniComprobado.value = true;

  // Llevar el formulario hacia arriba
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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
  overflow-x: auto;
  border: 1px solid #e1e5e8;
  border-radius: 6px;
}

table {
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
  margin: 0;
  font-size: 0.82rem;
  background: white;
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
