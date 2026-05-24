<template>
  <div class="movements-page">

    <header class="page-header">
      <div class="header-text">
        <h1>Movimentações de EPI</h1>
        <p>Registre e acompanhe a entrega de equipamentos.</p>
      </div>
      <div class="header-chips">
        <span class="chip blue">
          <img src="../assets/cards/deliver.png" alt="" />
          {{ entregasRecentes.length }} registros
        </span>
        <span class="chip green">
          <img src="../assets/cards/check-shield.png" alt="" />
          {{ emUsoCount }} em uso
        </span>
      </div>
    </header>

    <div class="movements-layout">

      <!-- Painel histórico -->
      <section class="panel list-panel">

        <div class="list-toolbar">
          <h3>Histórico de Entregas</h3>
          <div class="tab-bar">
            <button v-for="tab in tabs" :key="tab.value" class="tab-btn" :class="{ active: activeTab === tab.value }"
              @click="activeTab = tab.value">
              {{ tab.label }}
              <span class="tab-count">{{ tab.count }}</span>
            </button>
          </div>
        </div>

        <div class="list-body">

          <div v-if="isLoading" class="skeleton-list">
            <div v-for="n in 4" :key="n" class="skeleton-card">
              <div class="skeleton skeleton-icon"></div>
              <div class="skeleton-lines">
                <div class="skeleton skeleton-line long"></div>
                <div class="skeleton skeleton-line short"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredEntregas.length > 0" class="history-list">
            <div v-for="entrega in filteredEntregas" :key="entrega.id" class="delivery-card">
              <div class="card-accent" :class="entrega.data_devolucao ? 'gray' : 'blue'"></div>

              <div class="card-icon-wrap">
                <img src="../assets/cards/deliver.png" alt="" class="card-icon" />
              </div>

              <div class="card-body">
                <div class="card-top">
                  <h4>{{ entrega.epis?.nome || 'EPI Desconhecido' }}</h4>
                  <span class="status-badge" :class="entrega.data_devolucao ? 'returned' : 'active'">
                    {{ entrega.data_devolucao ? 'Devolvido' : 'Em uso' }}
                  </span>
                </div>

                <p class="card-user">
                  <img src="../assets/icons_sideBar/perfil_user.png" alt="" class="user-icon" />
                  {{ entrega.usuarios?.nome || 'Usuário desconhecido' }}
                </p>

                <div class="card-meta">
                  <span class="meta-pill qty">
                    Qtd: <strong>{{ entrega.quantidade }}</strong>
                  </span>
                  <span class="meta-dot">·</span>
                  <span class="meta-date">{{ formatarData(entrega.created_at) }}</span>
                </div>

                <div v-if="entrega.data_troca && !entrega.data_devolucao" class="troca-alert">
                  <img src="../assets/cards/alert.png" alt="" class="alert-icon" />
                  Troca prevista em {{ formatarData(entrega.data_troca, false) }}
                </div>

                <div class="card-actions" v-if="isAdmin && !entrega.data_devolucao">
                  <button @click.stop="registrarDevolucao(entrega)" class="btn-return">
                    <img src="../assets/return.png" alt="Registrar Devolução"
                      style="width:13px; height:13px; opacity: 0.7 ;">
                    Registrar Devolução
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <img src="../assets/cards/deliver.png" alt="" class="empty-icon" />
            <p>Nenhuma movimentação encontrada.</p>
            <span>As entregas registradas aparecerão aqui.</span>
          </div>

        </div>
      </section>

      <!-- Painel formulário -->
      <aside class="panel form-panel">
        <div class="form-panel-header">
          <div class="form-panel-title">
            <span class="form-panel-dot"></span>
            <h3>Nova Entrega</h3>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="epi-form">

          <div class="form-section">
            <div class="input-group">
              <label>Usuário</label>
              <select v-model="form.usuario_id" required :disabled="isLoadingDados">
                <option value="" disabled>Selecione um usuário...</option>
                <option v-for="user in usuarios" :key="user.id" :value="user.id">
                  {{ user.nome }} — ({{ user.tipo_usuario }})
                </option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <div class="input-group">
              <label>Equipamento (EPI)</label>
              <select v-model="form.epi_id" required :disabled="isLoadingDados">
                <option value="" disabled>Selecione um EPI...</option>
                <option v-for="epi in episDisponiveis" :key="epi.id" :value="epi.id">
                  {{ epi.nome }} — Tam: {{ epi.tamanho }} · Est: {{ epi.estoque_atual }}
                </option>
              </select>
            </div>

            <!-- Preview do EPI selecionado -->
            <transition name="slide-down">
              <div v-if="epiInfo" class="epi-preview">
                <div class="preview-photo">
                  <img v-if="epiInfo.foto_epi" :src="epiInfo.foto_epi" :alt="epiInfo.nome" />
                  <div v-else class="preview-no-photo">
                    <img src="../assets/cards/inventory.png" alt="" />
                  </div>
                </div>
                <div class="preview-info">
                  <p class="preview-name">{{ epiInfo.nome }}</p>
                  <p class="preview-ca">CA {{ epiInfo.ca }} · Tam {{ epiInfo.tamanho }}</p>
                  <div class="preview-stock">
                    <div class="stock-bar-wrap">
                      <div class="stock-bar-fill"
                        :class="epiInfo.estoque_atual <= epiInfo.estoque_minimo ? 'danger' : 'ok'"
                        :style="{ width: stockPercent(epiInfo) + '%' }"></div>
                    </div>
                    <span class="stock-label"
                      :class="epiInfo.estoque_atual <= epiInfo.estoque_minimo ? 'text-danger' : 'text-ok'">
                      {{ epiInfo.estoque_atual }} / mín {{ epiInfo.estoque_minimo }}
                    </span>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <div class="form-section">
            <div class="input-row">
              <div class="input-group">
                <label>Quantidade</label>
                <input v-model.number="form.quantidade" type="number" min="1" required />
              </div>
              <div class="input-group">
                <label>Próxima Troca</label>
                <input v-model="form.data_troca" type="date" />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetForm">Limpar</button>
            <button type="submit" class="btn-primary" :disabled="isSaving || !form.epi_id || !form.usuario_id">
              <span v-if="isSaving" class="btn-loading"></span>
              {{ isSaving ? 'Registrando...' : 'Registrar Entrega' }}
            </button>
          </div>

        </form>
      </aside>

    </div>

    <!-- Toasts-->
    <teleport to="body">
      <div class="toast-container">
        <transition-group name="toast">
          <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
            <span class="toast-icon">
              <svg v-if="t.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <svg v-else-if="t.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6M9 9l6 6" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <span class="toast-message">{{ t.message }}</span>
            <button class="toast-close" @click="dismissToast(t.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </transition-group>
      </div>

      <!-- Modal de confirmação -->
      <transition name="modal">
        <div v-if="modal.visible" class="modal-backdrop" @click.self="modal.resolve(false); modal.visible = false">
          <div class="modal-card">
            <div class="modal-icon-wrap" :class="modal.iconType">
              <svg v-if="modal.iconType === 'warning'" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h3 class="modal-title">{{ modal.title }}</h3>
            <p class="modal-message">{{ modal.message }}</p>
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="modal.resolve(false); modal.visible = false">
                {{ modal.cancelText }}
              </button>
              <button class="modal-btn confirm" :class="modal.iconType"
                @click="modal.resolve(true); modal.visible = false">
                {{ modal.confirmText }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSupabase } from '../composable/useSupabase'
