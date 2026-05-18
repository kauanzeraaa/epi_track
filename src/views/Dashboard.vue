<template>
  <div class="dashboard-page">
    <header class="page-header">
      <div class="header-text">
        <h1>Dashboard</h1>
        <p>Visão geral de segurança e estoque.</p>
      </div>
    </header>

    <div class="summary-cards">
      <div class="card card-alerts">
        <div class="card-icon"><img src="../assets/icons_sideBar/alerta_epis.png" alt="" class="img_cards"></div>
        <div class="card-info">
          <h3>Alertas Pendentes</h3>
          <p class="card-value">{{ totalAlertas }}</p>
        </div>
      </div>
      <div class="card card-stock">
        <div class="card-icon"><img src="../assets/icons_sideBar/entrega_epis.png" alt="" class="img_cards"></div>
        <div class="card-info">
          <h3>Total de EPIs no Catálogo</h3>
          <p class="card-value">{{ totalEpis }}</p>
        </div>
      </div>
      <div class="card card-users">
        <div class="card-icon"><img src="../assets/icons_sideBar/perfil_user.png" alt="" class="img_cards"></div>
        <div class="card-info">
          <h3>Usuários Cadastrados</h3>
          <p class="card-value">{{ totalUsuarios }}</p>
        </div>
      </div>
    </div>

    <div class="charts-layout">
      
      <div class="chart-panel">
        <h2>Distribuição de Usuários</h2>
        <div class="canvas-wrapper">
          <canvas id="graficoUsuarios"></canvas>
        </div>
      </div>

      <div class="chart-panel">
        <h2>EPIs com Menor Estoque (Atenção)</h2>
        <div class="canvas-wrapper">
          <canvas id="graficoEstoque"></canvas>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { useSupabase } from '../composable/useSupabase'

const { supabase } = useSupabase()

// variáveis para os cards
const totalAlertas = ref(0)
const totalEpis = ref(0)
const totalUsuarios = ref(0)

// Referências para destruir os gráficos antigos antes de atualizar
let chartUsuarios = null
let chartEstoque = null

const carregarDados = async () => {
  try {
    // busca contagens rápidas para os Cards
    const { count: countAlertas } = await supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('status', 'Pendente')
    const { count: countEpis } = await supabase.from('epis').select('*', { count: 'exact', head: true })
    const { count: countUsers } = await supabase.from('usuarios').select('*', { count: 'exact', head: true })
    
    totalAlertas.value = countAlertas || 0
    totalEpis.value = countEpis || 0
    totalUsuarios.value = countUsers || 0

    // monta o Gráfico de Pizza (Usuários)
    await renderizarGraficoUsuarios()

    // monta o Gráfico de Barras (Estoque Crítico)
    await renderizarGraficoEstoque()

  } catch (error) {
    console.error("Erro ao carregar dashboard:", error)
  }
}

const renderizarGraficoUsuarios = async () => {
  // busca os dados
  const { data } = await supabase.from('usuarios').select('tipo_usuario')
  
  if (!data) return

  // agrupa e conta quantos de cada tipo existem
  const contagem = { 'Aluno': 0, 'Funcionario': 0, 'Visitante': 0 }
  data.forEach(user => {
    if (contagem[user.tipo_usuario] !== undefined) {
      contagem[user.tipo_usuario]++
    }
  })

  // transforma em arrays simples, como ensinado no material
  const labels = Object.keys(contagem)
  const valores = Object.values(contagem)

  const ctx = document.getElementById('graficoUsuarios').getContext('2d')
  
  // limpa antes de redesenhar
  if (chartUsuarios) chartUsuarios.destroy()

  chartUsuarios = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade',
        data: valores,
        backgroundColor: ['#27ae60', '#2c3e50', '#f39c12'],
        borderWidth: 2
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

const renderizarGraficoEstoque = async () => {
  // busca os 5 EPIs com o menor estoque atual
  const { data } = await supabase
    .from('epis')
    .select('nome, estoque_atual')
    .order('estoque_atual', { ascending: true })
    .limit(5)

  if (!data) return

  // separa os nomes e os valores
  const nomesEpi = data.map(item => item.nome)
  const quantidades = data.map(item => item.estoque_atual)

  const ctx = document.getElementById('graficoEstoque').getContext('2d')
  
  if (chartEstoque) chartEstoque.destroy()

  chartEstoque = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nomesEpi,
      datasets: [{
        label: 'Unidades em Estoque',
        data: quantidades,
        backgroundColor: '#3B82F6', // azul claro, conforme documentação
        borderColor: '#1E40AF',
        borderWidth: 1
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } }
    }
  })
}

onMounted(() => {
  carregarDados()
  
  // usar setInterval atualiza a tela a cada 10 segundos
  // setInterval(carregarDados, 10000)
})
</script>

<style scoped>
.dashboard-page { animation: fadeIn 0.4s ease-out; }
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 26px; font-weight: 700; color: #1a2533; margin-bottom: 6px; }
.page-header p { font-size: 14px; color: #8896a3; }

/* Cards de Resumo */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  border: 1px solid #eef2f5;
  transition: transform 0.2s;
}
.card:hover { transform: translateY(-3px); }
.card-icon {
  font-size: 32px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
}

.img_cards{
  width: 50px;

}

.card-info h3 { font-size: 12px; text-transform: uppercase; color: #8896a3; margin: 0 0 4px; font-weight: 700; }
.card-value { font-size: 28px; font-weight: 800; color: #1a2533; margin: 0; }

/* Gráficos */
.charts-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}
.chart-panel {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.04);
}
.chart-panel h2 {
  font-size: 16px;
  font-weight: 700;
  color: #1a2533;
  text-align: center;
  margin-bottom: 20px;
}

/* corrige o erro de distorção que a professora disse na documentacao */
.canvas-wrapper {
  position: relative;
  height: 300px; /* defin limite de altura para não quebrar a tela */
  width: 100%;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .charts-layout { grid-template-columns: 1fr; }
}
</style>