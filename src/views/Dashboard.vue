<template>
  <div class="dashboard-page">

    <header class="page-header">
      <div class="header-text">
        <p class="header-date">{{ currentDate }}</p>
        <h1>Olá, {{ firstName }}!</h1>
        <p class="header-subtitle" v-if="isAdmin">Aqui está o panorama geral do almoxarifado hoje.</p>
        <p class="header-subtitle" v-else>Aqui está o resumo dos seus equipamentos de proteção.</p>
      </div>

      <div class="header-avatar">
        <img v-if="userProfile?.foto_perfil" :src="userProfile.foto_perfil" alt="Foto de Perfil" />
        <div v-else class="avatar-initials">{{ userInitials }}</div>
        <span class="avatar-badge online"></span>
      </div>
    </header>

    <!-- ADMIN -->
    <template v-if="isAdmin">

      <section class="stats-grid">

        <div class="stat-card">
          <div class="stat-accent blue"></div>
          <div class="stat-body">
            <div class="stat-top">
              <div class="stat-icon blue"><img src="../assets/cards/inventory.png" alt="Estoque" /></div>
              <span class="stat-chip neutral">Itens</span>
            </div>
            <p class="stat-value">{{ totalItens }}</p>
            <p class="stat-label">Total em Estoque</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent orange"></div>
          <div class="stat-body">
            <div class="stat-top">
              <div class="stat-icon orange"><img src="../assets/cards/alert.png" alt="Alerta" /></div>
              <span class="stat-chip warning">Atenção</span>
            </div>
            <p class="stat-value">{{ estoqueBaixo }}</p>
            <p class="stat-label">Estoque Baixo</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent red"></div>
          <div class="stat-body">
            <div class="stat-top">
              <div class="stat-icon red"><img src="../assets/cards/check-shield.png" alt="CA" /></div>
              <span class="stat-chip danger">Urgente</span>
            </div>
            <p class="stat-value">{{ caVencendo }}</p>
            <p class="stat-label">CA Vencendo</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent green"></div>
          <div class="stat-body">
            <div class="stat-top">
              <div class="stat-icon green"><img src="../assets/cards/deliver.png" alt="Entregas" /></div>
              <span class="stat-chip positive">Hoje</span>
            </div>
            <p class="stat-value">{{  entregasHoje }}</p>
            <p class="stat-label">Entregas Realizadas Hoje</p>
          </div>
        </div>

      </section>

      <div class="content-card">
        <div class="card-header">
          <div class="card-header-left">
            <img src="../assets/cards/file-report.png" alt="" class="card-header-icon" />
            <h3>Últimas Movimentações</h3>
          </div>
          <button class="btn-link">Ver todas →</button>
        </div>
        <div class="empty-state">
          <img src="../assets/cards/deliver.png" alt="" class="empty-icon" />
          <p>Nenhuma movimentação registrada.</p>
          <span>Entregas e devoluções aparecerão aqui.</span>
        </div>
      </div>

    </template>

    <!-- FUNCIONÁRIO -->
    <template v-else>

      <section class="stats-grid">

        <div class="stat-card">
          <div class="stat-accent green"></div>
          <div class="stat-body">
            <div class="stat-top">
              <div class="stat-icon green"><img src="../assets/cards/check-shield.png" alt="EPIs" /></div>
              <span class="stat-chip positive">Ativo</span>
            </div>
            <p class="stat-value">{{ meusEpisAtivos }}</p>
            <p class="stat-label">Meus EPIs Ativos</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent orange"></div>
          <div class="stat-body">
            <div class="stat-top">
              <div class="stat-icon orange"><img src="../assets/cards/alert.png" alt="Trocas" /></div>
              <span class="stat-chip warning">Atenção</span>
            </div>
            <p class="stat-value">{{ trocasProximas }}</p>
            <p class="stat-label">Trocas Próximas</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent blue"></div>
          <div class="stat-body">
            <div class="stat-top">
              <div class="stat-icon blue"><img src="../assets/cards/economy.png" alt="Conformidade" /></div>
              <span class="stat-chip positive">OK</span>
            </div>
            <p class="stat-value">100%</p>
            <p class="stat-label">Conformidade NR-6</p>
          </div>
        </div>

      </section>

      <div class="content-card">
        <div class="card-header">
          <div class="card-header-left">
            <img src="../assets/cards/check-shield.png" alt="" class="card-header-icon" />
            <h3>Meus Equipamentos</h3>
          </div>
        </div>
        <div class="empty-state">
          <img src="../assets/cards/check-shield.png" alt="" class="empty-icon" />
          <p>Seus EPIs aparecerão aqui.</p>
          <span>Equipamentos entregues serão listados nesta seção.</span>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>