import { useAuthStore } from '../composable/useAuthStore'

const { supabase } = useSupabase()
const { userProfile } = useAuthStore()

const isAdmin = computed(() => userProfile.value?.perfil_acesso === 'Administrador')
const isSaving = ref(false)
const isLoading = ref(true)
const isLoadingDados = ref(true)
const activeTab = ref('todos')

// Toast - sistema de notificaçao
const toasts = ref([])
let toastId = 0

const showToast = (message, type = 'success') => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => dismissToast(id), 4500)
}

const dismissToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Modal - sistema de confirmação para o usuário interagir
const modal = reactive({
  visible: false,
  title: '',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  iconType: 'warning',
  resolve: null,
})

const showConfirm = (title, message, { confirmText = 'Confirmar', cancelText = 'Cancelar', iconType = 'warning' } = {}) => {
  return new Promise((resolve) => {
    Object.assign(modal, { visible: true, title, message, confirmText, cancelText, iconType, resolve })
  })
}

const usuarios = ref([])
const epis = ref([])
const entregasRecentes = ref([])

const form = reactive({
  usuario_id: '',
  epi_id: '',
  quantidade: 1,
  data_troca: ''
})

const tabs = computed(() => [
  { label: 'Todos', value: 'todos', count: entregasRecentes.value.length },
  { label: 'Em uso', value: 'em_uso', count: emUsoCount.value },
])

const emUsoCount = computed(() => entregasRecentes.value.filter(e => !e.data_devolucao).length)

