import { defineStore } from "pinia";

export const usePacienteStore = defineStore("paciente", {
  state: () => ({
    pacienteSeleccionado: null
  }),

  actions: {
    seleccionarPaciente(paciente) {
      this.pacienteSeleccionado = {
        id: paciente.id ?? paciente._id,
        dni: paciente.dni,
        nome: paciente.nome,
        apelidos: paciente.apelidos
      };
    },

    limpiarPaciente() {
      this.pacienteSeleccionado = null;
    }
  }
});