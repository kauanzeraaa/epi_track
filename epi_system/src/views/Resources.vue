<!--  -->
<script>
import HeaderTemplate from '../components/Header.vue'
import { ref } from 'vue'

export default {
  name: "Resources",
  components: {
    HeaderTemplate
  },
  setup() {
    const cards = ref([
      { id: 1,
        img: '../assets/cards/alert.png',
        alt: "Alerta",
        title: "Alertas",
        description: "Receba notificações sobre vencimentos e manutenções."
      },
      { id: 2,
        img: '../assets/cards/reminder.png',
        alt: "Lembrete",
        title: "Lembretes",
        description: "Receba lembretes sobre prazos e eventos importantes."
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
      <img :src="item.img" :alt="item.alt"></img>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </section>

  </section>
</template>

<style>
.section-cards{
  width: 100%;
  height: 50%;
}

.texts {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.tittle {
  font-size: 40px;
}

.card-alert {
  width: 30rem;
  height: auto;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

</style>