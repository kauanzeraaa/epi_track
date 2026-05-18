<template>
  <div class="reset-page">
    <div class="reset-card">
      <h2>Criar Nova Senha</h2>
      <p>Digite sua nova senha de acesso abaixo.</p>

      <form @submit.prevent="salvarNovaSenha">
        <div class="input-group">
          <label>Nova Senha</label>
          <input v-model="novaSenha" type="password" required />
        </div>
        
        <div class="input-group">
          <label>Confirmar Nova Senha</label>
          <input v-model="confirmarSenha" type="password" required />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : 'Salvar Senha' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabase } from '../composable/useSupabase'

const { supabase } = useSupabase()
const router = useRouter()

const novaSenha = ref('')
const confirmarSenha = ref('')
const isLoading = ref(false)

const salvarNovaSenha = async () => {
  if (novaSenha.value !== confirmarSenha.value) {
    alert('As senhas não conferem!')
    return
  }
  
  if (novaSenha.value.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.')
    return
  }

  isLoading.value = true

  try {
    // quando o usuário clica no link do e-mail, o Supabase já autentica na sessão atual
    // updateUser() atualiza a senha de quem acabou de clicar no link
    const { error } = await supabase.auth.updateUser({
      password: novaSenha.value
    })

    if (error) throw error

    alert('Senha atualizada com sucesso! Você já pode acessar o sistema.')
    router.push('/dashboard')
    
  } catch (error) {
    alert('Erro ao salvar senha: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Adicione aqui o seu CSS padrão (pode copiar o estilo da div do seu Login) */
.reset-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f0f4f8;
}

.reset-card {
    background: #fff;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    width: 100%;
    max-width: 400px;
}

.input-group {
    margin-bottom: 16px;
}

.input-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 13px;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
}

.btn-primary {
    width: 100%; padding: 12px;
    background: #2C3E50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

</style>