<template>
  <main class="aviso-legal">
    <h4 class="titulo-seccion">AVISO LEGAL</h4>

    <section class="introduccion">
      <h1>Información legal</h1>
      <p>
        Benvido/a a Sanidad Teis. Nesta páxina recollemos a información
        básica sobre o funcionamento e as condicións de uso desta aplicación.
      </p>
    </section>

    <section class="apartado">
      <h2>1. Datos identificativos</h2>
      <p>
        Sanidad Teis é un proxecto académico desenvolvido con fins educativos,
        orientado á xestión e organización de información relacionada co ámbito
        sanitario.
      </p>
      <p><strong>Nome do proxecto:</strong> Sanidad Teis</p>
      <p><strong>Actividade:</strong> Aplicación web de xestión sanitaria</p>
      <p><strong>Centro educativo:</strong> IES de Teis</p>
    </section>

    <section class="apartado">
      <h2>2. Finalidade da aplicación</h2>
      <p>
        Esta aplicación ten como finalidade servir de exemplo práctico dunha
        ferramenta para organizar pacientes, profesionais sanitarios e citas.
        O seu uso é exclusivamente demostrativo e educativo.
      </p>
    </section>

    <section class="apartado">
      <h2>3. Condicións de uso</h2>
      <p>
        A persoa usuaria comprométese a facer un uso responsable da aplicación,
        evitando accións que poidan danar, interromper ou alterar o seu
        funcionamento.
      </p>
      <p>
        Non está permitido utilizar esta plataforma para introducir información
        real ou datos persoais de pacientes.
      </p>
    </section>

    <section class="apartado">
      <h2>4. Propiedade intelectual</h2>
      <p>
        Os elementos, deseño e contidos desta aplicación forman parte dun
        proxecto académico. Non se permite a súa reprodución ou distribución
        con fins comerciais sen a correspondente autorización.
      </p>
    </section>

    <section class="apartado">
      <h2>5. Responsabilidade</h2>
      <p>
        Sanidad Teis non ofrece servizos médicos nin substitúe a atención
        prestada por profesionais sanitarios. A información introducida
        na aplicación é de carácter ficticio e non debe empregarse para
        tomar decisións clínicas.
      </p>
    </section>

    <section class="apartado">
      <h2>6. Modificacións</h2>
      <p>
        Este aviso legal poderá ser actualizado cando sexa necesario para
        reflectir cambios no funcionamento ou nas características do proxecto.
      </p>
    </section>

    <div class="nota-final">
      <strong>Sanidad Teis</strong>
      <span>Proxecto académico · IES de Teis</span>
    </div>
  </main>
</template>

<style scoped>
.aviso-legal {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.titulo-seccion {
  background: #027951;
  color: white;
  text-align: center;
  padding: 0.7rem 1rem;
  border-radius: 4px;
  margin: 0 0 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.introduccion {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e6eee9;
}

.introduccion h1 {
  color: #174b3b;
  font-size: 1.8rem;
  margin: 0 0 0.8rem;
}

.introduccion p {
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.apartado {
  margin-bottom: 1.8rem;
}

.apartado h2 {
  color: #027951;
  font-size: 1.15rem;
  margin: 0 0 0.8rem;
}

.apartado p {
  color: #555;
  line-height: 1.8;
  margin: 0 0 0.6rem;
}

.apartado strong {
  color: #333;
}

.nota-final {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1.5rem;
  margin-top: 2rem;
  background: #edf7f1;
  border-radius: 6px;
  color: #027951;
}

.nota-final span {
  color: #666;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .aviso-legal {
    width: 95%;
    padding: 1.2rem;
    margin: 1rem auto;
  }

  .introduccion h1 {
    font-size: 1.5rem;
  }
}
</style>