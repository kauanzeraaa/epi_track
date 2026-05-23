<template>
  <div class="dashboard-page">
    <header class="page-header">
      <div class="header-text">
        <h1>Dashboard</h1>
        <p v-if="isAdmin">Visão geral de segurança e estoque.</p>
        <p v-else>Resumo das suas movimentações de segurança.</p>
      </div>

      <div class="user-profile-widget" v-if="userProfile">
        <div v-if="userProfile.foto_perfil" class="user-avatar image-avatar">
          <img :src="userProfile.foto_perfil" alt="Foto de perfil" />
        </div>
        <div v-else class="user-avatar text-avatar">
          {{ iniciaisUsuario }}
        </div>
      </div>
    </header>

    <div class="summary-cards">
      
      <div class="card" :class="isAdmin ? 'card-alerts' : 'card-active'">
        <div class="card-icon">
          <img v-if="isAdmin" src="../assets/icons_sideBar/alerta_epis.png" alt="" class="img_cards">
          <span v-else style="font-size: 28px;">👷</span>
        </div>
        <div class="card-info">
          <h3>{{ isAdmin ? 'Alertas Pendentes' : 'EPIs em Uso' }}</h3>
          <p class="card-value">{{ isAdmin ? totalAlertas : episEmUso }}</p>
        </div>
      </div>

      <div class="card" :class="isAdmin ? 'card-stock' : 'card-returned'">
        <div class="card-icon">
          <img v-if="isAdmin" src="../assets/icons_sideBar/entrega_epis.png" alt="" class="img_cards">
          <span v-else style="font-size: 28px;">✅</span>
        </div>
        <div class="card-info">
          <h3>{{ isAdmin ? 'Total no Catálogo' : 'EPIs Devolvidos' }}</h3>
          <p class="card-value">{{ isAdmin ? totalEpis : episDevolvidos }}</p>
        </div>
      </div>

      <div class="card" :class="isAdmin ? 'card-users' : 'card-history'">
        <div class="card-icon">
          <img v-if="isAdmin" src="../assets/icons_sideBar/perfil_user.png" alt="" class="img_cards">
          <span v-else style="font-size: 28px;">📄</span>
        </div>
        <div class="card-info">
          <h3>{{ isAdmin ? 'Usuários Cadastrados' : 'Total de Retiradas' }}</h3>
          <p class="card-value">{{ isAdmin ? totalUsuarios : totalMovimentacoes }}</p>
        </div>
      </div>
    </div>

    <div class="charts-layout">
      
      <div class="chart-panel">
        <h2>{{ tituloGraficoPizza }}</h2>
        <div class="canvas-wrapper">
          <canvas id="graficoPizza"></canvas>
        </div>
      </div>

      <div class="chart-panel">
        <h2>{{ tituloGraficoBarras }}</h2>
        <div class="canvas-wrapper">
          <canvas id="graficoBarras"></canvas>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { useSupabase } from '../composable/useSupabase'
import { useAuthStore } from '../composable/useAuthStore'

const { supabase } = useSupabase()
const { userProfile } = useAuthStore()

// Verifica se é Admin
const isAdmin = computed(() => userProfile.value?.perfil_acesso === 'Administrador')

// extrai as duas primeiras letras do nome do usuario logado
const iniciaisUsuario = computed(() => {
  if (!userProfile.value?.nome) return '?'
  
  // divide o nome pelos espaços
  const partesNome = userProfile.value.nome.trim().split(' ')
  
  // se tiver 2 ou mais nomes
  if (partesNome.length >= 2) {
    return (partesNome[0][0] + partesNome[1][0]).toUpperCase()
  }
  
  // se tiver só um nome
  return partesNome[0].substring(0, 2).toUpperCase()
})

// Variáveis Admin
const totalAlertas = ref(0)
const totalEpis = ref(0)
const totalUsuarios = ref(0)

// Variáveis Comum
const episEmUso = ref(0)
const episDevolvidos = ref(0)
const totalMovimentacoes = computed(() => episEmUso.value + episDevolvidos.value)

// Títulos dinâmicos dos Gráficos
const tituloGraficoPizza = computed(() => isAdmin.value ? 'Distribuição de Usuários' : 'Status dos Meus EPIs')
const tituloGraficoBarras = computed(() => isAdmin.value ? 'EPIs com Menor Estoque (Atenção)' : 'Meus Equipamentos Mais Retirados')

let chartPizza = null
let chartBarras = null

const carregarDados = async () => {
  try {
    if (!userProfile.value) return // aguarda o perfil carregar

    if (isAdmin.value) {
      await carregarDadosAdmin()
    } else {
      await carregarDadosUsuarioComum()
    }
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error)
  }
}

