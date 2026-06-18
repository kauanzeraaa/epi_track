<script setup>

import imgDashboardHero from '../../assets/prints/print-dashboard.png'

</script>

<template>
  <section class="hero">
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__grid"></div>
      <div class="hero__glow hero__glow--orange"></div>
      <div class="hero__glow hero__glow--blue"></div>
      <div class="hero__orb hero__orb--1"></div>
      <div class="hero__orb hero__orb--2"></div>
    </div>

    <div class="lp-container hero__inner">
      <div class="hero__content">
        <div class="hero__badge">
          <span class="hero__badge-dot"></span>
          Projeto Integrador · SENAI Joinville Sul
        </div>

        <h1 class="hero__title">
          Gestão Inteligente de EPIs para uma
          <span class="lp-grad-text">Indústria Mais Segura</span>
        </h1>

        <p class="hero__subtitle">
          Automatize o controle de Equipamentos de Proteção Individual, reduza falhas
          operacionais e tenha total rastreabilidade de entregas, validade e conformidade.
        </p>

        <div class="hero__ctas">
          <a href="#preview" class="lp-btn lp-btn--primary">
            Ver Projeto
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href="#funcionalidades" class="lp-btn lp-btn--ghost">Explorar Funcionalidades</a>
        </div>

        <div class="hero__stats">
          <div class="hero__stat">
            <strong>100%</strong>
            <span>Rastreabilidade de entregas</span>
          </div>
          <div class="hero__stat">
            <strong>24/7</strong>
            <span>Monitoramento de validade</span>
          </div>
          <div class="hero__stat">
            <strong>Zero</strong>
            <span>Planilhas e papel</span>
          </div>
        </div>
      </div>

      <div class="hero__visual">
        <div class="mockup-image-wrapper">
          <img 
            :src="imgDashboardHero" 
            alt="Dashboard Real do EPI TRACK" 
            class="mockup-image"
          />
        </div>

        <div class="float-card float-card--alert">
          <span class="float-card__icon float-card__icon--amber">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </span>
          <div>
            <strong>CA 29.123 vence em 12 dias</strong>
            <span>Alerta automático enviado</span>
          </div>
        </div>

        <div class="float-card float-card--ok">
          <span class="float-card__icon float-card__icon--green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div>
            <strong>Entrega registrada</strong>
            <span>Capacete Classe B · João S.</span>
          </div>
        </div>
      </div>
    </div>

    <a href="#problema" class="hero__scroll" aria-label="Rolar para a próxima seção">
      <span></span>
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: radial-gradient(120% 120% at 70% 0%, #16283e 0%, #0e1b2c 45%, #0a1422 100%);
  overflow: hidden;
  padding: 150px 0 110px;
}

.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(75% 60% at 50% 30%, #000 0%, transparent 100%);
  -webkit-mask-image: radial-gradient(75% 60% at 50% 30%, #000 0%, transparent 100%);
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}

.hero__glow--orange {
  width: 560px;
  height: 560px;
  top: -180px;
  right: -120px;
  background: rgba(243, 156, 18, 0.16);
}

.hero__glow--blue {
  width: 640px;
  height: 640px;
  bottom: -260px;
  left: -200px;
  background: rgba(52, 100, 160, 0.2);
}

.hero__orb {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hero__orb--1 {
  width: 420px;
  height: 420px;
  top: 8%;
  right: 4%;
  animation: lp-spin 60s linear infinite;
}

.hero__orb--1::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--lp-orange);
  box-shadow: 0 0 18px rgba(243, 156, 18, 0.9);
}

.hero__orb--2 {
  width: 680px;
  height: 680px;
  top: -2%;
  right: -8%;
}

@keyframes lp-spin {
  to { transform: rotate(360deg); }
}

.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  align-items: center;
  gap: 64px;
}

