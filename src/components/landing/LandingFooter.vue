<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="lp-container">
      <div class="footer__top">
        <div class="footer__brand">
          <img src="../../assets/logo_white.png" alt="EPI TRACK" class="footer__logo" />
          <p>
            Sistema de Gestão e Controle de Equipamentos de Proteção Individual.
            Projeto integrador · SENAI Joinville Sul.
          </p>
        </div>

        <nav class="footer__col" aria-label="Produto">
          <h4>Produto</h4>
          <a href="#solucao">Solução</a>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#como-funciona">Como Funciona</a>
          <a href="#preview">Por Dentro do Sistema</a>
        </nav>

        <nav class="footer__col" aria-label="Projeto">
          <h4>Projeto</h4>
          <a href="#projeto">Sobre o Projeto</a>
          <router-link to="/resources">Recursos</router-link>
          <router-link to="/contact">Contato</router-link>
        </nav>

        <nav class="footer__col" aria-label="Acesso">
          <h4>Acesso</h4>
          <router-link to="/login">Entrar</router-link>
        </nav>
      </div>

      <div class="footer__bottom">
        <span>© {{ year }} EPI TRACK · SENAI Joinville Sul</span>
        <span class="footer__made">Feito com <span class="footer__heart">♥</span> por alunos do SENAI</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--lp-navy-950);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 72px 0 0;
}

.footer__top {
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: 48px;
  padding-bottom: 56px;
}

.footer__logo {
  height: 34px;
  width: auto;
}

.footer__brand p {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--lp-muted-dark);
  max-width: 300px;
  margin: 18px 0 0;
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__col h4 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(238, 243, 249, 0.5);
  margin: 0 0 6px;
}

.footer__col a {
  font-size: 14px;
  color: rgba(238, 243, 249, 0.72);
  text-decoration: none;
  width: fit-content;
  transition: color 0.25s ease, transform 0.25s ease;
}

.footer__col a:hover {
  color: var(--lp-orange-soft);
  transform: translateX(3px);
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12.5px;
  color: rgba(238, 243, 249, 0.45);
}

.footer__heart {
  color: var(--lp-orange);
}

@media (max-width: 920px) {
  .footer__top {
    grid-template-columns: 1fr 1fr;
  }

  .footer__brand {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .footer__top {
    grid-template-columns: 1fr;
  }

  .footer__brand {
    grid-column: span 1;
  }

  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
