<script setup lang="ts">
import router from '../router';
</script>

<template>
  <div class="header" id="header">
    <div class="logo_header">
      <img src="../assets/logo_epi_track.png" clas="img_logo" alt="Logo EPI Track">
    </div>
    <nav class="navigation_header">
      <router-link to="/">Home </router-link>
      <router-link to="/resources"> Resources </router-link>
      <router-link to="/contact"> Contact </router-link>
    </nav>
  </div>
</template>