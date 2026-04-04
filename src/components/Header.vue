<script setup lang="ts">
import router from '../router';
import { ref } from 'vue';

// Variável reativa para controlar o estado do menu (aberto/fechado)
const isMenuOpen = ref(false);

// Função que inverte o estado (se tá aberto, fecha; se tá fechado, abre)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Função para fechar o menu ao clicar em um link
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header class="header">
    <div class="logo_header">
      <img src="../assets/logo_epi_track.png" class="img_logo" alt="Logo EPI Track">
    </div>

    <button class="hamburger_btn" @click="toggleMenu" aria-label="Abrir menu">
      <span class="bar" :class="{ 'open': isMenuOpen }"></span>
      <span class="bar" :class="{ 'open': isMenuOpen }"></span>
      <span class="bar" :class="{ 'open': isMenuOpen }"></span>
    </button>

    <div class="menu_items" :class="{ 'menu_open': isMenuOpen }">
      <nav class="navigation_header">
        <router-link class="link" to="/" @click="closeMenu">Home</router-link>
        <router-link class="link" to="/resources" @click="closeMenu">Resources</router-link>
        <router-link class="link" to="/contact" @click="closeMenu">Contact</router-link>
      </nav>
      
      <div class="header_login">
        <router-link class="login_button" to="/login" @click="closeMenu">LOGIN</router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url("https://use.typekit.net/btg3dhl.css");

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 40px;
  justify-content: space-between;
  box-shadow: 1px 1px 4px var(--color-white2);

  font-family: "poppins", sans-serif;
  font-weight: 400;
  font-style: normal;
  background-color: #FFFFFF10;

  z-index: 9999;
}

.img_logo { width: 110px; }

.hamburger_btn {
  display: none;
}

.menu_items {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

.navigation_header {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
}.navigation_header a {
  transition: transform 0.2s;
}.navigation_header a:hover {
  transform: translateY(-4px);
}

.link{
  position: relative;
}
.link::after{
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translate(-50%);
  width: 0;
  height: 2px;
  background-color: var(--color-blue);
  border-radius: 2px;
  transition: width 0.3s ease;
}
.link.router-link-exact-active::after{
  width: 100%;
}

.login_button{
  width: 100px;
  height: 35px;
  color: white;
  background-color: #2C3E50;
  border-radius: 8px;
  font-size: 18px;
  border-style: none;
  cursor: pointer;
}
.login_button:hover{
  transform: scale(1.03);
}

/* --- RESPONSIVIDADE DA HEADER --- */

/* Telas até 1024px */
@media (max-width: 1024px) {
  .header {
    padding: 15px 20px;
  }

  .menu_items {
    gap: 40px;
  }

  .navigation_header {
    position: static;
    transform: none;
    gap: 20px;
  }
}

/* Telas até 768px */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    padding: 20px 15px;
  }

  /* Estiliza e mostra as 3 barrinhas */
  .hamburger_btn {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 1001;
  }

  .bar {
    width: 28px;
    height: 3px;
    background-color: #2C3E50;
    border-radius: 3px;
    transition: all 0.3s ease-in-out;
  }

  /* Transforma o sanduíche em um "X" */
  .bar.open:nth-child(1) { transform: translateY(8px) rotate(45deg); }
  .bar.open:nth-child(2) { opacity: 0; }
  .bar.open:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

  /* Esconde os links por padrão com um efeito de "gaveta" que desce */
  .menu_items {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #cecdcd;
    flex-direction: column;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out, padding 0.3s ease;
    box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
    z-index: 9998;
  }

  .menu_items.menu_open {
    max-height: 350px;
    padding: 20px 0;
  }

  .navigation_header {
    position: static;
    transform: none;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
}

/* Telas até 480px */
@media (max-width: 480px) {
  .navigation_header {
    gap: 15px;
    font-size: 14px;
  }
}
</style>