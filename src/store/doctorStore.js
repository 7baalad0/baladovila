import { defineStore } from "pinia";

export const useDoctorStore = defineStore("doctor", {
  state: () => ({
    doctorSeleccionado: null
  }),

  actions: {
    seleccionarDoctor(doctor) {
      this.doctorSeleccionado = {
        id: doctor._id ?? doctor.id,
        nome: `${doctor.nomedoc} ${doctor.apeldoc}`.trim(),
        nomedoc: doctor.nomedoc,
        apeldoc: doctor.apeldoc
      };
    },

    limpiarDoctor() {
      this.doctorSeleccionado = null;
    }
  }
});