const filteredEntregas = computed(() => {
  if (activeTab.value === 'em_uso') return entregasRecentes.value.filter(e => !e.data_devolucao)
  return [...entregasRecentes.value].sort((a, b) => {
    if (!a.data_devolucao && b.data_devolucao) return -1
    if (a.data_devolucao && !b.data_devolucao) return 1
    return 0
  })
})

const episDisponiveis = computed(() => epis.value.filter(e => e.estoque_atual > 0))

const epiInfo = computed(() => {
  if (!form.epi_id) return null
  return epis.value.find(e => e.id === form.epi_id) || null
})

const stockPercent = (epi) => {
  const max = Math.max(epi.estoque_minimo * 2, 1)
  return Math.min((epi.estoque_atual / max) * 100, 100)
}

const fetchData = async () => {
  isLoadingDados.value = true
  try {
    const { data: usersData } = await supabase.from('usuarios').select('id, nome, tipo_usuario').order('nome')
    if (usersData) usuarios.value = usersData

    const { data: episData } = await supabase.from('epis').select('*').order('nome')
    if (episData) epis.value = episData

    await fetchMovimentacoes()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    isLoadingDados.value = false
  }
}

const fetchMovimentacoes = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('entrega_epis')
      .select(`*, usuarios (nome), epis (nome)`)
      .order('created_at', { ascending: false })
      .limit(20) // limitando a 20 linhas buscadas

    if (error) throw error
    entregasRecentes.value = data
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())

const resetForm = () => {
  form.usuario_id = ''
  form.epi_id = ''
  form.quantidade = 1
  form.data_troca = ''
}

const handleSubmit = async () => {
  isSaving.value = true
  try {
    // verifica se a quantidade de EPI selecionada existe no estoque
    const epiSelecionado = epis.value.find(e => e.id === form.epi_id)
    if (epiSelecionado.estoque_atual < form.quantidade) {
      showToast(`Estoque insuficiente! Disponível: ${epiSelecionado.estoque_atual}`, 'error')
      return
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0) // Zera as horas para comparar apenas os dias
    const dataValidadeCa = new Date(epiSelecionado.validade_ca)

    // verifica se o CA do epi selecionado está vencido
    if (dataValidadeCa < hoje) {
      showToast(`Bloqueado! O C.A. deste EPI venceu em ${formatarData(epiSelecionado.validade_ca, false)}. Proibido entregar equipamentos vencidos.`, 'error')
      isSaving.value = false
      return
    }

    const usuarioSelecionado = usuarios.value.find(u => u.id === form.usuario_id)
    
    // permite visitantes pegarem apenas 1 tipo de EPI por vez
    if (usuarioSelecionado.tipo_usuario === 'Visitante' && form.quantidade > 1) {
      showToast('Bloqueado! Visitantes só podem receber no máximo 1 unidade por entrega.', 'error')
      isSaving.value = false
      return
    }

    const payload = {
      usuario_id: form.usuario_id,
      epi_id: form.epi_id,
      quantidade: form.quantidade,
      ...(form.data_troca && { data_troca: form.data_troca })
    }

    const { error: insertError } = await supabase.from('entrega_epis').insert(payload)
    if (insertError) throw insertError

    const { error: updateError } = await supabase
      .from('epis')
      .update({ estoque_atual: epiSelecionado.estoque_atual - form.quantidade })
      .eq('id', form.epi_id)
    if (updateError) throw updateError

    showToast('Entrega registrada com sucesso!')
    resetForm()
    await fetchData()
  } catch (error) {
    showToast('Erro ao registrar: ' + error.message, 'error')
  } finally {
    isSaving.value = false
  }
}

