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
          0 itens cadastrados
        </span>
        <span class="chip orange">
          <img src="../assets/cards/alert.png" alt="" />
          0 com estoque baixo
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

        <div class="epi-grid" v-if="false">
          <!-- Populated dynamically in the future -->
        </div>

        <div class="empty-state">
          <img src="../assets/cards/inventory.png" alt="" class="empty-icon" />
          <p>Nenhum EPI cadastrado ainda.</p>
          <span>Use o formulário ao lado para adicionar o primeiro equipamento.</span>
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
                <input v-model="form.validade_ca" type="text" placeholder="Ex: 12345" required />
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
              {{ isSaving ? 'Salvando...' : 'Cadastrar EPI' }}
            </button>
          </div>

        </form>
      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSupabase } from '../composable/useSupabase'

const { supabase } = useSupabase()

const isSaving = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)
const searchQuery = ref('')
const activeFilter = ref('todos')

const epis = ref([])
const isLoadingList = ref(true)

const filters = [
  { label: 'Todos', value: 'todos' },
  { label: 'Estoque OK', value: 'ok' },
  { label: 'Estoque Baixo', value: 'baixo' },
  { label: 'CA Vencendo', value: 'vencendo' },
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
  validade_ca: '',
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
    validade_ca: '',
    tamanho: 'M',
    estoque_atual: 0,
    estoque_minimo: 5,
    validade_ca_date: ''
  })
  imageFile.value = null
  imagePreview.value = null
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
        .from('epis')
        .upload(filePath, imageFile.value)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('epis').getPublicUrl(filePath)
      publicImageUrl = urlData.publicUrl
    }

    const { error } = await supabase
      .from('epis')
      .insert({
        nome: form.nome,
        tamanho: form.tamanho,
        estoque_atual: form.estoque_atual,
        estoque_minimo: form.estoque_minimo,
        validade_ca: form.validade_ca,
        foto_epi: publicImageUrl
      })

    if (error) throw error

    alert('EPI cadastrado com sucesso!')
    resetForm()
  } catch (error) {
    alert('Erro ao cadastrar: ' + error.message)
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
            (epi.numero_ca && epi.numero_ca.toString().includes(term))
        )
    }

    const hoje = new Date()
    const trintaDias = new Date(hoje.getTime() + (30 * 24 * 60 * 60 * 1000))

    switch (activeFilter.value){
        case 'ok':
            result = result.filter(epi => epi.estoque_atual > estoque_minimo)
            break
        case 'baixo':
            result = result.filter(epi => epi.estoque_atual <= estoque_minimo)
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

/* ─── Animações ───────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Responsivo ──────────────────────────────── */
@media (max-width: 960px) {
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .form-panel {
    order: -1;
  }
}
</style>
