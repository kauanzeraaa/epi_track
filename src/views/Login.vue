<template>
  <HeaderTemplate />

  <section class="login-page">
    <div class="login-card">
      
      <div class="login-left">
        <img src="../assets/logo_epi_track.png" alt="EPI Track Logo" class="login-logo" />
        <h2>Sistema de Gestão de EPIs</h2>
        <p>Bem-vindo de volta! Garanta a segurança e a conformidade da sua equipe com o EPI TRACK.</p>
        
        </div>

      <div class="login-right">
        <div class="login-header">
          <h2>LOGIN</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          
          <div class="input-group">
            <span class="input-icon">✉️</span>
            <input type="email" v-model="email" placeholder="E-mail" required />
          </div>

          <div class="input-group">
            <span class="input-icon">🔒</span>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" required />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>

          <div class="forgot-password">
            <a href="#">Esqueceu a senha?</a>
          </div>

          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'ENTRANDO...' : 'ENTRAR' }}
          </button>
        </form>

        <div class="login-footer">
          <p>Não tem uma conta? <router-link to="/">Solicitar Acesso</router-link></p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import HeaderTemplate from '../components/Header.vue'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''
  // TODO: substituir pelo login do Supabase
  console.log('Tentando fazer login com:', email.value, password.value)
  isLoading.value = false
}
</script>

<style scoped>
/* --- CONTAINER PRINCIPAL --- */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 90px); /* Ocupa a tela inteira descontando o Header */
  padding: 20px;
  box-sizing: border-box;
}

/* O "Cartão" central do Login */
.login-card {
  display: flex;
  width: 100%;
  max-width: 900px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden; /* Corta as quinas de dentro para respeitar o arredondamento */
}

/* --- LADO ESQUERDO (Escuro) --- */
.login-left {
  flex: 1;
  background-color: #2C3E50;
  color: #ffffff;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.login-logo {
  width: 160px;
  margin-bottom: 30px;
  /* Se a sua logo atual tiver letras escuras, você pode precisar de uma versão com letras brancas aqui */
}

.login-left h2 {
  font-size: 24px;
  margin-bottom: 15px;
}

.login-left p {
  font-size: 15px;
  line-height: 1.5;
  opacity: 0.8;
}

/* --- LADO DIREITO (Claro/Formulário) --- */
.login-right {
  flex: 1;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 32px;
  color: #2C3E50;
  margin-bottom: 5px;
}

.login-header p {
  font-size: 14px;
  color: #666;
}

/* Formulário e Inputs */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  background-color: #F8F9FA;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 0 15px;
  transition: border-color 0.3s;
}

/* Quando o usuário clica dentro do input, a borda fica laranja */
.input-group:focus-within {
  border-color: #F39C12; 
}

.input-icon {
  font-size: 18px;
  color: #888;
  margin-right: 10px;
  opacity: 0.7;
}

.input-group input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 15px 0;
  font-size: 16px;
  color: #333;
  outline: none; /* Tira aquela borda azul padrão do navegador */
}

.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
  line-height: 1;
  color: #888;
  flex-shrink: 0;
}

.error-msg {
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  margin-top: -8px;
}

/* Links e Botão */
.forgot-password {
  text-align: right;
  font-size: 13px;
  margin-top: -5px; /* Puxa um pouquinho pra cima para ficar perto do input de senha */
}

.forgot-password a {
  color: #F39C12;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.submit-btn {
  background-color: #2C3E50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1a252f;
  transform: scale(1.02);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Rodapé com Solicitar Acesso */
.login-footer {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #666;
}

.login-footer a {
  color: #F39C12;
  font-weight: bold;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* --- RESPONSIVIDADE --- */
@media (max-width: 768px) {
  /* Em celulares, o card fica em coluna: A marca vai pra cima e o formulário pra baixo */
  .login-card {
    flex-direction: column;
    max-width: 450px;
  }

  .login-left {
    padding: 40px 20px;
  }

  .login-logo {
    width: 130px;
  }

  .login-right {
    padding: 40px 20px;
  }
}
</style>