// ===========================
// Visão Geral do Sistema
// ===========================

import { useAuthStore } from '../composable/useAuthStore'
import { useSupabase } from '../composable/useSupabase'
import { ref, reactive, computed, onMounted } from 'vue'

const { userProfile } = useAuthStore()
const { supabase } = useSupabase()

const isAdmin = computed(() => userProfile.value?.perfil_acesso === 'Administrador')

const firstName = computed(() => {
  const nome = userProfile.value?.nome
  if (!nome) return 'Carregando'
  return nome.split(' ')[0]
})

const userInitials = computed(() => {
  const nome = userProfile.value?.nome
  if (!nome) return '?'
  const parts = nome.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase()
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const epis = ref([])
const isLoadingList = ref(false)

// ===========================
// Visão do Administrador
// ===========================

// FUnção para bucar os EPIs
const fetchEpis = async () => {
  isLoadingList.value = true

  try{
    const { data, error } = await supabase
      .from('epis')
      .select('*')

      if (error) throw error

      epis.value = data
  }catch(error){
    console.error('Erro ao buscar EPIs:', error)
  }finally{
    isLoadingList.value = false
  }
}

onMounted(() => {
    fetchEpis()
    fetchEntregas()
})

// variavel para armazenar o total de epis cadastrados no sistem
const totalItens = computed(() => epis.value.length)

// variavel para armazenar a quantidade de epis em estoque baixo
const estoqueBaixo = computed(() => {
  return epis.value.filter(epi => epi.estoque_atual <= epi.estoque_minimo).length
})

// variavel para armazenar os epis com CA a vencer (30 dias)
const caVencendo = computed(() => {
  const hoje = new Date()
  // variavel para armazenar a data atual + 30 dias (para calcular os EPIs com CA vencendo em breve)
  const trintaDias = new Date(hoje.getTime() + (30 * 24 * 60 * 60 * 1000))

  return epis.value.filter(epi => {
    if (!epi.validade_ca) return false
    const dataValidade = new Date(epi.validade_ca)
    return dataValidade <= trintaDias
  }).length
})

// armazena as entregas
const entregas = ref([])

// função select para retornar todas as entregas
const fetchEntregas = async () => {
  try{
    const { data, error } = await supabase
      .from('entrega_epis')
      .select('*')
  
    if (error) throw error
  
    entregas.value = data
  } catch(error){
    console.error('Erro ao buscar entregas:', error)
  }
}

// calcula quantas entregas foram feitas HOJE
const entregasHoje = computed (() => {
  const dataHoje = new Date().toISOString().split('T')[0] // formata a data para YYYY-MM-DD

  return entregas.value.filter(entrega => {
    if (!entrega.created_at) return false

    const dataDaEntrega = entrega.created_at.split('T')[0] // formata a data da entrega para YYYY-MM-DD

    return dataDaEntrega === dataHoje
  }).length
})

// ===========================
// Visão do Funcionário
// ===========================

// variavel para armazenar os EPIs ativos do funcionario (ainda nao devolvidos)
const meusEpisAtivos = computed (() => {
  return entregas.value.filter(entregas => !entregas.data_devolucao).length
})

// variavel para armazenar a quantidade de EPIs que precisam ser trocados em 30 dias
const trocasProximas = computed(() => {
  const hoje = new Date()
  const trintaDias = new Date(hoje.getTime() + (30 * 24 * 60 * 60 * 1000))

  return entregas.value.filter(entrega => {
    // se nao tem nenhuma data de devolução estipulada, ignora
    if (!entrega.data_troca || !entrega.data_devolucao) return false

    const dataTroca = new Date(entrega.data_troca)
    return dataTroca <= trintaDias
  }).length
})

</script>

<style scoped>
/* ─── Página ─────────────────────────────────── */
.dashboard-page {
  animation: fadeIn 0.4s ease-out;
}

/* ─── Header ─────────────────────────────────── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
}

.header-date {
  font-size: 13px;
  color: #a0aab4;
  text-transform: capitalize;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

.page-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #1a2533;
  margin-bottom: 6px;
}

.header-subtitle {
  font-size: 14px;
  color: #8896a3;
}

.header-avatar {
  position: relative;
  flex-shrink: 0;
}

.header-avatar img,
.avatar-initials {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2C3E50, #4a6278);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.avatar-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.avatar-badge.online {
  background: #2ecc71;
}

/* ─── Grid de Stats ───────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.09);
}

.stat-accent {
  width: 5px;
  flex-shrink: 0;
  border-radius: 0;
}

.stat-body {
  padding: 20px 20px 20px 18px;
  flex: 1;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.stat-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.stat-value {
  font-size: 30px;
  font-weight: 800;
  color: #1a2533;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: #8896a3;
  font-weight: 500;
}

/* ─── Cores temáticas ─────────────────────────── */
.blue  { background: rgba(52, 152, 219, 0.12); }
.orange { background: rgba(243, 156, 18, 0.12); }
.red   { background: rgba(231, 76, 60, 0.12); }
.green { background: rgba(46, 204, 113, 0.12); }
.purple { background: rgba(142, 68, 173, 0.12); }

.stat-accent.blue   { background: #3498db; }
.stat-accent.orange { background: #f39c12; }
.stat-accent.red    { background: #e74c3c; }
.stat-accent.green  { background: #2ecc71; }

.stat-chip.neutral  { background: #eef2f5; color: #5a6a78; }
.stat-chip.warning  { background: rgba(243,156,18,0.15); color: #c07d00; }
.stat-chip.danger   { background: rgba(231,76,60,0.12); color: #c0392b; }
.stat-chip.positive { background: rgba(46,204,113,0.15); color: #1a9950; }

/* ─── Grid inferior (admin) ───────────────────── */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
}

/* ─── Card de conteúdo ────────────────────────── */
.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f3f6;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  opacity: 0.6;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a2533;
}

.btn-link {
  background: none;
  border: none;
  color: #f39c12;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}

.btn-link:hover { color: #c07d00; }

/* ─── Empty State ─────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 200px;
  background: #fafbfc;
  border-radius: 10px;
  border: 1.5px dashed #e0e6eb;
  padding: 32px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  opacity: 0.25;
  margin-bottom: 4px;
}

.empty-state p {
  font-size: 14px;
  font-weight: 600;
  color: #5a6a78;
}

.empty-state span {
  font-size: 12px;
  color: #aab4bc;
}

/* ─── Acesso Rápido ───────────────────────────── */
.quick-card { min-height: unset; }

.quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 12px;
  background: #f7f9fb;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
  border: 1px solid transparent;
}

.quick-item:hover {
  background: #eef2f8;
  transform: translateY(-2px);
  border-color: rgba(0,0,0,0.05);
}

.quick-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-icon img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.quick-item span {
  font-size: 12px;
  font-weight: 600;
  color: #4a5a6a;
}

.quick-icon.purple { background: rgba(142, 68, 173, 0.12); }

/* ─── Animação ────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Responsivo ──────────────────────────────── */
@media (max-width: 900px) {
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
