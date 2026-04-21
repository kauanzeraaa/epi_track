<template>
  <div class="catalog-page">

    <header class="page-header">
      <div class="header-text">
        <h1>Catálogo de EPIs</h1>
        <p>Cadastre e gerencie os equipamentos de proteção individual.</p>
      </div>
      <div class="header-chips">
        <span class="chip blue">
          <img src="../assets/cards/inventory.png" alt="" />
          {{ epis.length }} itens cadastrados
        </span>
        <span class="chip orange">
          <img src="../assets/cards/alert.png" alt="" />
          {{  epis.filter(epi => epi.estoque_atual <= epi.estoque_minimo).length }} com estoque baixo
        </span>
      </div>
    </header>

    <div class="catalog-layout">

      <!-- ── Painel esquerdo: lista ── -->
      <section class="panel list-panel">

        <div class="list-toolbar">
          <div class="search-wrap">
            <img src="../assets/cards/inventory.png" alt="" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar EPI por nome ou CA..."
              class="search-input"
            />
          </div>
          <div class="filter-chips">
            <button
              v-for="f in filters"
              :key="f.value"
              class="filter-btn"
              :class="{ active: activeFilter === f.value }"
              @click="activeFilter = f.value"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <div class="epi-grid" v-if="filteredEpis.length > 0">
          <div v-for="epi in filteredEpis" :key="epi.id" class="epi-card" :title="epi.nome">
            
            <div class="epi-image-wrap">
              <img v-if="epi.foto_epi" :src="epi.foto_epi" :alt="epi.nome" class="epi-photo" />
              <div v-else class="epi-no-photo">
                <span class="icon-camera">📷</span>
                <p>Sem foto</p>
              </div>
              
              <div class="status-badge" :class="epi.estoque_atual <= epi.estoque_minimo ? 'bg-danger' : 'bg-success'">
                <span class="badge-dot"></span>
                {{ epi.estoque_atual <= epi.estoque_minimo ? 'Estoque Baixo' : 'Estoque OK' }}
              </div>
            </div>
            
            <div class="epi-info">
              <h4 class="epi-title">{{ epi.nome }}</h4>
              
              <div class="epi-meta">
                <div class="meta-item">
                  <span class="meta-label">CA</span>
                  <span class="meta-value">{{ epi.ca }}</span>
                </div>
                <div class="meta-divider"></div>
                <div class="meta-item">
                  <span class="meta-label">Tam</span>
                  <span class="meta-value">{{ epi.tamanho }}</span>
                </div>
              </div>
              
              <div class="stock-progress-wrap">
                <div class="stock-header">
                  <span class="stock-title">Volume em Estoque</span>
                  <span class="stock-numbers">
                    <strong>{{ epi.estoque_atual }}</strong> <span class="text-muted">/ min {{ epi.estoque_minimo }}</span>
                  </span>
                </div>
                
                <div class="progress-track">
                  <div 
                    class="progress-fill"
                    :class="epi.estoque_atual <= epi.estoque_minimo ? 'fill-danger' : 'fill-success'" 
                    :style="{ width: Math.min((epi.estoque_atual / Math.max(epi.estoque_minimo * 2, 1)) * 100, 100) + '%' }">
                  </div>
                </div>
              </div>

              <div class="card-actions" v-if="isAdmin">
                <button @click.stop="editEpi(epi)" class="action-btn edit">Editar</button>
                <button @click.stop="deleteEpi(epi.id)" class="action-btn delete">Excluir</button>
              </div>

              
            </div>

          </div>
        </div>

        <div class="empty-state" v-if="filteredEpis.length === 0 && !isLoadingList">
          <img src="../assets/cards/inventory.png" alt="" class="empty-icon" />
          <p>Nenhum EPI encontrado.</p>
          <span>Use o formulário ao lado para adicionar equipamentos ou mude os filtros de busca.</span>
        </div>

      </section>

      <!-- ── Painel direito: formulário ── -->
      <aside class="panel form-panel">
        <div class="form-panel-header">
          <div class="form-panel-title">
            <span class="form-panel-dot"></span>
            <h3>Novo Equipamento</h3>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="epi-form">

          <div class="image-upload-area" :class="{ 'has-image': imagePreview }">
            <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="image-preview" />
            <div v-else class="upload-placeholder">
              <span class="upload-icon">📷</span>
              <p>Foto do equipamento</p>
              <span>Clique para selecionar</span>
            </div>
            <input type="file" @change="handleFileChange" accept="image/*" class="file-input" />
          </div>

          <div class="form-section">
            <div class="input-group">
              <label>Nome do EPI</label>
              <input v-model="form.nome" type="text" placeholder="Ex: Luva de Vaqueta" required />
            </div>
          </div>

          <div class="form-section">
            <p class="section-label">Certificado de Aprovação</p>
            <div class="input-row">
              <div class="input-group">
                <label>Número do CA</label>
                <input v-model="form.ca" type="text" placeholder="Ex: 12345" required />
              </div>
              <div class="input-group">
                <label>Validade do CA</label>
                <input v-model="form.validade_ca_date" type="date" required />
              </div>
            </div>
          </div>

          <div class="form-section">
            <p class="section-label">Estoque</p>
            <div class="input-row three-cols">
              <div class="input-group">
                <label>Tamanho</label>
                <select v-model="form.tamanho">
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                  <option value="U">Único</option>
                </select>
              </div>
              <div class="input-group">
                <label>Qtd. Atual</label>
                <input v-model.number="form.estoque_atual" type="number" min="0" required />
              </div>
              <div class="input-group">
                <label>Qtd. Mínima</label>
                <input v-model.number="form.estoque_minimo" type="number" min="0" required />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetForm">Limpar</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              <span v-if="isSaving" class="btn-loading"></span>
              {{ isSaving ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Cadastrar EPI') }}
            </button>
          </div>

        </form>
      </aside>

    </div>

    <!-- ── Toasts ── -->
    <teleport to="body">
      <div class="toast-container">
        <transition-group name="toast">
          <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
            <span class="toast-icon">
              <svg v-if="t.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <svg v-else-if="t.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <span class="toast-message">{{ t.message }}</span>
            <button class="toast-close" @click="dismissToast(t.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </transition-group>
      </div>

      <!-- ── Modal de confirmação ── -->
      <transition name="modal">
        <div v-if="modal.visible" class="modal-backdrop" @click.self="modal.resolve(false); modal.visible = false">
          <div class="modal-card">
            <div class="modal-icon-wrap" :class="modal.iconType">
              <svg v-if="modal.iconType === 'danger'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 class="modal-title">{{ modal.title }}</h3>
            <p class="modal-message">{{ modal.message }}</p>
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="modal.resolve(false); modal.visible = false">
                {{ modal.cancelText }}
              </button>
              <button class="modal-btn confirm" :class="modal.iconType" @click="modal.resolve(true); modal.visible = false">
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

// ── Toast ──────────────────────────────────────
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

// ── Modal ──────────────────────────────────────
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

const imageFile = ref(null)
const imagePreview = ref(null)
const searchQuery = ref('')
const activeFilter = ref('todos')

// ID do EPI sendo editado
const editingId = ref(null)

const epis = ref([])
const isLoadingList = ref(true)

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Estoque OK', value: 'ok' },
  { label: 'Estoque Baixo', value: 'baixo' },
  { label: 'CA Vencendo (30 dias)', value: 'vencendo' },
]

// apresenta os EPIs na tela
const fetchEpis = async () => {
    isLoadingList.value = true

    try{
        const { data, error } = await supabase
            .from('epis')
            .select('*')
            .order('nome', { ascending: true }) // ordena nome por ordem alfabética

        if (error) throw error
        epis.value = data
    }catch(error){
        console.error('Erro ao buscar EPIs:', error.message)
    }finally{
        isLoadingList.value = false
    }
}

onMounted(() => {
    fetchEpis()
})

const form = reactive({
  nome: '',
  ca: '',
  tamanho: 'M',
  estoque_atual: 0,
  estoque_minimo: 5,
  validade_ca_date: ''
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const resetForm = () => {
  Object.assign(form, {
    nome: '',
    ca: '',
    tamanho: 'M',
    estoque_atual: 0,
    estoque_minimo: 5,
    validade_ca_date: ''
  })
  imageFile.value = null
  imagePreview.value = null
  editingId.value = null
}

// função para carregar dados do formulário
const editEpi = (epi) => {
  editingId.value = epi.id
  form.nome = epi.nome
  form.ca = epi.ca
  form.tamanho = epi.tamanho
  form.estoque_atual = epi.estoque_atual
  form.estoque_minimo = epi.estoque_minimo
  form.validade_ca_date = epi.validade_ca
  imagePreview.value = epi.foto_epi

  // rola a tela para o topo para o usuario ver o formulario
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// função para deletar epi
const deleteEpi = async (id) => {
  const confirmou = await showConfirm(
    'Excluir equipamento',
    'Esta ação é permanente e não pode ser desfeita. Deseja continuar?',
    { confirmText: 'Sim, excluir', cancelText: 'Cancelar', iconType: 'danger' }
  )
  if (!confirmou) return

  try {
    const { error } = await supabase.from('epis').delete().eq('id', id)
    if (error) throw error
    showToast('EPI excluído com sucesso.')
    fetchEpis()
  } catch (error) {
    showToast('Erro ao excluir: ' + error.message, 'error')
  }
}

const handleSubmit = async () => {
  isSaving.value = true

  try {
    let publicImageUrl = null

    if (imageFile.value) {
      const fileExt = imageFile.value.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `epi_photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('epi_imagens')
        .upload(filePath, imageFile.value)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('epi_imagens')
        .getPublicUrl(filePath)
      publicImageUrl = urlData.publicUrl
    }

    // dados que vão para o banco (update ou insert)
    const payload = {
      nome: form.nome,
      ca: form.ca,
      validade_ca: form.validade_ca_date,
      tamanho: form.tamanho,
      estoque_atual: form.estoque_atual,
      estoque_minimo: form.estoque_minimo
    }

    // atualiza foto se foi alterada
    if (publicImageUrl) {
      payload.foto_epi = publicImageUrl
    }

    // se estiver editando, atualiza o registro existente
    if (editingId.value) {
      // se tem ID - atualiza

      const {error} = await supabase
        .from('epis')
        .update(payload)
        .eq('id', editingId.value)

        if (error) throw error
        showToast('EPI atualizado com sucesso!')
    } else {
        const {error} = await supabase.from('epis').insert(payload)
        if (error) throw error
        showToast('EPI cadastrado com sucesso!')
    }

    resetForm()
    fetchEpis()
  } catch (error) {
    showToast('Erro ao salvar: ' + error.message, 'error')
  } finally {
    isSaving.value = false
  }
}

const filteredEpis = computed(() => {
    let result = epis.value

    if (searchQuery.value) {
        const term = searchQuery.value.toLowerCase()
        result = result.filter(epi =>
            epi.nome.toLowerCase().includes(term) ||
            (epi.ca && epi.ca.toString().includes(term))
        )
    }

    const hoje = new Date()
    const trintaDias = new Date(hoje.getTime() + (30 * 24 * 60 * 60 * 1000))

    switch (activeFilter.value){
        case 'ok':
            result = result.filter(epi => epi.estoque_atual > epi.estoque_minimo)
            break
        case 'baixo':
            result = result.filter(epi => epi.estoque_atual <= epi.estoque_minimo)
            break
        case 'vencendo':
            result = result.filter(epi => {
                if (!epi.validade_ca) return false
                const dataValidade = new Date(epi.validade_ca)
                return dataValidade <= trintaDias
            })
            break
    }

    return result
})

</script>

<style scoped>
/* ─── Página ──────────────────────────────────── */
.catalog-page {
  animation: fadeIn 0.4s ease-out;
}

/* ─── Header ──────────────────────────────────── */
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

.chip.blue   { background: rgba(52,152,219,0.1); color: #2176ae; }
.chip.orange { background: rgba(243,156,18,0.1); color: #c07d00; }

/* ─── Layout principal ────────────────────────── */
.catalog-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

/* ─── Painel base ─────────────────────────────── */
.panel {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.04);
  overflow: hidden;
}

/* ─── Painel lista ────────────────────────────── */
.list-toolbar {
  padding: 20px 20px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 16px;
  height: 16px;
  object-fit: contain;
  opacity: 0.35;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 11px 14px 11px 40px;
  border: 1.5px solid #e0e6eb;
  border-radius: 10px;
  font-size: 14px;
  color: #2c3e50;
  background: #f9fbfc;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #f39c12;
  background: #fff;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f3f6;
}

.filter-btn {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid #e0e6eb;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: #8896a3;
  cursor: pointer;
  transition: all 0.15s;
}

.filter-btn:hover {
  border-color: #f39c12;
  color: #c07d00;
}

.filter-btn.active {
  background: #2C3E50;
  border-color: #2C3E50;
  color: #fff;
}

/* ─── Empty state ─────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 320px;
  padding: 40px 24px;
  text-align: center;
}

.empty-icon {
  width: 52px;
  height: 52px;
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
  max-width: 300px;
}

/* ─── Formulário ──────────────────────────────── */
.form-panel-header {
  padding: 20px 22px 16px;
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
  background: #f39c12;
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

/* Upload de imagem */
.image-upload-area {
  width: 100%;
  height: 160px;
  background: #f8f9fb;
  border: 2px dashed #dce2e8;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 20px;
  transition: border-color 0.2s;
}

.image-upload-area:hover {
  border-color: #f39c12;
}

.image-upload-area.has-image {
  border-style: solid;
  border-color: #e0e6eb;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #a0aab4;
  pointer-events: none;
}

.upload-icon {
  font-size: 26px;
}

.upload-placeholder p {
  font-size: 13px;
  font-weight: 600;
  color: #7a8a96;
}

.upload-placeholder span {
  font-size: 12px;
  color: #b0bcc6;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* Sections do form */
.form-section {
  margin-bottom: 18px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: #a0aab4;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 10px;
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

input, select {
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

input:focus, select:focus {
  outline: none;
  border-color: #f39c12;
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

.input-row.three-cols {
  grid-template-columns: 80px 1fr 1fr;
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
  gap: 8px;
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
  opacity: 0.6;
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
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

/* ─── Grid Principal ──────────────────────────── */
.epi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 0 4px 24px 4px; /* Pequeno padding lateral para as sombras não cortarem */
}

/* ─── O Card ──────────────────────────────────── */
.epi-card {
  background: #ffffff;
  border: 1px solid #eef2f5;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(136, 150, 163, 0.08);
  cursor: pointer;
}

.epi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(136, 150, 163, 0.15);
  border-color: #dce2e8;
}

/* ─── Imagem ──────────────────────────────────── */
.epi-image-wrap {
  position: relative;
  height: 180px;
  width: 100%;
  background: #f8f9fb;
  border-bottom: 1px solid #eef2f5;
  overflow: hidden;
}

.epi-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.epi-card:hover .epi-photo {
  transform: scale(0.95);
}

.epi-no-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a0aab4;
}

.icon-camera {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.5;
}

/* ─── Badge Flutuante ─────────────────────────── */
.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  animation: pulse 2s infinite;
}

.bg-success { background: rgba(46, 204, 113, 0.9); color: #fff; }
.bg-danger { background: rgba(231, 76, 60, 0.9); color: #fff; }

/* ─── Informações do EPI ──────────────────────── */
.epi-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.epi-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a2533;
  margin: 0 0 16px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.epi-meta {
  display: flex;
  align-items: center;
  background: #f8f9fb;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 18px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 10px;
  text-transform: uppercase;
  color: #8896a3;
  font-weight: 700;
}

.meta-value {
  font-size: 13px;
  color: #2c3e50;
  font-weight: 600;
}

.meta-divider {
  width: 1px;
  height: 24px;
  background: #dce2e8;
  margin: 0 16px;
}

/* ─── Barra de Progresso ──────────────────────── */
.stock-progress-wrap {
  margin-top: auto;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
}

.stock-title {
  font-size: 12px;
  font-weight: 600;
  color: #5a6a78;
}

.stock-numbers {
  font-size: 14px;
  color: #1a2533;
}

.text-muted {
  font-size: 11px;
  color: #a0aab4;
  font-weight: 500;
}

.progress-track {
  height: 8px;
  background: #eef2f5;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fill-success { background: linear-gradient(90deg, #2ecc71, #27ae60); }
.fill-danger { background: linear-gradient(90deg, #e74c3c, #c0392b); }

/* ─── Animações ───────────────────────────────── */
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(255, 255, 255, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

/* ─── Animações ───────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Responsividade ──────────────────────────────── */
@media (max-width: 960px) {
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .form-panel {
    order: -1;
  }
}

/* ─── Botões de Ação do Card ──────────────────── */
.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e0e6eb;
}

.action-btn {
  flex: 1;
  padding: 8px 0;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-btn.edit {
  background: #f8f9fb;
  color: #2c3e50;
  border-color: #dce2e8;
}

.action-btn.edit:hover {
  background: #eef2f5;
  border-color: #c8d0d8;
}

.action-btn.delete {
  background: rgba(231, 76, 60, 0.05);
  color: #e74c3c;
}

.action-btn.delete:hover {
  background: rgba(231, 76, 60, 0.1);
}

/* ─── Toasts ──────────────────────────────────── */
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
  background: #fff;
}

.toast.success { border-left: 4px solid #2ecc71; color: #1a2533; }
.toast.error   { border-left: 4px solid #e74c3c; color: #1a2533; }
.toast.warning { border-left: 4px solid #f39c12; color: #1a2533; }

.toast-icon { display: flex; align-items: center; flex-shrink: 0; }
.toast.success .toast-icon { color: #2ecc71; }
.toast.error   .toast-icon { color: #e74c3c; }
.toast.warning .toast-icon { color: #f39c12; }

.toast-message { flex: 1; line-height: 1.4; }

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
.toast-close:hover { color: #5a6a78; }

/* ─── Modal ───────────────────────────────────── */
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

.modal-icon-wrap.warning { background: rgba(243,156,18,0.12); color: #f39c12; }
.modal-icon-wrap.danger  { background: rgba(231,76,60,0.10);  color: #e74c3c; }

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

.modal-btn.cancel { background: #f4f6f8; color: #5a6a78; }
.modal-btn.cancel:hover { background: #e8ecf0; }

.modal-btn.confirm.warning { background: #f39c12; color: #fff; }
.modal-btn.confirm.warning:hover { background: #d68910; }

.modal-btn.confirm.danger { background: #e74c3c; color: #fff; }
.modal-btn.confirm.danger:hover { background: #c0392b; }

/* ─── Transições ──────────────────────────────── */
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

.modal-enter-active, .modal-leave-active { transition: all 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-card, .modal-leave-to .modal-card {
  transform: scale(0.95) translateY(10px);
}
</style>
