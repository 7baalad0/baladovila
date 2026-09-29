<template>
  <footer class="footer-content footer">

     <router-link to="/avisolegal" class="aviso-legal-link" target="blank" >Aviso Legal</router-link>

     <p>© {{ new Date().getFullYear() }} Sanidad Teis — Desenvolvido en Vue 3</p>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  background: #027951;
  color: white;
  text-align: center;
  padding: 0.2rem 6rem;
  margin-top: 3rem;
  font-size: 0.9rem;
  height: 3rem;
}

.link-aviso {
  display: block;
  margin-top: 6px;
  color: #f9d342;
  cursor: pointer;
}

.footer-content {
  display: flex;
  justify-content: center; /* centra horizontalmente */
  align-items: center;      /* alinea verticalmente na mesma liña */
  gap: 5rem;                /* espazo entre o texto e o enlace */
}

.aviso-legal-link {
  color: white;
}
.aviso-legal-link:hover {
  color: blue; /* Cambia a cor ao pasar o cursor */
}
</style>
