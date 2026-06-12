<script setup>
const stack = ['Vue.js 3', 'Vite', 'Supabase', 'Chart.js', 'Vue Router']
</script>

<template>
  <section id="projeto" class="academic lp-section">
    <div class="lp-container">
      <div class="academic__card" data-reveal>
        <div class="academic__media">
          <img src="../../assets/fachada_senaiJV.png" alt="Fachada do SENAI Joinville Sul" loading="lazy" />
          <div class="academic__media-overlay" aria-hidden="true"></div>
          <span class="academic__media-badge">SENAI · Joinville Sul</span>
        </div>

        <div class="academic__content">
          <span class="lp-eyebrow">Projeto Acadêmico</span>
          <h2 class="academic__title">Inovação que nasce<br />na sala de aula</h2>
          <p class="academic__text">
            O EPI TRACK foi desenvolvido como <strong>projeto integrador</strong> dos alunos
            do <strong>SENAI Joinville Sul</strong>, com foco em inovação e modernização da
            gestão de EPIs nas empresas — unindo tecnologia, segurança do trabalho e boas
            práticas de engenharia de software.
          </p>

          <div class="academic__stack">
            <span class="academic__stack-label">Construído com</span>
            <div class="academic__tags">
              <span v-for="tech in stack" :key="tech" class="academic__tag">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.academic {
  background: var(--lp-ice);
}

.academic__card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  border-radius: var(--lp-radius-lg);
  background: var(--lp-white);
  border: 1px solid var(--lp-line);
  box-shadow: var(--lp-shadow-md);
  overflow: hidden;
}

.academic__media {
  position: relative;
  min-height: 340px;
}

.academic__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.academic__card:hover .academic__media img {
  transform: scale(1.04);
}

.academic__media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(200deg, rgba(44, 62, 80, 0.05) 30%, rgba(14, 27, 44, 0.55) 100%);
}

.academic__media-badge {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  background: rgba(14, 27, 44, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.academic__content {
  padding: 56px 52px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.academic__title {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--lp-navy);
  margin: 18px 0 0;
}

.academic__text {
  font-size: 15px;
  line-height: 1.75;
  color: var(--lp-muted);
  margin: 18px 0 0;
}

.academic__text strong {
  color: var(--lp-navy);
  font-weight: 600;
}

.academic__stack {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid var(--lp-line);
  width: 100%;
}

.academic__stack-label {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--lp-muted);
  margin-bottom: 14px;
}

.academic__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.academic__tag {
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--lp-navy);
  background: rgba(44, 62, 80, 0.06);
  border: 1px solid rgba(44, 62, 80, 0.12);
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.academic__tag:hover {
  transform: translateY(-2px);
  background: rgba(243, 156, 18, 0.1);
  border-color: rgba(243, 156, 18, 0.4);
}

@media (max-width: 920px) {
  .academic__card {
    grid-template-columns: 1fr;
  }

  .academic__media {
    min-height: 240px;
  }

  .academic__content {
    padding: 40px 28px;
  }
}
</style>
