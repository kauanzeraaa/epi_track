<template>
  <section class="cta lp-section">
    <div class="cta__bg" aria-hidden="true">
      <div class="cta__grid"></div>
      <div class="cta__glow"></div>
    </div>

    <div class="lp-container cta__inner" data-reveal>
      <span class="lp-eyebrow lp-eyebrow--dark">Comece Agora</span>
      <h2 class="cta__title">
        Modernize a <span class="lp-grad-text">Gestão de EPIs</span>
      </h2>
      <p class="cta__text">
        Deixe as planilhas no passado. Conheça o EPI TRACK e veja como a tecnologia
        transforma a segurança do trabalho.
      </p>
      <div class="cta__actions">
        <router-link to="/login" class="lp-btn lp-btn--primary">
          Acessar o Sistema
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </router-link>
        <router-link to="/contact" class="lp-btn lp-btn--ghost">Falar com a Equipe</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  background: radial-gradient(120% 140% at 50% 110%, #1d3147 0%, #0e1b2c 55%, #0a1422 100%);
  overflow: hidden;
  padding: 130px 0;
}

.cta__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cta__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(70% 80% at 50% 50%, #000 0%, transparent 100%);
  -webkit-mask-image: radial-gradient(70% 80% at 50% 50%, #000 0%, transparent 100%);
}

.cta__glow {
  position: absolute;
  bottom: -260px;
  left: 50%;
  transform: translateX(-50%);
  width: 760px;
  height: 480px;
  border-radius: 50%;
  background: rgba(243, 156, 18, 0.13);
  filter: blur(120px);
}

.cta__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.cta__title {
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #f4f7fb;
  margin: 24px 0 0;
}

.cta__text {
  font-size: clamp(15.5px, 1.7vw, 17.5px);
  line-height: 1.7;
  color: var(--lp-muted-dark);
  max-width: 520px;
  margin: 20px 0 0;
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}

@media (max-width: 480px) {
  .cta {
    padding: 90px 0;
  }

  .cta__actions {
    width: 100%;
  }

  .cta__actions .lp-btn {
    width: 100%;
  }
}
</style>
