<template>
  <main class="sobre-nos">
    <h4 class="titulo-seccion">SOBRE NOS</h4>

    <section class="presentacion">
      <span class="etiqueta">SANIDAD TEIS</span>

      <h1>Coidamos das persoas, tamén a través da tecnoloxía.</h1>

      <p>
        Sanidad Teis é unha proposta de aplicación web pensada para facilitar
        a organización e xestión da información dun centro sanitario.
        Un espazo onde pacientes, profesionais e citas están conectados
        dunha maneira sinxela e ordenada.
      </p>
    </section>

    <section class="bloque-info">
      <div class="texto-info">
        <h2>Quen somos?</h2>
        <p>
          Somos un proxecto centrado en achegar a tecnoloxía ao ámbito sanitario.
          A nosa idea é ofrecer unha ferramenta intuitiva que axude a organizar
          o traballo diario e permita acceder á información de forma rápida
          e clara.
        </p>
        <p>
          Porque detrás de cada dato hai unha persoa, cremos que unha boa
          organización tamén forma parte dunha boa atención.
        </p>
      </div>

      <div class="icono-info">
        <span>+</span>
        <strong>SANIDAD<br />TEIS</strong>
        <small>Saúde e tecnoloxía</small>
      </div>
    </section>

    <section class="valores">
      <h2>O que nos define</h2>

      <div class="tarxetas">
        <article class="tarxeta">
          <div class="icono-tarxeta">⌂</div>
          <h3>Organización</h3>
          <p>
            Toda a información importante nun mesmo lugar, para facilitar
            o traballo e evitar complicacións.
          </p>
        </article>

        <article class="tarxeta">
          <div class="icono-tarxeta">♡</div>
          <h3>Persoas</h3>
          <p>
            Poñemos as persoas no centro, buscando unha xestión máis próxima,
            clara e accesible.
          </p>
        </article>

        <article class="tarxeta">
          <div class="icono-tarxeta">✓</div>
          <h3>Sinxeleza</h3>
          <p>
            Apostamos por unha interface intuitiva, práctica e fácil de utilizar
            no día a día.
          </p>
        </article>
      </div>
    </section>

    <section class="obxectivo">
      <h2>O noso obxectivo</h2>
      <p>
        Facer que a xestión sanitaria sexa máis sinxela, conectando a información
        e facilitando a organización de pacientes, profesionais e citas.
      </p>
      <span>Sanidad Teis · Tecnoloxía ao servizo das persoas</span>
    </section>
  </main>
</template>

<style scoped>
.sobre-nos {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.titulo-seccion {
  background:#87e474;
  color: white;
  text-align: center;
  padding: 0.7rem 1rem;
  border-radius: 4px;
  margin: 0 0 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.presentacion {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 3rem;
}

.etiqueta {
  display: inline-block;
  color: #027951;
  background: #e9f7ef;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.presentacion h1 {
  color: #174b3b;
  font-size: 2.3rem;
  line-height: 1.25;
  margin: 1.2rem 0;
}

.presentacion p {
  color: #666;
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0;
}

.bloque-info {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  align-items: center;
  background: #f5faf7;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.texto-info h2,
.valores h2,
.obxectivo h2 {
  color: #027951;
  font-size: 1.5rem;
  margin: 0 0 1rem;
}

.texto-info p {
  color: #555;
  line-height: 1.8;
  margin: 0 0 0.8rem;
}

.icono-info {
  min-height: 190px;
  background: #027951;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 0.5rem;
}

.icono-info span {
  color: #87e474;
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1;
}

.icono-info strong {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 2px;
}

.icono-info small {
  color: #d6eee3;
  font-size: 0.85rem;
}

.valores {
  margin-bottom: 3rem;
}

.valores h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.tarxetas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}

.tarxeta {
  padding: 1.5rem;
  border: 1px solid #e6eee9;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.tarxeta:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 15px rgba(2, 121, 81, 0.1);
}

.icono-tarxeta {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9f7ef;
  color: #027951;
  border-radius: 50%;
  font-size: 1.7rem;
  font-weight: 600;
}

.tarxeta h3 {
  color: #174b3b;
  margin: 0 0 0.7rem;
  font-size: 1.1rem;
}

.tarxeta p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 0;
}

.obxectivo {
  background: #edf7f1;
  border-left: 5px solid #87e474;
  border-radius: 4px;
  padding: 1.8rem 2rem;
  text-align: center;
}

.obxectivo p {
  color: #555;
  line-height: 1.8;
  margin: 0 auto 1rem;
  max-width: 750px;
}

.obxectivo span {
  color: #027951;
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sobre-nos {
    width: 95%;
    padding: 1.2rem;
    margin: 1rem auto;
  }

  .presentacion h1 {
    font-size: 1.8rem;
  }

  .bloque-info {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .icono-info {
    min-height: 160px;
  }

  .tarxetas {
    grid-template-columns: 1fr;
  }

  .obxectivo {
    padding: 1.5rem 1rem;
  }
}
</style>