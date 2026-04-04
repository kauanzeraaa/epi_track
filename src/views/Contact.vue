<template>
  <HeaderTemplate />

  <main class="contact-container">
    <section class="top-section">
      <h1 class="page-title">Contato Senai Joinville</h1>
      <div class="image-wrapper">
        <img src="../assets/fachada_senaiJV.png" alt="Fachada do Senai Joinville" class="senai-img" />
      </div>
    </section>

    <section class="info-section">
      
      <div class="left-column">
        <h2>Sobre o Senai SC - Joinville</h2>
        <p class="description">
          Os <strong>Institutos SENAI de Inovação e Tecnologia</strong> estão preparados para <strong>transformar desafios em soluções</strong>, impulsionando resultados, otimizando processos e acelerando a competitividade da sua empresa.
        </p>
        
        <div class="services-card">
          <div class="card-column line-right">
            <h3 class="orange-text">
              <span class="icon">👤</span> Para Você
            </h3>
            <div class="card-item">
              <h4>Formação Educacional</h4>
              <p>Formação para quem quer construir uma formação na indústria</p>
            </div>
            <div class="card-item">
              <h4>Ensino Superior</h4>
              <p>Formação superior voltada para qualificar profissionais na indústria</p>
            </div>
          </div>

          <div class="card-column">
            <h3 class="orange-text">
              <span class="icon">🏢</span> Para Empresas
            </h3>
            <div class="card-item">
              <h4>Formação Corporativa</h4>
              <p>Capacitações para melhorar a produtividade da sua empresa</p>
            </div>
            <div class="card-item">
              <h4>Inovação e Tecnologia</h4>
              <p>PD&I, consultoria e metrologia para uma indústria mais competitiva</p>
            </div>
          </div>
        </div>
      </div>

      <div class="right-column">
        <h2>Fale com o SENAI Joinville</h2>
        <p class="description">
          Deseja implementar o <strong>EPI TRACK</strong> na sua empresa ou conhecer mais sobre os nossos cursos e consultorias? Entre em contato conosco!
        </p>

        <div class="contact-info-list">
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <div>
              <strong>Endereço (Unidade Norte):</strong>
              <p>Rua Arno Waldemar Dohler, 957<br>Zona Industrial Norte, Joinville - SC, 89219-510</p>
            </div>
          </div>

          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <div>
              <strong>Telefone Central:</strong>
              <p>(47) 3441-7700</p>
            </div>
          </div>

          <div class="contact-item">
            <span class="contact-icon">💬</span>
            <div>
              <strong>Atendimento FIESC/SENAI:</strong>
              <p>0800 048 1212</p>
            </div>
          </div>

          <div class="contact-item">
            <span class="contact-icon">🕒</span>
            <div>
              <strong>Horário de Atendimento:</strong>
              <p>Segunda a Sexta-feira, das 08h às 22h</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  </main>

  <footer class="footer">
    <div class="footer-content">
      <p class="email">piacentekauan@gmail.com</p>
      <div class="social-icons">
        <a href="mailto:piacentekauan@exemplo.com" class="social-link" title="Enviar E-mail">
          <img src="../assets/img_email.png" alt="Ícone de E-mail">
        </a>
        
        <a href="https://www.linkedin.com/in/kauanmpiacente/" target="_blank" rel="noopener noreferrer" class="social-link" title="Acessar LinkedIn">
          <img src="../assets/img_linkedin.png" alt="Ícone do LinkedIn">
        </a>
        
        <a href="https://github.com/kauanzeraaa" target="_blank" rel="noopener noreferrer" class="social-link" title="Acessar GitHub">
          <img src="../assets/img_github.png" alt="Ícone do GitHub">
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>Copyright © 2026 | EPI-TRACKER</p>
    </div>
  </footer>
</template>

<script>
import HeaderTemplate from '../components/Header.vue'

export default {
  name: "Contact",
  components: {
    HeaderTemplate
  }
}
</script>

<style scoped>
/* --- CONTAINER PRINCIPAL --- */
.contact-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

/* --- SEÇÃO DO TOPO (Título e Imagem) --- */
.top-section {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 36px;
  color: #000;
  margin-bottom: 30px;
}

.image-wrapper {
  width: 250px;
  height: 250px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.senai-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- SEÇÃO DE INFORMAÇÕES (Colunas) --- */
.info-section {
  display: flex;
  gap: 60px;
  width: 100%;
  justify-content: space-between;
}

.left-column, .right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
  font-size: 24px;
  color: #000;
}

.description {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

/* --- CARD BRANCO DE SERVIÇOS --- */
.services-card {
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
}

.contact-info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 15px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background-color: #FFFFFF;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); 
}

.contact-icon {
  font-size: 24px; /* Tamanho do emoji/ícone */
  background-color: #F8F9FA;
  padding: 10px;
  border-radius: 8px;
}

.contact-item strong {
  font-size: 14px;
  color: #2C3E50;
  display: block;
  margin-bottom: 4px;
}

.contact-item p {
  font-size: 13px;
  color: #555;
  margin: 0;
  line-height: 1.4;
}

.card-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.line-right {
  border-right: 1px solid #E0E0E0;
  padding-right: 20px;
}

.orange-text {
  color: #F39C12; /* Ajuste para o tom de laranja do seu projeto */
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-item h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.card-item p {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* --- RODAPÉ (FOOTER) --- */
.footer {
  width: 100%;
  background-color: #2C3E50;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 10px;
  margin-top: 60px; /* Empurra o footer para baixo */
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.email {
  font-size: 14px;
  opacity: 0.9;
}

.social-icons {
  display: flex;
  gap: 20px;
  font-size: 24px;
  color: #F39C12;
  cursor: pointer;
  align-items: center;
}

.social-link {
  display: inline-block;
  transition: transform 0.2s ease-in-out;
}
.social-link:hover {
  transform: scale(1.1);
}

.social-link img {
  width: 25px;
  height: 32px;
  object-fit: contain;
  display: block;
}

.social-placeholder {
  transition: transform 0.2s;
}

.social-placeholder:hover {
  transform: scale(1.1);
}

.footer-bottom {
  font-size: 12px;
  opacity: 0.7;
}

/* --- RESPONSIVIDADE --- */
@media (max-width: 900px) {
  .info-section {
    flex-direction: column; /* Empilha as colunas principal */
    gap: 40px;
  }
}

@media (max-width: 600px) {
  .services-card {
    flex-direction: column; /* Empilha as colunas de dentro do card branco */
  }

  .line-right {
    border-right: none;
    border-bottom: 1px solid #E0E0E0;
    padding-right: 0;
    padding-bottom: 20px;
  }

  .page-title {
    font-size: 28px;
  }
}
</style>