<script setup>
import { onMounted } from 'vue'
import { useSupabase } from './composable/useSupabase'
import { useAuthStore } from './composable/useAuthStore'

const { supabase } = useSupabase()
const { fetchUserProfile } = useAuthStore()

onMounted(() => {
  // Esse "espião" do Supabase dispara assim que o app carrega 
  // ou quando o usuário faz login/logout
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      // Se a pessoa atualizou a página mas ainda tem sessão, busca os dados!
      fetchUserProfile()
    }
  })
})
</script>

<template>
  <div>
    <router-view />
  </div>

</template>

<style>
@import url("https://use.typekit.net/btg3dhl.css");

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body{
  background-repeat: no-repeat;
  margin: 0;
  padding: 0px;
  box-sizing: border-box;
  font-family: "poppins", sans-serif;
  width: 100%;
  min-height: 100vh;
  background-image: radial-gradient(circle, #f1f1f1, #cecdcd);
  overflow-x: hidden;
}

</style>