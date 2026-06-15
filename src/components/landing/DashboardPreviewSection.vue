<script setup>
import { ref, computed } from 'vue'

import imgDashboard from '../../assets/prints/print-dashboard.png'
import imgCatalogo from '../../assets/prints/print-catalogo.png'
import imgMov from '../../assets/prints/print-movimentacoes.png'
import imgFicha from '../../assets/prints/print-ficha.png'

import imgDashMob from '../../assets/prints/print-dashboard-mob.png'
import imgCatMob from '../../assets/prints/print-catalogo-mob.png'
import imgMovMob from '../../assets/prints/print-movimentacoes-web.png'
import imgFichaMob from '../../assets/prints/print-ficha-web.png'

const tabs = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    imgDesk: imgDashboard,
    imgMob: imgDashMob
  },
  { 
    id: 'catalogo', 
    label: 'Catálogo de EPIs', 
    imgDesk: imgCatalogo,
    imgMob: imgCatMob 
  },
  {
    id: 'movimentacoes',
    label: 'Movimentações',
    imgDesk: imgMov,
    imgMob: imgMovMob
  },
  {
    id: 'ficha',
    label: 'Ficha de EPI (NR-6)',
    imgDesk: imgFicha,
    imgMob: imgFichaMob
  }
]
const activeTabId = ref(tabs[0].id)

// Função que descobre qual imagem deve aparecer com base na aba clicada
const activeImage = computed(() => {
  const tab = tabs.find(t => t.id === activeTabId.value)
  return tab ? tab.image : ''
})

// Pega a aba ativa inteira para termos acesso a ambas as imagens (Desk e Mob)
const activeTab = computed(() => {
  return tabs.find(t => t.id === activeTabId.value) || tabs[0]
})
</script>

<template>
  <section id="preview" class="preview lp-section">
    <div class="lp-container">
      
      <div class="lp-section-head lp-section-head--center" data-reveal>
        <span class="lp-eyebrow">Por Dentro do Sistema</span>
        <h2 class="lp-title">Uma interface clara para<br />decisões rápidas</h2>
        <p class="lp-subtitle">
          Navegue pelos módulos do PPE Manager e veja o nosso design focado na produtividade do seu almoxarifado.
        </p>
      </div>

      <div class="preview__tabs" role="tablist" aria-label="Telas do sistema">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="preview__tab"
          :class="{ 'is-active': activeTabId === tab.id }"
          role="tab"
          @click="activeTabId = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="preview__window" data-reveal>
        <Transition name="fade" mode="out-in">
          
          <picture :key="activeTabId" class="preview__picture">
            
            <source media="(max-width: 768px)" :srcset="activeTab.imgMob">
            
            <img
              :src="activeTab.imgDesk"
              :alt="`Print da tela ${activeTab.label}`"
              class="preview__image"
            />
            
          </picture>

        </Transition>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Fundo geral da Landing Page */
.preview {
  padding: 80px 20px;
  background-color: #f8fafc;
  text-align: center;
  font-family: 'Inter', sans-serif;
}

.lp-eyebrow {
  color: #F39C12;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 8px;
}

.lp-title {
  font-size: 32px;
  color: #1a2533;
  font-weight: 800;
  margin: 0 0 16px 0;
}

.lp-subtitle {
  color: #64748b;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Abas de Navegação (Botões) */
.preview__tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.preview__tab {
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}

.preview__tab:hover { 
  background: #f1f5f9; 
}

.preview__tab.is-active {
  background: #2C3E50;
  color: white;
  border-color: #2C3E50;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.2);
}

/* Contêiner da Imagem (simulando a janela do sistema) */
.preview__window {
  display: block;
  width: 100%;
  max-width: 1100px; /* Largura máxima para não estourar em monitores ultrawide */
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  overflow: hidden;
  
  /* Mantém uma altura mínima para evitar que a tela "pule" ao trocar as imagens */
  min-height: 500px; 

  align-items: flex-start;
  justify-content: center;
}

/* A imagem estática ocupando o espaço */
.preview__image {
  width: 100%;
  height: auto;
  display: block;
}

/* Efeito de Transição Fade (Esmaecer) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>