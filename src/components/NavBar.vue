<template>
  <nav class="navbar">
<RouterLink to="/" class="logo">
  <img src="/icono.jpg" alt="Sanidad Teis" />
</RouterLink>
    <!-- NUEVO -->
    <button class="hamburger" @click="isOpen = !isOpen">☰</button>

    <!-- MODIFICADO -->
    <ul :class="['menu', { open: isOpen }]">
      <li><RouterLink to="/">Inicio</RouterLink></li>
      <li>
        <RouterLink to="/xestion-pacientes">Xestion de Pacientes</RouterLink>
      </li>

      <li><RouterLink to="/xestion-doctores">Xestión de Doctores</RouterLink></li>
                <li><RouterLink to="/xestion-citas">
  Xestión de citas
</RouterLink></li>
            <li><RouterLink to="/SobreNos">Sobre nós</RouterLink></li>
  
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue"; // será boolean
const isOpen = ref(false); // actívase cuando fago click
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 6rem;
  background: #027951;
  color: white;
}
.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
}

.logo img {
  display: block;
  height: 48px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
}

.menu {
  display: flex;
  gap: 0.8rem;
  list-style: none;
}

.menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.menu a.router-link-active {
  border-bottom: 0.2rem solid #87e474;
}

/* NUEVO */
.hamburger {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
}

/* NUEVO (responsive) */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .menu {
    display: none;
    position: absolute;
    top: 50px;
    right: 0;
    flex-direction: column;
    background: #1b4965;
    padding: 1rem;
  }

  .menu.open {
    display: flex;
  }
  .logo img {
  height: 40px;
}
}
</style>
