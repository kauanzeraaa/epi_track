<script setup>
const highlights = [
  'Controle de estoque de EPIs em tempo real',
  'Registro de entrega aos colaboradores',
  'Monitoramento de validade do CA',
  'Alertas automáticos de vencimento e estoque',
  'Histórico completo de movimentações',
  'Controle de conformidade normativa',
]
</script>

<template>
  <section id="solucao" class="solution lp-section">
    <div class="solution__glow" aria-hidden="true"></div>

    <div class="lp-container">
      <div class="lp-section-head lp-section-head--center" data-reveal>
        <span class="lp-eyebrow lp-eyebrow--dark">A Solução</span>
        <h2 class="lp-title lp-title--dark">
          Um único sistema.<br />
          <span class="lp-grad-text">Todo o ciclo de vida do EPI.</span>
        </h2>
        <p class="lp-subtitle lp-subtitle--dark">
          O EPI TRACK centraliza estoque, entregas, validade e conformidade em uma
          plataforma inteligente — do cadastro do equipamento ao relatório final.
        </p>
      </div>

      <div class="solution__bento">
        <!-- Card grande: dashboard -->
        <article class="solution__card solution__card--wide" data-reveal>
          <div class="solution__card-text">
            <h3>Dashboard gerencial</h3>
            <p>
              Visão executiva da operação em uma tela: estoque, entregas, alertas de CA e
              indicadores de conformidade, sempre atualizados.
            </p>
          </div>
          <div class="solution__mini-dash" aria-hidden="true">
            <div class="solution__mini-kpis">
              <span></span><span></span><span></span>
            </div>
            <div class="solution__mini-bars">
              <i style="height: 40%"></i><i style="height: 65%"></i><i style="height: 48%"></i>
              <i style="height: 82%"></i><i style="height: 58%"></i><i style="height: 95%"></i>
              <i style="height: 70%"></i><i style="height: 88%"></i>
            </div>
          </div>
        </article>

        <!-- Card: alertas -->
        <article class="solution__card" data-reveal style="--d: 0.1s">
          <span class="solution__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </span>
          <h3>Alertas automáticos</h3>
          <p>
            O sistema avisa antes do CA vencer e quando o estoque atinge o mínimo. Nenhum
            prazo passa despercebido.
          </p>
        </article>

        <!-- Card: relatórios -->
        <article class="solution__card" data-reveal style="--d: 0.18s">
          <span class="solution__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v17a1 1 0 0 0 1 1h17" />
              <path d="m7 14 4-4 4 3 5-6" />
            </svg>
          </span>
          <h3>Relatórios inteligentes</h3>
          <p>
            Dados de entregas, estoque e conformidade prontos para auditorias e tomadas de
            decisão — em poucos cliques.
          </p>
        </article>

        <!-- Card largo inferior: checklist -->
        <article class="solution__card solution__card--full" data-reveal style="--d: 0.12s">
          <div class="solution__checklist">
            <div v-for="item in highlights" :key="item" class="solution__check">
              <span class="solution__check-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {{ item }}
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.solution {
  background: var(--lp-grad-navy);
  overflow: hidden;
}

.solution__glow {
  position: absolute;
  top: -240px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 480px;
  border-radius: 50%;
  background: rgba(243, 156, 18, 0.08);
  filter: blur(130px);
  pointer-events: none;
}

.solution__bento {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-top: 64px;
}

.solution__card {
  position: relative;
  padding: 34px 32px;
  border-radius: var(--lp-radius-lg);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--lp-line-dark);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease,
    background 0.4s ease;
  overflow: hidden;
}

.solution__card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(420px 200px at 20% 0%, rgba(243, 156, 18, 0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.solution__card:hover {
  transform: translateY(-5px);
  border-color: rgba(243, 156, 18, 0.35);
  background: rgba(255, 255, 255, 0.055);
}

.solution__card:hover::before {
  opacity: 1;
}

.solution__card h3 {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #f4f7fb;
  margin: 0;
}

.solution__card p {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--lp-muted-dark);
  margin: 12px 0 0;
}

.solution__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  margin-bottom: 22px;
  color: var(--lp-orange-soft);
  background: rgba(243, 156, 18, 0.12);
  border: 1px solid rgba(243, 156, 18, 0.28);
  box-shadow: 0 8px 24px rgba(243, 156, 18, 0.12);
}

/* Card largo com mini-dashboard */
.solution__card--wide {
  grid-column: span 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 40px;
}

.solution__mini-dash {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: var(--lp-radius);
  background: rgba(10, 20, 34, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.solution__mini-kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.solution__mini-kpis span {
  height: 42px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.solution__mini-kpis span:first-child {
  background: rgba(243, 156, 18, 0.16);
  border-color: rgba(243, 156, 18, 0.35);
}

.solution__mini-bars {
  display: flex;
  align-items: flex-end;
  gap: 9px;
  height: 96px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.solution__mini-bars i {
  flex: 1;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(180deg, rgba(243, 156, 18, 0.9), rgba(243, 156, 18, 0.2));
}

/* Card checklist */
.solution__card--full {
  grid-column: span 2;
}

.solution__checklist {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px 32px;
}

.solution__check {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14.5px;
  font-weight: 500;
  color: rgba(238, 243, 249, 0.88);
}

.solution__check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  color: #1d1303;
  background: var(--lp-grad-orange);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.35);
}

@media (max-width: 920px) {
  .solution__bento {
    grid-template-columns: 1fr;
  }

  .solution__card--wide,
  .solution__card--full {
    grid-column: span 1;
  }

  .solution__card--wide {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .solution__checklist {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
