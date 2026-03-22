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
      {
        id: 1,
        img: alertImg,
        alt: "Alerta de validade",
        title: "ALERTAS DE VALIDADE",
        description: "O sistema irá avisar quando o equipamento estiver perto de sua validade e ao atingi-la."
      },
      {
        id: 2,
        img: inventoryImg,
        alt: "Gestão de estoque",
        title: "GESTÃO DE ESTOQUE",
        description: "O sistema combate o desperdício financeiro gerado por compras desnecessárias (de itens que já existiam no estoque mas não foram achados)."
      },
      {
        id: 3,
        img: deliverImg,
        alt: "Registro de entrega",
        title: "REGISTRO DE ENTREGA",
        description: "O sistema registra digitalmente cada movimentação, vinculando o funcionário ao equipamento, com data e hora de retirada e devolução"
      },
      {
        id: 4,
        img: fileImg,
        alt: "Relatórios",
        title: "RELATÓRIOS",
        description: "O sistema registra gera relatórios dinâmicos e dashboards para utilização em auditorias ou analises de uso e gastos."
      },
      {
        id: 5,
        img: checkImg,
        alt: "Segurança",
        title: "SEGURANÇA",
        description: "O sistema elimina o risco de uso de equipamentos vencidos ou inadequados. Monitorando automaticamente as datas de validade dos lotes e emite alertas antes do vencimento."
      },
      {
        id: 6,
        img: chartImg,
        alt: "Eficiência",
        title: "EFICIÊNCIA",
        description: "O sistema substitui o controle manual em papel, que é lento e gera filas. A solução digital permite realizar fluxos principais em menos de 3 cliques e com tempo de resposta rápido!"
      },
      {
        id: 7,
        img: economyImg,
        alt: "Economia",
        title: "ECONOMIA",
        description: "O sistema centraliza tudo em um banco de dados. Permitindo que os gestores visualizem o consumo, custos e necessidades de compra de forma imediata!"
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
      <img :src="item.img" :alt="item.alt" />

      <div class="card-text">
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
      </div>
    </section>

  </section>
</template>

<style>
.section-cards {
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
  line-height: 100%;
  padding: 40px 0px 60px;
}

.h2_tittle {
  display: flex;
  align-items: center;
  font-size: 20px;
  width: 200px;
}

.card-alert {
  width: 80%;
  height: 90px;
  padding: 1.5rem;
  border-radius: 8px;
  background-image: linear-gradient(to left, #2C3E5040, #AFBAC540);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>