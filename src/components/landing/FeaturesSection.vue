<script setup>
const features = [
  {
    title: 'Gestão de estoque',
    text: 'Saldo atualizado por tipo, tamanho e CA, com entrada e saída registradas automaticamente.',
    icon: 'stock',
  },
  {
    title: 'Controle de entrega',
    text: 'Cada entrega vinculada ao colaborador, com data, quantidade e responsável pelo registro.',
    icon: 'delivery',
  },
  {
    title: 'Histórico completo',
    text: 'Linha do tempo de todas as movimentações para consultas e auditorias instantâneas.',
    icon: 'history',
  },
  {
    title: 'Alertas automáticos',
    text: 'Notificações de CA próximo do vencimento e de estoque abaixo do nível mínimo.',
    icon: 'alert',
  },
  {
    title: 'Dashboard inteligente',
    text: 'Indicadores visuais e gráficos que mostram a saúde da operação em tempo real.',
    icon: 'dashboard',
  },
  {
    title: 'Relatórios',
    text: 'Exportação de dados consolidados de entregas, estoque e conformidade.',
    icon: 'report',
  },
  {
    title: 'Validade de CA',
    text: 'Acompanhamento contínuo do Certificado de Aprovação de cada equipamento.',
    icon: 'ca',
  },
  {
    title: 'Controle por colaborador',
    text: 'Perfil individual com todos os EPIs recebidos, ativos e pendentes de troca.',
    icon: 'user',
  },
]
</script>

<template>
  <section id="funcionalidades" class="features lp-section">
    <div class="lp-container">
      <div class="lp-section-head lp-section-head--center" data-reveal>
        <span class="lp-eyebrow">Funcionalidades</span>
        <h2 class="lp-title">Tudo o que a gestão de EPIs<br />precisa, em um só lugar</h2>
        <p class="lp-subtitle">
          Módulos pensados para o fluxo real do almoxarifado e da segurança do trabalho —
          simples de usar, completos no controle.
        </p>
      </div>

      <div class="features__grid">
        <article
          v-for="(feature, i) in features"
          :key="feature.title"
          class="features__card"
          data-reveal
          :style="{ '--d': (i % 4) * 0.08 + 's' }"
        >
          <span class="features__icon">
            <svg v-if="feature.icon === 'stock'" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12M6 14h12" />
            </svg>
            <svg v-else-if="feature.icon === 'delivery'" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M3.5 17h17M8 21h8" />
              <path d="m9 11 2 2 4-4" />
            </svg>
            <svg v-else-if="feature.icon === 'history'" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5M12 7v5l4 2" />
            </svg>
            <svg v-else-if="feature.icon === 'alert'" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <svg v-else-if="feature.icon === 'dashboard'" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
            <svg v-else-if="feature.icon === 'report'" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6M9 17v-3M12.5 17v-5M16 17v-2" />
            </svg>
            <svg v-else-if="feature.icon === 'ca'" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <svg v-else width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
          <span class="features__shine" aria-hidden="true"></span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  background: var(--lp-white);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 64px;
}

.features__card {
  position: relative;
  padding: 30px 26px;
  border-radius: var(--lp-radius);
  background: var(--lp-ice);
  border: 1px solid var(--lp-line);
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease,
    border-color 0.35s ease, background 0.35s ease;
}

.features__card:hover {
  transform: translateY(-6px);
  background: var(--lp-white);
  border-color: rgba(243, 156, 18, 0.35);
  box-shadow: var(--lp-shadow-md);
}

.features__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  color: #fff;
  background: linear-gradient(135deg, var(--lp-navy-700), var(--lp-navy));
  box-shadow: 0 8px 20px rgba(44, 62, 80, 0.22);
  transition: background 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
}

.features__card:hover .features__icon {
  background: var(--lp-grad-orange);
  box-shadow: 0 10px 24px rgba(243, 156, 18, 0.38);
  transform: scale(1.07);
  color: #1d1303;
}

.features__card h3 {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--lp-navy);
  margin: 18px 0 0;
}

.features__card p {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--lp-muted);
  margin: 8px 0 0;
}

/* Brilho sutil que cruza o card no hover */
.features__shine {
  position: absolute;
  top: 0;
  left: -80%;
  width: 50%;
  height: 100%;
  background: linear-gradient(100deg, transparent, rgba(243, 156, 18, 0.07), transparent);
  transform: skewX(-20deg);
  pointer-events: none;
  transition: left 0.7s ease;
}

.features__card:hover .features__shine {
  left: 130%;
}

@media (max-width: 1024px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .features__grid {
    grid-template-columns: 1fr;
  }
}
</style>
