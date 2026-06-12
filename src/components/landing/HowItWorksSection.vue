<script setup>
const steps = [
  {
    title: 'Cadastro de EPIs',
    text: 'Registre equipamentos com tipo, CA, validade e quantidade em estoque.',
    icon: 'register',
  },
  {
    title: 'Vinculação ao colaborador',
    text: 'Entregue o EPI e vincule ao colaborador com data e responsável.',
    icon: 'link',
  },
  {
    title: 'Monitoramento automático',
    text: 'O sistema acompanha validade, estoque e prazos — e alerta sozinho.',
    icon: 'monitor',
  },
  {
    title: 'Relatórios e conformidade',
    text: 'Gere relatórios completos e comprove a conformidade em segundos.',
    icon: 'report',
  },
]
</script>

<template>
  <section id="como-funciona" class="how lp-section">
    <div class="lp-container">
      <div class="lp-section-head lp-section-head--center" data-reveal>
        <span class="lp-eyebrow">Como Funciona</span>
        <h2 class="lp-title">Do cadastro à conformidade<br />em 4 etapas</h2>
        <p class="lp-subtitle">
          Um fluxo simples e direto, pensado para quem está no dia a dia da operação.
        </p>
      </div>

      <div class="how__steps">
        <div class="how__line" aria-hidden="true"></div>

        <article
          v-for="(step, i) in steps"
          :key="step.title"
          class="how__step"
          data-reveal
          :style="{ '--d': i * 0.12 + 's' }"
        >
          <div class="how__node">
            <span class="how__number">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div class="how__card">
            <span class="how__icon">
              <svg v-if="step.icon === 'register'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
              </svg>
              <svg v-else-if="step.icon === 'link'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="7" r="3.5" />
                <path d="M3 21a6 6 0 0 1 12 0M16 3.5a3.5 3.5 0 0 1 0 7M21 21a6 6 0 0 0-4-5.65" />
              </svg>
              <svg v-else-if="step.icon === 'monitor'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 8L9 4l-3 8H2" />
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how {
  background: var(--lp-ice);
}

.how__steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
  margin-top: 72px;
}

/* Linha que conecta as etapas */
.how__line {
  position: absolute;
  top: 27px;
  left: 12%;
  right: 12%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(243, 156, 18, 0.55),
    rgba(44, 62, 80, 0.18) 60%,
    rgba(44, 62, 80, 0.18)
  );
}

.how__step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.how__node {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--lp-grad-orange);
  box-shadow: 0 10px 26px rgba(243, 156, 18, 0.35), 0 0 0 7px var(--lp-ice);
}

.how__number {
  font-size: 16px;
  font-weight: 700;
  color: #1d1303;
  letter-spacing: -0.01em;
}

.how__card {
  margin-top: 26px;
  padding: 28px 22px;
  width: 100%;
  flex: 1;
  text-align: center;
  border-radius: var(--lp-radius);
  background: var(--lp-white);
  border: 1px solid var(--lp-line);
  box-shadow: var(--lp-shadow-sm);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.how__step:hover .how__card {
  transform: translateY(-6px);
  box-shadow: var(--lp-shadow-md);
  border-color: rgba(243, 156, 18, 0.3);
}

.how__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: var(--lp-navy);
  background: rgba(44, 62, 80, 0.07);
  border: 1px solid rgba(44, 62, 80, 0.1);
}

.how__card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--lp-navy);
  margin: 16px 0 0;
  letter-spacing: -0.01em;
}

.how__card p {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--lp-muted);
  margin: 8px 0 0;
}

@media (max-width: 920px) {
  .how__steps {
    grid-template-columns: 1fr;
    gap: 18px;
    max-width: 460px;
    margin-inline: auto;
  }

  .how__line {
    top: 27px;
    bottom: 27px;
    left: 26px;
    right: auto;
    width: 2px;
    height: auto;
    background: linear-gradient(
      180deg,
      rgba(243, 156, 18, 0.55),
      rgba(44, 62, 80, 0.18) 60%,
      rgba(44, 62, 80, 0.18)
    );
  }

  .how__step {
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
  }

  .how__node {
    flex-shrink: 0;
    box-shadow: 0 10px 26px rgba(243, 156, 18, 0.35), 0 0 0 6px var(--lp-ice);
  }

  .how__card {
    margin-top: 0;
    text-align: left;
  }
}
</style>