const formatarData = (dataString, comHora = true) => {
  if (!dataString) return ''
  const data = new Date(dataString)
  if (comHora) {
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
  return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

const registrarDevolucao = async (entrega) => {
  const confirmou = await showConfirm(
    'Confirmar devolução',
    `Registrar a devolução de "${entrega.epis.nome}" por ${entrega.usuarios.nome}?`,
    { confirmText: 'Confirmar', cancelText: 'Cancelar', iconType: 'warning' }
  )
  if (!confirmou) return

  const voltaProEstoque = await showConfirm(
    'Destino do equipamento',
    'O equipamento está em boas condições e deve voltar ao estoque?',
    { confirmText: 'Sim, devolver ao estoque', cancelText: 'Não, descartar', iconType: 'info' }
  )

  isSaving.value = true
  try {
    const { error: devolucaoError } = await supabase
      .from('entrega_epis')
      .update({ data_devolucao: new Date().toISOString() })
      .eq('id', entrega.id)

    if (devolucaoError) throw devolucaoError

    if (voltaProEstoque) {
      const { data: epiAtual } = await supabase
        .from('epis')
        .select('estoque_atual')
        .eq('id', entrega.epi_id)
        .single()

      if (epiAtual) {
        await supabase
          .from('epis')
          .update({ estoque_atual: epiAtual.estoque_atual + entrega.quantidade })
          .eq('id', entrega.epi_id)
      }
      showToast('Devolução registrada e estoque atualizado!')
    } else {
      showToast('Devolução registrada. Equipamento descartado.', 'warning')
    }

    await fetchData()
  } catch (error) {
    showToast('Erro ao registrar devolução: ' + error.message, 'error')
  } finally {
    isSaving.value = false
  }
}

</script>

<style scoped>
/*  Página  */
.movements-page {
  animation: fadeIn 0.4s ease-out;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #1a2533;
  margin-bottom: 6px;
}

.page-header p {
  font-size: 14px;
  color: #8896a3;
}

.header-chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.chip img {
  width: 15px;
  height: 15px;
  object-fit: contain;
}

.chip.blue {
  background: rgba(52, 152, 219, 0.1);
  color: #2176ae;
}

.chip.green {
  background: rgba(46, 204, 113, 0.1);
  color: #1a9950;
}

/* Layout */
.movements-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

.panel {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

/* Toolbar */
.list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f3f6;
  flex-wrap: wrap;
  gap: 12px;
}

.list-toolbar h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a2533;
}

.tab-bar {
  display: flex;
  gap: 6px;
  background: #f4f6f8;
  padding: 4px;
  border-radius: 10px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 7px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: #8896a3;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn.active {
  background: #fff;
  color: #1a2533;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.tab-count {
  background: #e8edf2;
  color: #5a6a78;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
}

.tab-btn.active .tab-count {
  background: #2C3E50;
  color: #fff;
}

/* Lista body */
.list-body {
  min-height: 300px;
}

/* Skeleton */
.skeleton-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px;
  background: #f8f9fb;
  border-radius: 12px;
}

.skeleton {
  background: linear-gradient(90deg, #eef0f2 25%, #f8f9fb 50%, #eef0f2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
}

.skeleton-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
}

.skeleton-line.long {
  width: 70%;
}

.skeleton-line.short {
  width: 45%;
}

/* Cards de entrega */
.history-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.delivery-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  background: #f8f9fb;
  border: 1px solid #eef2f5;
  border-radius: 12px;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}

.delivery-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
  transform: translateY(-1px);
}

.card-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.card-accent.blue {
  background: #3498db;
}

.card-accent.gray {
  background: #c8d0d8;
}

.card-icon-wrap {
  background: #fff;
  padding: 9px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  margin-left: 6px;
}

.card-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  display: block;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
}

.card-top h4 {
  font-size: 14px;
  font-weight: 700;
  color: #1a2533;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-badge.active {
  background: rgba(46, 204, 113, 0.12);
  color: #1a9950;
}

.status-badge.returned {
  background: rgba(0, 0, 0, 0.05);
  color: #8896a3;
}

.card-user {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #5a6a78;
  margin: 0 0 8px;
}

.user-icon {
  width: 13px;
  height: 13px;
  object-fit: contain;
  opacity: 0.45;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.meta-pill {
  font-size: 11px;
  font-weight: 600;
  color: #5a6a78;
  background: #eef2f5;
  padding: 2px 8px;
  border-radius: 6px;
}

.meta-dot {
  color: #c8d0d8;
  font-size: 12px;
}

.meta-date {
  font-size: 11px;
  color: #a0aab4;
}

.troca-alert {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #c07d00;
  background: rgba(243, 156, 18, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  width: fit-content;
}

.alert-icon {
  width: 12px;
  height: 12px;
  object-fit: contain;
}

/* Em estado vazio */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 300px;
  padding: 40px 24px;
  text-align: center;
}

.empty-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  opacity: 0.18;
  margin-bottom: 4px;
}

.empty-state p {
  font-size: 15px;
  font-weight: 600;
  color: #5a6a78;
}

.empty-state span {
  font-size: 13px;
  color: #aab4bc;
  max-width: 280px;
}

/* Formulário */
.form-panel-header {
  padding: 18px 22px 16px;
  border-bottom: 1px solid #f0f3f6;
}

