<script setup>
import { ref } from 'vue'

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'estoque', label: 'Estoque de EPI' },
  { id: 'alertas', label: 'Alertas' },
  { id: 'historico', label: 'Histórico' },
  { id: 'relatorios', label: 'Relatórios' },
]

const activeTab = ref('dashboard')

const stockRows = [
  { item: 'Capacete Classe B', ca: 'CA 31.469', qty: 248, level: 82 },
  { item: 'Luva Nitrílica', ca: 'CA 28.011', qty: 512, level: 95 },
  { item: 'Óculos Ampla Visão', ca: 'CA 19.354', qty: 67, level: 28 },
  { item: 'Protetor Auricular', ca: 'CA 12.189', qty: 390, level: 70 },
]

const alertRows = [
  { text: 'CA 19.354 vence em 12 dias', tag: 'Validade', level: 'warn' },
  { text: 'Óculos Ampla Visão abaixo do estoque mínimo', tag: 'Estoque', level: 'danger' },
  { text: 'Troca de luvas de João Silva prevista para 18/06', tag: 'Troca', level: 'info' },
]

const historyRows = [
  { when: 'Hoje · 09:42', text: 'Entrega de Capacete Classe B para Maria Souza' },
  { when: 'Hoje · 08:15', text: 'Entrada de 120 unid. de Luva Nitrílica no estoque' },
  { when: 'Ontem · 16:30', text: 'Devolução de Óculos Ampla Visão por Pedro Lima' },
  { when: 'Ontem · 11:08', text: 'Atualização de CA do Protetor Auricular' },
]

const reportCards = [
  { title: 'Entregas por setor', value: '186', note: 'últimos 30 dias' },
  { title: 'Conformidade geral', value: '98,4%', note: 'EPIs dentro da validade' },
  { title: 'Itens críticos', value: '03', note: 'estoque abaixo do mínimo' },
]
</script>

