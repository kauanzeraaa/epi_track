<script setup>
const benefits = [
  {
    title: 'Redução de erros humanos',
    text: 'Registros automáticos eliminam digitação duplicada, esquecimentos e dados inconsistentes.',
    icon: 'shield-x',
  },
  {
    title: 'Maior segurança operacional',
    text: 'Colaboradores sempre com EPIs válidos e adequados à função que exercem.',
    icon: 'shield',
  },
  {
    title: 'Economia de tempo',
    text: 'O que levava horas em planilhas acontece em segundos dentro do sistema.',
    icon: 'zap',
  },
  {
    title: 'Melhor rastreabilidade',
    text: 'Cada equipamento tem origem, destino e histórico documentados de ponta a ponta.',
    icon: 'route',
  },
  {
    title: 'Gestão inteligente',
    text: 'Indicadores e alertas transformam dados operacionais em decisões estratégicas.',
    icon: 'brain',
  },
  {
    title: 'Conformidade normativa',
    text: 'Evidências organizadas e acessíveis para atender à NR-6 e passar por auditorias sem sustos.',
    icon: 'check-badge',
  },
]
</script>

<template>
  <section class="benefits lp-section">
    <div class="lp-container">
      <div class="lp-section-head lp-section-head--center" data-reveal>
        <span class="lp-eyebrow">Benefícios</span>
        <h2 class="lp-title">Resultados que aparecem<br />na operação e na auditoria</h2>
      </div>

      <div class="benefits__grid">
        <article
          v-for="(benefit, i) in benefits"
          :key="benefit.title"
          class="benefits__card"
          data-reveal
          :style="{ '--d': (i % 3) * 0.1 + 's' }"
        >
          <span class="benefits__icon">
            <svg v-if="benefit.icon === 'shield-x'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
              <path d="m9.5 9.5 5 5M14.5 9.5l-5 5" />
            </svg>
            <svg v-else-if="benefit.icon === 'shield'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
            </svg>
            <svg v-else-if="benefit.icon === 'zap'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2 3 14h7l-1 8 11-13h-8l1-7Z" />
            </svg>
            <svg v-else-if="benefit.icon === 'route'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="6" cy="19" r="3" />
              <circle cx="18" cy="5" r="3" />
              <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12" />
            </svg>
            <svg v-else-if="benefit.icon === 'brain'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
              <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
              <path d="M12 5v13" />
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.text }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.benefits {
  background: var(--lp-white);
}

.benefits__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 64px;
}

.benefits__card {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 28px 26px;
  border-radius: var(--lp-radius);
  background: var(--lp-ice);
  border: 1px solid var(--lp-line);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease,
    border-color 0.35s ease, background 0.35s ease;
}

.benefits__card:hover {
  transform: translateY(-5px);
  background: var(--lp-white);
  border-color: rgba(243, 156, 18, 0.32);
  box-shadow: var(--lp-shadow-md);
}

.benefits__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  flex-shrink: 0;
  color: #d35400;
  background: linear-gradient(135deg, rgba(243, 156, 18, 0.15), rgba(230, 126, 34, 0.08));
  border: 1px solid rgba(243, 156, 18, 0.24);
  transition: transform 0.35s ease;
}

.benefits__card:hover .benefits__icon {
  transform: scale(1.08);
}

.benefits__card h3 {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--lp-navy);
  margin: 0;
}

.benefits__card p {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--lp-muted);
  margin: 8px 0 0;
}

@media (max-width: 1024px) {
  .benefits__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .benefits__grid {
    grid-template-columns: 1fr;
  }
}
</style>
