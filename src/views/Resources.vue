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

<style scoped>
.texts {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
}

.tittle {
  font-size: 40px;
  line-height: 100%;
  padding: 40px 0px 60px;
}

.section-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 60px;
}

/* When 7 cards (odd count), span the lone last card full width */
.card-alert:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  max-width: 550px;
  justify-self: center;
  width: 100%;
}

.card-alert {
  width: 100%;
  min-height: 90px;
  height: auto;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-alert:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-alert img {
  width: 40px;
  height: 50px;
  object-fit: contain;
  flex-shrink: 0;
}

/* --- Telas menores que 768px --- */
@media (max-width: 768px) {
  .tittle {
    font-size: 28px;
    padding: 30px 20px 40px;
  }

  .section-cards {
    grid-template-columns: 1fr;
    width: 90%;
    padding-bottom: 40px;
  }

  .card-alert:last-child:nth-child(odd) {
    grid-column: auto;
    max-width: none;
    justify-self: auto;
  }

  .card-alert {
    padding: 1rem;
  }

  .card-text h2 {
    font-size: 18px;
  }

  .card-text p {
    font-size: 14px;
  }
}

/* --- Telas muito pequenas, menores que 480px --- */
@media (max-width: 480px) {
  .card-alert {
    flex-direction: column;
    text-align: center;
  }
}
</style>