.hero__content > * {
  opacity: 0;
  animation: lp-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.hero__content > *:nth-child(1) { animation-delay: 0.05s; }
.hero__content > *:nth-child(2) { animation-delay: 0.15s; }
.hero__content > *:nth-child(3) { animation-delay: 0.28s; }
.hero__content > *:nth-child(4) { animation-delay: 0.4s; }
.hero__content > *:nth-child(5) { animation-delay: 0.52s; }

@keyframes lp-rise {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: none; }
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: rgba(238, 243, 249, 0.85);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.hero__badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--lp-orange);
  box-shadow: 0 0 0 0 rgba(243, 156, 18, 0.6);
  animation: lp-pulse 2.2s ease-out infinite;
}

@keyframes lp-pulse {
  70% { box-shadow: 0 0 0 9px rgba(243, 156, 18, 0); }
  100% { box-shadow: 0 0 0 0 rgba(243, 156, 18, 0); }
}

.hero__title {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: #f4f7fb;
  margin: 26px 0 0;
}

.hero__subtitle {
  font-size: clamp(15.5px, 1.7vw, 18px);
  line-height: 1.7;
  color: var(--lp-muted-dark);
  max-width: 540px;
  margin: 22px 0 0;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 36px;
}

.hero__stats {
  display: flex;
  gap: 40px;
  margin-top: 52px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero__stat strong {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f4f7fb;
}

.hero__stat span {
  font-size: 12.5px;
  color: var(--lp-muted-dark);
}

/* Real Image Wrapper Styles */
.hero__visual {
  position: relative;
  opacity: 0;
  animation: lp-rise 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
  z-index: 10;
}

.mockup-image-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  
  /* 3D Perspective Effect */
  transform: perspective(1400px) rotateX(4deg) rotateY(-6deg);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero__visual:hover .mockup-image-wrapper {
  transform: perspective(1400px) rotateX(0deg) rotateY(0deg);
}

.mockup-image {
  width: 100%;
  height: auto;
  display: block;
}

/* Cards flutuantes */
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px;
  border-radius: 14px;
  background: rgba(20, 35, 54, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 50px rgba(5, 12, 22, 0.5);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  animation: lp-float 6s ease-in-out infinite;
  z-index: 20; /* Ensure they stay above the image */
}

.float-card strong {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #f4f7fb;
}

.float-card span:not(.float-card__icon) {
  font-size: 10.5px;
  color: var(--lp-muted-dark);
}

.float-card--alert {
  top: -26px;
  right: -18px;
}

.float-card--ok {
  bottom: -24px;
  left: -28px;
  animation-delay: 1.6s;
}

.float-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
}

.float-card__icon--amber {
  color: var(--lp-orange);
  background: rgba(243, 156, 18, 0.14);
  border: 1px solid rgba(243, 156, 18, 0.3);
}

.float-card__icon--green {
  color: #2ecc71;
  background: rgba(46, 204, 113, 0.12);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

@keyframes lp-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* Indicador de scroll */
.hero__scroll {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 42px;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.hero__scroll span {
  width: 3px;
  height: 8px;
  border-radius: 3px;
  background: var(--lp-orange);
  animation: lp-scroll-hint 1.8s ease-in-out infinite;
}

@keyframes lp-scroll-hint {
  0%, 100% { transform: translateY(0); opacity: 1; }
  60% { transform: translateY(12px); opacity: 0.2; }
}

/* Responsivo */
@media (max-width: 1024px) {
  .hero__inner { gap: 40px; }
  .hero__stats { gap: 28px; }
}

@media (max-width: 920px) {
  .hero { padding: 130px 0 90px; min-height: auto; }
  .hero__inner { grid-template-columns: 1fr; gap: 72px; }
  .hero__visual { max-width: 560px; margin-inline: auto; width: 100%; }
  
  /* Remove the 3D effect on smaller screens for better visibility */
  .mockup-image-wrapper { transform: none; }
  .hero__visual:hover .mockup-image-wrapper { transform: none; }
  
  .float-card--alert { right: -6px; }
  .float-card--ok { left: -6px; }
  .hero__scroll { display: none; }
}

@media (max-width: 480px) {
  .hero__stats { flex-direction: column; gap: 18px; }
  .hero__ctas .lp-btn { width: 100%; }
  .float-card { padding: 10px 14px; }
  .float-card--alert { top: -18px; }
}
</style>