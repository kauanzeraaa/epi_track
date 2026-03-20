<script setup lang="ts">
import router from '../router';
</script>

<template>
  <header class="header">
    <div class="logo_header">
      <img src="../assets/logo_epi_track.png" class="img_logo" alt="Logo EPI Track">
    </div>
    <nav class="navigation_header">
      <router-link class="link" to="/">Home </router-link>
      <router-link class="link" to="/resources"> Resources </router-link>
      <router-link class="link" to="/contact"> Contact </router-link>
    </nav>
    <div class="header_login">
      <button class="login_button">LOGIN</button>
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
}

.img_logo { width: 110px; }

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
</style>