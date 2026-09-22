<template>
  <div id="app">
    <NavBar />
    <router-view />
    <FooTer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooTer from './components/FooTer.vue'

</script>

<style>
:global(body) {
  margin: 0;
  background: #f6f6f6;
}

#app {
  max-width: 80vw;
  min-height: 100vh;
  margin: 0 auto;
  padding-top: 1rem;
  padding-bottom: 1rem;

  display: flex;
  flex-direction: column;
}

/* El contenido ocupa el espacio disponible y empuja el footer abajo */
#app > :nth-child(2) {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  #app {
    max-width: 95vw;
  }
}
</style>

