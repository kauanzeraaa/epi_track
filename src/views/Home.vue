<template>
  <HeaderTemplate />

  <section class="container">
    <div class="home-div">
      <div class="texts">
        <h1 class="tittle">Sistema de Gestão de EPIs</h1>
        <h2 class="caption">Elimine o Controle em Papel e garanta a conformidade e a eficiência na gestão de EPIs com o EPI TRACK</h2>
        <router-link class="button" to="/">SOLICITAR ACESSO</router-link>
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
}

.texts{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
}

.home-div {
  font-family: var(--main-font);
  width: 28%;
}

.imagem img {
  max-width: 100%;
  height: auto;
}

.tittle{
  font-size: 64px;
  line-height: 85%;
}

.caption{
  color: var(--color-orange);
  line-height: 110%;
  font-weight: 400;
}

.button{
  padding: 5px 30px;
  color: white;
  background-color: #2C3E50;
  border-radius: 10px;
  font-size: 18px;
  border-style: none;
  cursor: pointer;
  text-decoration: none;
}
.button:hover{
  transform: scale(1.03);
}
</style>