// lógica para usuarios adm
const carregarDadosAdmin = async () => {
  const { count: cAlertas } = await supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('status', 'Pendente')
  const { count: cEpis } = await supabase.from('epis').select('*', { count: 'exact', head: true })
  const { count: cUsers } = await supabase.from('usuarios').select('*', { count: 'exact', head: true })
  
  totalAlertas.value = cAlertas || 0
  totalEpis.value = cEpis || 0
  totalUsuarios.value = cUsers || 0

  // gráfico Pizza (Usuários)
  const { data: usersData } = await supabase.from('usuarios').select('tipo_usuario')
  const contagem = { 'Aluno': 0, 'Funcionario': 0, 'Visitante': 0 }
  usersData?.forEach(u => contagem[u.tipo_usuario]++)
  
  desenharGraficoPizza(Object.keys(contagem), Object.values(contagem), ['#27ae60', '#2c3e50', '#f39c12'])

  // gráfico Barras (Estoque)
  const { data: epiData } = await supabase.from('epis').select('nome, estoque_atual').order('estoque_atual', { ascending: true }).limit(5)
  
  desenharGraficoBarras(
    epiData?.map(i => i.nome) || [],
    epiData?.map(i => i.estoque_atual) || [],
    'Unidades em Estoque',
    '#e74c3c'
  )
}

// lógica para usuarios comum
const carregarDadosUsuarioComum = async () => {
  const userId = userProfile.value.id

  const { count: cEmUso } = await supabase.from('entrega_epis').select('*', { count: 'exact', head: true }).eq('usuario_id', userId).is('data_devolucao', null)
  const { count: cDevolvidos } = await supabase.from('entrega_epis').select('*', { count: 'exact', head: true }).eq('usuario_id', userId).not('data_devolucao', null)

  episEmUso.value = cEmUso || 0
  episDevolvidos.value = cDevolvidos || 0

  // gráfico Pizza (Status)
  desenharGraficoPizza(['Em Uso', 'Devolvidos'], [episEmUso.value, episDevolvidos.value], ['#3498db', '#95a5a6'])

  // Gráfico Barras (Mais retirados)
  const { data: movData } = await supabase.from('entrega_epis').select('epis(nome)').eq('usuario_id', userId)
  
  const contagemEpis = {}
  movData?.forEach(mov => {
    const nome = mov.epis?.nome || 'Desconhecido'
    contagemEpis[nome] = (contagemEpis[nome] || 0) + 1
  })

  // ordena para pegar os top 5
  const topEpis = Object.entries(contagemEpis).sort((a, b) => b[1] - a[1]).slice(0, 5)

  desenharGraficoBarras(
    topEpis.map(i => i[0]), 
    topEpis.map(i => i[1]), 
    'Vezes Retirado', 
    '#2ecc71'
  )
}

// motor de desenho do chart.js
const desenharGraficoPizza = (labels, valores, cores) => {
  const ctx = document.getElementById('graficoPizza').getContext('2d')
  if (chartPizza) chartPizza.destroy()

  chartPizza = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{ data: valores, backgroundColor: cores, borderWidth: 2 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  })
}

const desenharGraficoBarras = (labels, valores, labelLegenda, cor) => {
  const ctx = document.getElementById('graficoBarras').getContext('2d')
  if (chartBarras) chartBarras.destroy()

  chartBarras = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{ label: labelLegenda, data: valores, backgroundColor: cor, borderRadius: 4 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  })
}

onMounted(() => {
  // timeout para garantir que o userProfile carregou via Pinia antes de bater no banco
  setTimeout(carregarDados, 100)
})
</script>

<style scoped>

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}
.page-header h1 { font-size: 26px; font-weight: 700; color: #1a2533; margin-bottom: 6px; }
.page-header p { font-size: 14px; color: #8896a3; margin: 0; }

.user-profile-widget {
  display: flex;
  align-items: center;
}
.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  border: 2px solid #fff;
}
.image-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.text-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3498db, #2c3e50);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
}

.dashboard-page { animation: fadeIn 0.4s ease-out; }
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 26px; font-weight: 700; color: #1a2533; margin-bottom: 6px; }
.page-header p { font-size: 14px; color: #8896a3; }

/* Cards de Resumo */
.summary-cards {
  display: grid;
  /* Responsividade fluida! */
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  border: 1px solid #eef2f5;
  transition: transform 0.2s;
}
.card:hover { transform: translateY(-3px); }
.card-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  flex-shrink: 0;
}
.img_cards {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.card-alerts .card-icon {
  background: rgba(231,76,60,0.1);
}
.card-active .card-icon {
  background: rgba(52,152,219,0.1);
}
.card-returned .card-icon {
  background: rgba(149,165,166,0.1);
}
.card-history .card-icon {
  background: rgba(46,204,113,0.1);
}

.card-info {
  flex: 1; min-width: 0;
}
.card-info h3 {
  font-size: 12px;
  text-transform: uppercase;
  color: #8896a3;
  margin: 0 0 4px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-value {
  font-size: 28px;
  font-weight: 800;
  color: #1a2533;
  margin: 0;
}

/* Gráficos */
.charts-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
  gap: 24px;
}
.chart-panel {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.04);
  width: 100%;
  box-sizing: border-box;
}
.chart-panel h2 {
  font-size: 15px;
  font-weight: 700;
  color: #1a2533;
  text-align: center;
  margin-bottom: 20px;
}

.canvas-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* ajustes para mobile */
@media (max-width: 768px) {
  .summary-cards { grid-template-columns: 1fr; }
  .charts-layout { grid-template-columns: 1fr; gap: 16px; }
  .chart-panel { padding: 16px; }
  .canvas-wrapper { height: 250px; }
}
</style>