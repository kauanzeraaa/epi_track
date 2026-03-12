<script setup lang="ts">
import router from '../router';
</script>

<template>
  <div class="header" id="header">
    <div class="logo_header">
      <img src="../assets/logo_epi_track.png" class="img_logo" alt="Logo EPI Track">
    </div>
    <nav class="navigation_header">
      <router-link to="/">Home </router-link>
      <router-link to="/resources"> Resources </router-link>
      <router-link to="/contact"> Contact </router-link>

      <button class="login_button">LOGIN</button>
    </nav>

  </div>
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

  box-shadow: 1px 1px 4px var(--color-white2);

  font-family: "poppins", sans-serif;
  font-weight: 400;
  font-style: normal;
  background-color: var(--color-white);
}

.img_logo {
  width: 100px;
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
  gap: 30px;
}

.navigation_header a {
  transition: transform 0.2s;
}

.navigation_header a:hover {
  transform: translateY(-4px);
}

.login_button{
  width: 100px;
  height: 30px;
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