.form-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-panel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3498db;
  flex-shrink: 0;
}

.form-panel-title h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a2533;
}

.epi-form {
  padding: 20px 22px 22px;
}

.form-section {
  margin-bottom: 18px;
}

.input-group {
  margin-bottom: 14px;
}

.input-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #4a5a6a;
  margin-bottom: 6px;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e0e6eb;
  border-radius: 8px;
  font-size: 13px;
  color: #1a2533;
  background: #f9fbfc;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3498db;
  background: #fff;
}

input::placeholder {
  color: #b8c4cc;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Preview do EPI */
.epi-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f4f7fb;
  border: 1px solid #dce6ef;
  border-radius: 10px;
  margin-top: 10px;
}

.preview-photo {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e8edf2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-no-photo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-no-photo img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  opacity: 0.3;
}

.preview-info {
  flex: 1;
  min-width: 0;
}

.preview-name {
  font-size: 13px;
  font-weight: 700;
  color: #1a2533;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-ca {
  font-size: 11px;
  color: #8896a3;
  margin: 0 0 8px;
}

.preview-stock {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stock-bar-wrap {
  flex: 1;
  height: 5px;
  background: #dce6ef;
  border-radius: 3px;
  overflow: hidden;
}

.stock-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.stock-bar-fill.ok {
  background: #2ecc71;
}

.stock-bar-fill.danger {
  background: #e74c3c;
}

.stock-label {
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.text-ok {
  color: #1a9950;
}

.text-danger {
  color: #c0392b;
}

/* Botões */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #f0f3f6;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #2C3E50;
  color: #fff;
  border: none;
  padding: 11px 22px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: #1a2533;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1.5px solid #e0e6eb;
  padding: 11px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #5a6a78;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.btn-secondary:hover {
  background: #f4f6f8;
  border-color: #c8d0d8;
}

.btn-loading {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

/* Transição do preview */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.22s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-6px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 100px;
  transform: translateY(0);
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/*  Botão de devolução  */
.card-actions {
  margin-top: 10px;
}

.btn-return {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 7px;
  border: 1.5px solid #dce6ef;
  background: #fff;
  color: #5a6a78;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
}

.btn-return:hover {
  border-color: #3498db;
  color: #2176ae;
  background: rgba(52, 152, 219, 0.06);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
}

.btn-return:active {
  transform: translateY(0);
}

/* Toasts  */
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  min-width: 280px;
  max-width: 380px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  pointer-events: all;
  font-size: 13px;
  font-weight: 600;
}

.toast.success {
  background: #fff;
  border-left: 4px solid #2ecc71;
  color: #1a2533;
}

.toast.error {
  background: #fff;
  border-left: 4px solid #e74c3c;
  color: #1a2533;
}

.toast.warning {
  background: #fff;
  border-left: 4px solid #f39c12;
  color: #1a2533;
}

.toast-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.toast.success .toast-icon {
  color: #2ecc71;
}

.toast.error .toast-icon {
  color: #e74c3c;
}

.toast.warning .toast-icon {
  color: #f39c12;
}

.toast-message {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #a0aab4;
  display: flex;
  align-items: center;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.15s;
}

.toast-close:hover {
  color: #5a6a78;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 36, 0.45);
  backdrop-filter: blur(4px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px 28px 28px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.modal-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.modal-icon-wrap.warning {
  background: rgba(243, 156, 18, 0.12);
  color: #f39c12;
}

.modal-icon-wrap.info {
  background: rgba(52, 152, 219, 0.12);
  color: #3498db;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a2533;
  margin: 0;
}

.modal-message {
  font-size: 14px;
  color: #5a6a78;
  line-height: 1.6;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  width: 100%;
}

.modal-btn {
  flex: 1;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  border: none;
}

.modal-btn.cancel {
  background: #f4f6f8;
  color: #5a6a78;
}

.modal-btn.cancel:hover {
  background: #e8ecf0;
}

.modal-btn.confirm.warning {
  background: #f39c12;
  color: #fff;
}

.modal-btn.confirm.warning:hover {
  background: #d68910;
}

.modal-btn.confirm.info {
  background: #3498db;
  color: #fff;
}

.modal-btn.confirm.info:hover {
  background: #2176ae;
}

/* Transições toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

/* Transição modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.95) translateY(10px);
}

/* Responsividade */
@media (max-width: 960px) {
  .movements-layout {
    grid-template-columns: 1fr;
  }

  .form-panel {
    order: -1;
  }
}
</style>