<template>
  <section id="preview" class="preview lp-section">
    <div class="preview__glow" aria-hidden="true"></div>

    <div class="lp-container">
      <div class="lp-section-head lp-section-head--center" data-reveal>
        <span class="lp-eyebrow lp-eyebrow--dark">Por Dentro do Sistema</span>
        <h2 class="lp-title lp-title--dark">Uma interface clara para<br />decisões rápidas</h2>
        <p class="lp-subtitle lp-subtitle--dark">
          Navegue pelos módulos do EPI TRACK e veja como cada tela foi desenhada para a
          rotina de quem gerencia segurança.
        </p>
      </div>

      <div class="preview__window" data-reveal style="--d: 0.1s">
        <div class="preview__tabs" role="tablist" aria-label="Telas do sistema">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="preview__tab"
            :class="{ 'is-active': activeTab === tab.id }"
            role="tab"
            :aria-selected="activeTab === tab.id"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="preview__screen">
          <Transition name="screen" mode="out-in">
            <!-- DASHBOARD -->
            <div v-if="activeTab === 'dashboard'" key="dashboard" class="screen">
              <div class="screen__kpis">
                <div class="screen__kpi">
                  <span>EPIs em estoque</span>
                  <strong>1.248</strong>
                  <em class="is-up">+4,2% no mês</em>
                </div>
                <div class="screen__kpi">
                  <span>Entregas no mês</span>
                  <strong>186</strong>
                  <em class="is-up">+9,1% no mês</em>
                </div>
                <div class="screen__kpi">
                  <span>Alertas ativos</span>
                  <strong>07</strong>
                  <em class="is-down">3 críticos</em>
                </div>
                <div class="screen__kpi">
                  <span>Conformidade</span>
                  <strong>98,4%</strong>
                  <em class="is-up">dentro da validade</em>
                </div>
              </div>
              <div class="screen__chart">
                <span class="screen__label">Movimentações · últimos 12 meses</span>
                <div class="screen__bars">
                  <i v-for="(h, i) in [38, 52, 44, 66, 58, 74, 62, 86, 70, 80, 92, 100]" :key="i" :style="{ height: h + '%' }"></i>
                </div>
              </div>
            </div>

            <!-- ESTOQUE -->
            <div v-else-if="activeTab === 'estoque'" key="estoque" class="screen">
              <div class="screen__table">
                <div class="screen__thead">
                  <span>Equipamento</span><span>CA</span><span>Qtd.</span><span>Nível</span>
                </div>
                <div v-for="row in stockRows" :key="row.item" class="screen__tr">
                  <span class="screen__td-strong">{{ row.item }}</span>
                  <span>{{ row.ca }}</span>
                  <span>{{ row.qty }}</span>
                  <span class="screen__meter">
                    <i :style="{ width: row.level + '%' }" :class="{ 'is-low': row.level < 35 }"></i>
                  </span>
                </div>
              </div>
            </div>

            <!-- ALERTAS -->
            <div v-else-if="activeTab === 'alertas'" key="alertas" class="screen">
              <div v-for="alert in alertRows" :key="alert.text" class="screen__alert" :class="'is-' + alert.level">
                <span class="screen__alert-dot"></span>
                <p>{{ alert.text }}</p>
                <span class="screen__alert-tag">{{ alert.tag }}</span>
              </div>
            </div>

            <!-- HISTÓRICO -->
            <div v-else-if="activeTab === 'historico'" key="historico" class="screen">
              <div class="screen__timeline">
                <div v-for="event in historyRows" :key="event.text" class="screen__event">
                  <span class="screen__event-dot"></span>
                  <div>
                    <em>{{ event.when }}</em>
                    <p>{{ event.text }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- RELATÓRIOS -->
            <div v-else key="relatorios" class="screen">
              <div class="screen__reports">
                <div v-for="card in reportCards" :key="card.title" class="screen__report">
                  <span>{{ card.title }}</span>
                  <strong>{{ card.value }}</strong>
                  <em>{{ card.note }}</em>
                </div>
              </div>
              <div class="screen__export">
                <span class="screen__label">Relatório de conformidade · Junho 2026</span>
                <span class="screen__export-btn">Exportar PDF</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview {
  background: radial-gradient(110% 120% at 50% 0%, #142539 0%, #0e1b2c 55%, #0a1422 100%);
  overflow: hidden;
}

.preview__glow {
  position: absolute;
  bottom: -300px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 500px;
  border-radius: 50%;
  background: rgba(243, 156, 18, 0.07);
  filter: blur(120px);
  pointer-events: none;
}

.preview__window {
  margin-top: 60px;
  border-radius: var(--lp-radius-lg);
  background: rgba(16, 29, 46, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--lp-shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: hidden;
}

/* ---- Abas ---- */
.preview__tabs {
  display: flex;
  gap: 6px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow-x: auto;
  scrollbar-width: none;
}

.preview__tabs::-webkit-scrollbar {
  display: none;
}

.preview__tab {
  padding: 9px 18px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(238, 243, 249, 0.6);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

.preview__tab:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.preview__tab.is-active {
  color: #1d1303;
  font-weight: 600;
  background: var(--lp-grad-orange);
  box-shadow: 0 6px 18px rgba(243, 156, 18, 0.3);
}

/* ---- Tela ---- */
.preview__screen {
  padding: 28px;
  min-height: 360px;
}

.screen {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.screen-enter-active,
.screen-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.screen-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.screen-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.screen__label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(238, 243, 249, 0.6);
}

/* KPIs */
.screen__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.screen__kpi {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.screen__kpi span {
  font-size: 11.5px;
  color: rgba(238, 243, 249, 0.55);
}

.screen__kpi strong {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f4f7fb;
}

.screen__kpi em {
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
}

.screen__kpi em.is-up { color: #2ecc71; }
.screen__kpi em.is-down { color: var(--lp-orange-soft); }

/* Gráfico */
.screen__chart {
  padding: 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.screen__bars {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 150px;
  margin-top: 16px;
}

.screen__bars i {
  flex: 1;
  border-radius: 5px 5px 2px 2px;
  background: linear-gradient(180deg, rgba(243, 156, 18, 0.95), rgba(243, 156, 18, 0.18));
  transform-origin: bottom;
  animation: screen-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.screen__bars i:nth-child(odd) {
  background: linear-gradient(180deg, rgba(120, 160, 205, 0.8), rgba(120, 160, 205, 0.12));
}

@keyframes screen-grow {
  from {
    transform: scaleY(0);
  }
}

/* Tabela de estoque */
.screen__table {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.screen__thead,
.screen__tr {
  display: grid;
  grid-template-columns: 2fr 1fr 0.7fr 1.3fr;
  gap: 16px;
  align-items: center;
  padding: 14px 20px;
}

.screen__thead {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(238, 243, 249, 0.45);
  background: rgba(255, 255, 255, 0.03);
}

.screen__tr {
  font-size: 13px;
  color: rgba(238, 243, 249, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.screen__td-strong {
  font-weight: 600;
  color: #f4f7fb;
}

.screen__meter {
  position: relative;
  height: 7px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.screen__meter i {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: 99px;
  background: var(--lp-grad-orange);
}

.screen__meter i.is-low {
  background: linear-gradient(90deg, #e74c3c, #f39c12);
}

/* Alertas */
.screen__alert {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.screen__alert p {
  flex: 1;
  margin: 0;
  font-size: 14px;
  color: rgba(238, 243, 249, 0.85);
}

.screen__alert-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.screen__alert.is-warn .screen__alert-dot {
  background: var(--lp-orange);
  box-shadow: 0 0 12px rgba(243, 156, 18, 0.8);
}

.screen__alert.is-danger .screen__alert-dot {
  background: #e74c3c;
  box-shadow: 0 0 12px rgba(231, 76, 60, 0.8);
}

.screen__alert.is-info .screen__alert-dot {
  background: #5dade2;
  box-shadow: 0 0 12px rgba(93, 173, 226, 0.8);
}

.screen__alert-tag {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(238, 243, 249, 0.7);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Histórico */
.screen__timeline {
  display: flex;
  flex-direction: column;
}

.screen__event {
  position: relative;
  display: flex;
  gap: 16px;
  padding: 14px 4px;
}

.screen__event:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 8px;
  bottom: -8px;
  width: 2px;
  background: rgba(255, 255, 255, 0.08);
}

.screen__event-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
  background: rgba(243, 156, 18, 0.18);
  border: 2px solid var(--lp-orange);
}

.screen__event em {
  display: block;
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
  color: rgba(238, 243, 249, 0.45);
}

.screen__event p {
  margin: 3px 0 0;
  font-size: 14px;
  color: rgba(238, 243, 249, 0.85);
}

/* Relatórios */
.screen__reports {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.screen__report {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.screen__report span {
  font-size: 12px;
  color: rgba(238, 243, 249, 0.55);
}

.screen__report strong {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f4f7fb;
}

.screen__report em {
  font-style: normal;
  font-size: 11.5px;
  color: var(--lp-orange-soft);
}

.screen__export {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px dashed rgba(243, 156, 18, 0.4);
}

.screen__export-btn {
  padding: 9px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #1d1303;
  background: var(--lp-grad-orange);
  box-shadow: 0 6px 18px rgba(243, 156, 18, 0.3);
}

@media (max-width: 920px) {
  .screen__kpis {
    grid-template-columns: repeat(2, 1fr);
  }

  .screen__reports {
    grid-template-columns: 1fr;
  }

  .screen__thead,
  .screen__tr {
    grid-template-columns: 1.6fr 1fr 0.6fr;
  }

  .screen__thead span:last-child,
  .screen__meter {
    display: none;
  }
}

@media (max-width: 480px) {
  .preview__screen {
    padding: 18px;
  }

  .screen__kpis {
    grid-template-columns: 1fr;
  }
}
</style>
