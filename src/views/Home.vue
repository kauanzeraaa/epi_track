<template>
  <HeaderTemplate />

  <section class="container">
    <div class="home-div">
      <div class="texts">
        <h1 class="tittle">Sistema de Gestão de EPIs</h1>
        <h2 class="caption">Elimine o Controle em Papel e garanta a conformidade e a eficiência na gestão de EPIs com o EPI TRACK</h2>
        <router-link class="button" to="/login">ACESSAR SISTEMA</router-link>
      </div>
    </div>
  
    <div class="imagem">
      <img src="../assets/img_home.png" alt="EPI IMAGE">
    </div>
  </section>
</template>

<!-- Script para acesso ao Router -->
<script>
  import HeaderTemplate from '../components/Header.vue'

  export default {
    name: "Home",
    components:{
      HeaderTemplate
    }
  }

</script>

<style scoped>

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 90px);
  width: 100%;
  margin: 0;
  gap: 15%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.texts{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 2rem;
}

.home-div {
  font-family: var(--main-font);
  width: 28%;
}

.imagem {
  width: 30%;
  display: flex;
  justify-content: center;
}

.imagem img {
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: contain;
}

.tittle{
  font-size: 64px;
  line-height: 85%;
}

.caption{
  color: var(--color-orange);
  line-height: 110%;
  font-weight: 400;
  margin-top: -20px;
}

.button{
  padding: 10px 30px;
  color: white;
  background-color: #2C3E50;
  border-radius: 10px;
  font-size: 18px;
  border-style: none;
  cursor: pointer;
  text-decoration: none;
  margin-top: 1rem;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}
.button:hover{
  transform: scale(1.03);
  background-color: #1a252f;
  box-shadow: 0 6px 16px rgba(44, 62, 80, 0.35);
}

/* Telas até 1024px */
@media (max-width: 1024px) {
  .container {
    gap: 5%;
    padding: 0 2rem;
  }

  .home-div {
    width: 45%;
  }

  .imagem {
    width: 35%;
  }

  .tittle {
    font-size: 48px;
  }
}

/* Telas até 768px */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 3rem;
    padding: 3rem 1.5rem;
    height: auto;
  }

  .home-div {
    width: 100%;
  }

  .texts {
    align-items: center;
    text-align: center;
  }

  .imagem {
    width: 60%;
  }

  .tittle {
    font-size: 38px;
    line-height: 110%;
  }
}

/* Telas até 480px */
@media (max-width: 480px) {
  .imagem {
    width: 100%;
  }
  
  .tittle {
    font-size: 32px;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
