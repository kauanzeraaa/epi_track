<!--  -->
<script>
import HeaderTemplate from '../components/Header.vue'
import { ref } from 'vue'
import alertImg from '../assets/cards/alert.png'
import chartImg from '../assets/cards/chart-trend.png'
import checkImg from '../assets/cards/check-shield.png'
import deliverImg from '../assets/cards/deliver.png'
import economyImg from '../assets/cards/economy.png'
import fileImg from '../assets/cards/file-report.png'
import inventoryImg from '../assets/cards/inventory.png'


export default {
  name: "Resources",
  components: {
    HeaderTemplate
  },
  setup() {
    const cards = ref([
      { id: 1,
        img: alertImg,
        alt: "Alerta de validade",
        title: "ALERTAS DE VALIDADE",
        description: "O sistema irá avisar quando o equipamento estiver perto de sua validade e ao atingi-la."
      },
      { id: 2,
        img: inventoryImg,
        alt: "Gestão de estoque",
        title: "GESTÃO DE ESTOQUE",
        description: "O sistema combate o desperdício financeiro gerado por compras desnecessárias (de itens que já existiam no estoque mas não foram achados)."
      }
    ])
    return { cards }
  }
}
</script>

<template>
  <HeaderTemplate />

  <div class="texts">
    <h1 class="tittle">Eleve o nível da sua gestão com as nossas Funcionalidades!</h1>
  </div>

  <section class="section-cards">

    <section v-for="item in cards" :key="item.id" class="card-alert">
      <img :src="item.img" :alt="item.alt">
      <h2 class="h2_tittle">{{ item.title }}</h2>
      <p class="p_tittle">{{ item.description }}</p>
    </section>

  </section>
</template>

<style>
.section-cards{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.texts {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.tittle {
  font-size: 40px;
  line-height: 85%;
  padding: 40px;
}

.h2_tittle{
  display: flex;
  align-items: center;
  font-size: 20px;
  width: 200px;
}

.card-alert {
  width: 80%;
  height: auto;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
}

</style>