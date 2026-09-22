import { createRouter, createWebHistory } from "vue-router";

import IniCio from '/src/components/IniCio.vue';
import XestionPacientes from '/src/components/XestionPacientes.vue';
import SobreNos from '/src/components/SobreNos.vue';
import NotFound from '/src/components/NotFound.vue';
import AvisoLegal from '/src/components/AvisoLegal.vue';

const routes = [
  {path: '/', name: IniCio, component: IniCio},
  {path: '/XestionPacientes', name: XestionPacientes, component: XestionPacientes},
  {path: '/sobrenos', name: SobreNos, component: SobreNos},
  {path: '/avisolegal', name: AvisoLegal, component: AvisoLegal},
  {path: '/:pathMatch(.*)*', name:NotFound, component: NotFound},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;