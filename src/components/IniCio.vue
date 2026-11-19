
<template>
  <main class="inicio">

    <!-- Vídeo de fondo -->
    <video
      class="video-fondo"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    >
      <source :src="videoInicio" type="video/mp4" />
    </video>

    <!-- Capa oscura sobre el vídeo -->
    <div class="capa-oscura"></div>

    <!-- Contenido principal -->
    <section class="contenido">

      <div class="etiqueta">
        <span class="punto"></span>
        SISTEMA DE XESTIÓN SANITARIA
      </div>

      <h1>
        SANIDAD
        <span>TEIS</span>
      </h1>

      <div class="separador"></div>

      <p class="frase">
        Tecnología al servicio de las personas.
      </p>

      <p class="descripcion">
        Un espacio para conectar pacientes y profesionales,
        organizar citas y facilitar la gestión sanitaria.
        Todo lo que necesitas, en un mismo lugar.
      </p>

      <!-- Botones -->
      <div class="botones-inicio">
        <RouterLink
          to="/xestion-pacientes"
          class="btn-principal"
        >
          👥 Gestión de pacientes
        </RouterLink>

        <RouterLink
          to="/xestion-doctores"
          class="btn-secundario"
        >
          Conocer doctores →
        </RouterLink>
      </div>

      <!-- Información inferior -->
      <div class="informacion">
        <div class="info-item">
          <span class="info-icono">👥</span>
          <div>
            <strong>Pacientes</strong>
            <small>Información organizada</small>
          </div>
        </div>

        <div class="linea-vertical"></div>

        <div class="info-item">
          <span class="info-icono">🩺</span>
          <div>
            <strong>Profesionales</strong>
            <small>Gestión de doctores</small>
          </div>
        </div>

        <div class="linea-vertical"></div>

        <div class="info-item">
          <span class="info-icono">📅</span>
          <div>
            <strong>Citas</strong>
            <small>Seguimiento y control</small>
          </div>
        </div>
      </div>

    </section>

    <div class="texto-inferior">
      SANIDAD TEIS <span>·</span> XESTIÓN SANITARIA
    </div>

  </main>
</template>

<script setup>
import videoInicio from "../assets/video.mp4";
</script>

<style scoped>
.inicio {
  position: relative;
  width: 100%;
  min-height: 720px;
  height: calc(100vh - 110px);
  max-height: 950px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #102b32;
  box-sizing: border-box;
  color: white;
}

/* VÍDEO */

.video-fondo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

/* OSCURECER EL VÍDEO */

.capa-oscura {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(
      90deg,
      rgba(5, 22, 25, 0.94) 0%,
      rgba(5, 22, 25, 0.78) 48%,
      rgba(5, 22, 25, 0.28) 100%
    );
}

/* CONTENIDO */

.contenido {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 850px;
  padding: 4rem 5rem;
  box-sizing: border-box;
}

/* ETIQUETA SUPERIOR */

.etiqueta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.8rem;
  color: #b9e9b0;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 3px;
}

.punto {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #87e474;
  box-shadow: 0 0 12px rgba(135, 228, 116, 0.8);
}

/* TÍTULO */

h1 {
  margin: 0;
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  line-height: 0.98;
  font-weight: 800;
  letter-spacing: -3px;
  color: white;
  text-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
}

h1 span {
  display: block;
  color: #87e474;
}

/* SEPARADOR */

.separador {
  width: 75px;
  height: 4px;
  margin: 2rem 0 1.5rem;
  border-radius: 5px;
  background: #87e474;
}

/* FRASES */

.frase {
  margin: 0 0 1rem;
  color: white;
  font-size: clamp(1.3rem, 2.5vw, 1.8rem);
  font-weight: 600;
  letter-spacing: 0.2px;
}

.descripcion {
  max-width: 540px;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1rem;
  line-height: 1.8;
}

/* BOTONES */

.botones-inicio {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 2.2rem;
}

.btn-principal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0.8rem 1.3rem;
  border-radius: 5px;
  background: #87e474;
  color: #173b28;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 700;
  transition: 0.2s ease;
}

.btn-principal:hover {
  background: #a0f08d;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(135, 228, 116, 0.2);
}

.btn-secundario {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0.7rem 0.5rem;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s ease;
}

.btn-secundario:hover {
  color: #87e474;
}

/* INFORMACIÓN INFERIOR */

.informacion {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  width: fit-content;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.info-icono {
  font-size: 1.45rem;
}

.info-item div {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.info-item strong {
  color: white;
  font-size: 0.8rem;
}

.info-item small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.68rem;
  white-space: nowrap;
}

.linea-vertical {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
}

/* TEXTO INFERIOR */

.texto-inferior {
  position: absolute;
  z-index: 2;
  bottom: 1.2rem;
  right: 1.5rem;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 2px;
}

.texto-inferior span {
  color: #87e474;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .inicio {
    min-height: 680px;
  }

  .contenido {
    padding: 3rem;
  }

  .informacion {
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .inicio {
    min-height: 760px;
    height: auto;
  }

  .capa-oscura {
    background: rgba(5, 22, 25, 0.75);
  }

  .contenido {
    padding: 3rem 1.3rem 5rem;
  }

  h1 {
    font-size: 4rem;
    letter-spacing: -2px;
  }

  .etiqueta {
    font-size: 0.65rem;
    letter-spacing: 2px;
  }

  .descripcion {
    font-size: 0.9rem;
  }

  .botones-inicio {
    align-items: stretch;
    flex-direction: column;
    gap: 0.6rem;
  }

  .btn-principal,
  .btn-secundario {
    width: 100%;
    box-sizing: border-box;
  }

  .informacion {
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 2.5rem;
  }

  .linea-vertical {
    display: none;
  }

  .info-item strong {
    font-size: 0.85rem;
  }

  .texto-inferior {
    right: 1rem;
    bottom: 0.8rem;
    font-size: 0.55rem;
  }
}
</style>
