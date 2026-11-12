
<template>
  <div class="xestion-citas">
    <h4>📅 Xestión de citas</h4>

    <form @submit.prevent="guardarCita">
      <div class="fila">
        <div class="campo">
          <label for="dni">DNI paciente:</label>
          <input
            id="dni"
            v-model="novaCita.dnipac"
            type="text"
            readonly
          />
        </div>

        <div class="campo">
          <label for="nome">Nome:</label>
          <input
            id="nome"
            v-model="novaCita.nomepac"
            type="text"
            readonly
          />
        </div>

        <div class="campo">
          <label for="apelidos">Apelidos:</label>
          <input
            id="apelidos"
            v-model="novaCita.apelpac"
            type="text"
            readonly
          />
        </div>
      </div>

      <div class="fila">
        <div class="campo">
          <label for="data">Data:</label>
          <input
            id="data"
            v-model="novaCita.data"
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

      <div class="botones-formulario">
        <button
          type="submit"
          class="btn-guardar"
          :disabled="!novaCita.dnipac"
        >
          Gardar cita
        </button>
      </div>
    </form>

    <p v-if="!pacienteStore.dnipac" class="mensaje">
      Non hai ningún paciente seleccionado.
      Selecciona primeiro un paciente en Xestión de pacientes.
    </p>

    <h4>📋 Listaxe de citas</h4>

    <div v-if="citas.length > 0">
      <table>
        <thead>
          <tr>
            <th>DNI paciente</th>
            <th>Nome</th>
            <th>Data</th>
            <th>Hora</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(cita, index) in citas" :key="index">
            <td>{{ cita.dnipac }}</td>
            <td>{{ cita.nomepac }}</td>
            <td>{{ cita.data }}</td>
            <td>{{ cita.hora }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="mensaje">Non hai citas cargadas.</p>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { usePacienteStore } from "../store/pacienteStore.js";

const pacienteStore = usePacienteStore();

const citas = ref([]);

const novaCita = reactive({
  dnipac: "",
  nomepac: "",
  apelpac: "",
  data: "",
  hora: "",
});

watch(
  () => [
    pacienteStore.dnipac,
    pacienteStore.nomepac,
    pacienteStore.apelpac,
  ],
  () => {
    novaCita.dnipac = pacienteStore.dnipac || "";
    novaCita.nomepac = pacienteStore.nomepac || "";
    novaCita.apelpac = pacienteStore.apelpac || "";
  },
  { immediate: true },
);

function guardarCita() {
  if (!novaCita.dnipac) {
    return;
  }

  citas.value.push({ ...novaCita });

  novaCita.data = "";
  novaCita.hora = "";
}
</script>

<style scoped>
.xestion-citas {
  width: 100%;
  padding: 0.5rem 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  margin-top: 1rem;
}

h4 {
  margin: 0 0 1.2rem;
  padding: 0.7rem 1rem;
  background-color: #89fcbd;
  color: #174d32;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.fila {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.campo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.campo label {
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.campo input {
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: 0.5rem 0.7rem;
  border: 1px solid #000000;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 0.9rem;
}

.campo input[readonly] {
  background-color: #f3f7f5;
}

.botones-formulario {
  display: flex;
  justify-content: center;
}

.btn-guardar {
  min-width: 130px;
  padding: 0.55rem 1.8rem;
  background-color: #89fcbd;
  color: #174d32;
  border: 1px solid #5fcf91;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #70e9a9;
}

.btn-guardar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

th,
td {
  padding: 0.7rem 0.6rem;
  border: 1px solid #e1e1e1;
  text-align: center;
}

th {
  background-color: #f3f7f5;
}

.mensaje {
  text-align: center;
  color: #777;
  padding: 1rem;
}

@media (max-width: 1000px) {
  .fila {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .xestion-citas {
    padding: 1rem;
  }

  .fila {
    grid-template-columns: 1fr;
  }
}
</style>
