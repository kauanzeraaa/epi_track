<template>
 
 <main>
  <div class="btn_voltar">
    <router-link to="/" class="voltar-link"><img src="../assets/arrow_left.png" alt="Voltar" class="voltar-icon" />Voltar</router-link>
  </div>

  <section class="login-page">
    <div class="login-card">
      
      <div class="login-left">
        <img src="../assets/dark_logo_version2.png" alt="EPI Track Logo" draggable="false" class="login-logo" />
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
            <span class="input-icon">
              <img src="../assets/iconmonstr-email.png" alt="Email Icon" draggable="false" class="custom-icon">
            </span>
            <input type="email" v-model="email" placeholder="E-mail" required />
          </div>

          <div class="input-group">
            <span class="input-icon">
              <img src="../assets/iconmonstr-lock.png" alt="Password Icon" draggable="false" class="custom-icon">
            </span>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" required />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'">
              <img v-if="!showPassword" src="../assets/show-password.png" alt="Mostrar senha" class="password-icon" draggable="false">
              <img v-else src="../assets/hide-password.png" alt="Ocultar senha" class="password-icon" draggable="false">
            </button>
          </div>

          <div class="forgot-password">
            <a href="#">Esqueceu a senha?</a>
          </div>

          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

          <button @click="handleLogin" type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'ENTRANDO...' : 'ENTRAR' }}
          </button>
        </form>

        <div class="login-footer">
          <p>Não tem uma conta? <router-link to="/">Solicitar Acesso</router-link></p>
        </div>
      </div>

    </div>
  </section>
  </main>
</template>

<script setup>

import { ref } from 'vue'
import { useSupabase } from '../composable/useSupabase'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../composable/useAuthStore'

// Pega o cliente Supabase e o Vue Router já onfigurados
const { supabase } = useSupabase()
const router = useRouter()
const { fetchUserProfile } = useAuthStore()

// Variaveis que o Vue monitora automaticamente para atualizar a interface
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = 'Credenciais Inválidas.'
    isLoading.value = false
    return
  }

  // Antes de mudar de tela, busca o perfil no banco
  await fetchUserProfile()

  router.push('/Dashboard') // Redireciona para o dashboard após login bem-sucedido
  isLoading.value = false
}

</script>

<style scoped>

main{
  overflow-x: hidden;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 90px);
  padding: 20px;
  box-sizing: border-box;
}

/* 'cartão' de Login */
.login-card {
  display: flex;
  width: 100%;
  max-width: 900px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* --- LADO ESQUERDO --- */
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
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
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

/* --- LADO DIREITO --- */
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

/* formulário e inputs */
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

/* quando o usuário clica dentro do input, a borda fica laranja */
.input-group:focus-within {
  border-color: #F39C12;
}

.custom-icon {
  display: flex;
  align-items: center;
  color: #aaa;
  margin-right: 10px;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
    opacity: 0.5;
}

.input-group input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 15px 0;
  font-size: 16px;
  color: #333;
  outline: none;
}

.toggle-password {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 2px;
  color: #aaa;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #2C3E50;
}

.password-icon {
  width: 18px;
  height: 18px;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
  opacity: 0.8;
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
  margin-top: -5px;
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

/* rodapé com 'Solicitar Acesso' */
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

.btn_voltar{
  display: flex;
  align-items: center;
  margin: 20px;
}

.voltar-icon{
  width: 20px;
  margin-right: 5px;
}

.voltar-link{
  display: flex;
  align-items: center;
  width: 100%;
}
a {
  text-decoration: none;
  color: inherit;
}

/* --- RESPONSIVIDADE --- */
@media (max-width: 768px) {
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