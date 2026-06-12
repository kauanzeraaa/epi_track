<script setup>
const problems = [
  {
    title: 'Perda de equipamentos',
    text: 'Sem registro confiável, EPIs somem do estoque e ninguém sabe com quem estão ou quando foram entregues.',
    icon: 'box',
  },
  {
    title: 'Validade vencida',
    text: 'Certificados de Aprovação (CA) expiram silenciosamente, expondo colaboradores a riscos e a empresa a multas.',
    icon: 'clock',
  },
  {
    title: 'Falta de rastreabilidade',
    text: 'Impossível comprovar quem recebeu o quê, quando e em qual condição — um problema sério em auditorias.',
    icon: 'search',
  },
  {
    title: 'Controles em planilhas',
    text: 'Planilhas desatualizadas, versões duplicadas e dados digitados manualmente geram erros constantes.',
    icon: 'sheet',
  },
  {
    title: 'Baixa organização',
    text: 'Informações espalhadas em papéis, e-mails e arquivos dificultam decisões rápidas e a gestão do dia a dia.',
    icon: 'scatter',
  },
]
</script>

<template>
  <section id="problema" class="problem lp-section">
    <div class="lp-container">
      <div class="lp-section-head lp-section-head--center" data-reveal>
        <span class="lp-eyebrow">O Problema</span>
        <h2 class="lp-title">O controle manual de EPIs<br />está custando caro</h2>
        <p class="lp-subtitle">
          Papel, planilhas e memória não sustentam a gestão de segurança de uma operação
          moderna. As falhas se acumulam — e as consequências também.
        </p>
      </div>

      <div class="problem__grid">
        <article
          v-for="(problem, i) in problems"
          :key="problem.title"
          class="problem__card"
          data-reveal
          :style="{ '--d': i * 0.08 + 's' }"
        >
          <span class="problem__icon">
            <svg v-if="problem.icon === 'box'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z" />
              <path d="M3.3 7 12 12l8.7-5M12 22V12" />
            </svg>
            <svg v-else-if="problem.icon === 'clock'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            <svg v-else-if="problem.icon === 'search'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3M11 8v3M11 14h.01" />
            </svg>
            <svg v-else-if="problem.icon === 'sheet'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="6" cy="6" r="2.5" />
              <circle cx="18" cy="8" r="2.5" />
              <circle cx="9" cy="18" r="2.5" />
              <path d="M8.2 7.5 15.7 8M7.2 8.3 8.5 15.7M16.3 10.2l-5.5 6" />
            </svg>
          </span>
          <h3>{{ problem.title }}</h3>
          <p>{{ problem.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.problem {
  background: var(--lp-ice);
}

.problem__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
  margin-top: 64px;
}

.problem__card {
  position: relative;
  padding: 32px 28px;
  border-radius: var(--lp-radius);
  background: var(--lp-white);
  border: 1px solid var(--lp-line);
  box-shadow: var(--lp-shadow-sm);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.problem__card:hover {
  transform: translateY(-6px);
  box-shadow: var(--lp-shadow-md);
  border-color: rgba(243, 156, 18, 0.35);
}

.problem__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  color: #d35400;
  background: linear-gradient(135deg, rgba(243, 156, 18, 0.14), rgba(230, 126, 34, 0.08));
  border: 1px solid rgba(243, 156, 18, 0.22);
  transition: transform 0.35s ease;
}

.problem__card:hover .problem__icon {
  transform: scale(1.08) rotate(-4deg);
}

.problem__card h3 {
  font-size: 17.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--lp-navy);
  margin: 20px 0 0;
}

.problem__card p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--lp-muted);
  margin: 10px 0 0;
}
</style>
