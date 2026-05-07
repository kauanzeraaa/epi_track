<template>
  <div class="app-layout">
    <Sidebar />

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../SideBar.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f4f6f9;
}

.main-content {
  flex-grow: 1;
  margin-left: 140px;
  padding: 30px;
  min-height: 100vh;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 80px;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .main-content {
    margin-left: 56px;
    padding: 15px;
  }
}
</style>