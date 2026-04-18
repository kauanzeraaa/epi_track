<template>
  <div class="dashboard-page">
    <header class="page-header">
      <h1>Olá, Nome do Usuário!</h1>
      <p>Aqui está o resumo dos seus EPIs hoje.</p>
    </header>

    <section class="stats-grid">
      <div class="card">Total de Itens: 25</div>
    </section>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 30px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
</style>