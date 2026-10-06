import { createRouter, createWebHistory } from "vue-router";

import IniCio from '/src/components/IniCio.vue';
import XestionPacientes from '/src/components/XestionPacientes.vue';
import SobreNos from '/src/components/SobreNos.vue';
import NotFound from '/src/components/NotFound.vue';
import AvisoLegal from '/src/components/AvisoLegal.vue';
import PoliticaPrivacidad from '/src/components/PoliticaPrivacidad.vue';
import XestionsDoctores from '/src/components/XestionsDoctores.vue';

const routes = [
  {path: '/', name: IniCio, component: IniCio},
  {path: '/xestion-pacientes', name: XestionPacientes, component: XestionPacientes},
  {path: '/sobrenos', name: SobreNos, component: SobreNos},
  {path: '/avisolegal', name: AvisoLegal, component: AvisoLegal},
  {path: '/politica-privacidad', name: PoliticaPrivacidad, component: PoliticaPrivacidad},
  {path: '/xestion-doctores', name: XestionsDoctores, component: XestionsDoctores},
  {path: '/:pathMatch(.*)*', name:NotFound, component: NotFound},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;