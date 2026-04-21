<template>
    <div class="nr6-page">

        <header class="page-header no-print">
            <div class="header-text">
                <h1>Ficha de EPI (NR-6)</h1>
                <p>Consulte o histórico de entregas e devoluções por usuário.</p>
            </div>
            <div class="header-actions">
                <button class="btn-secondary" @click="imprimirFicha"
                    :disabled="!selectedUserId || historico.length === 0">
                    <img src="../assets/printer.png" alt="Imprimir" style="width:16px; height:16px;">
                    Imprimir Ficha
                </button>
            </div>
        </header>

        <div class="panel">
            <div class="filter-bar no-print">
                <div class="input-group">
                    <label>Selecione o Usuário para ver a ficha:</label>
                    <select v-model="selectedUserId" @change="buscarHistorico" :disabled="isLoadingUsers">
                        <option value="" disabled>Escolha um usuário...</option>
                        <option v-for="user in usuarios" :key="user.id" :value="user.id">
                            {{ user.nome }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="doc-header" v-if="selectedUserId && !isLoading">
                <h2>FICHA DE REGISTRO DE ENTREGA DE EPI</h2>
                <div class="doc-info">
                    <p><strong>Usuário:</strong> {{ nomeSelecionado }}</p>
                    <p><strong>Emissão do Relatório:</strong> {{ dataHoje }}</p>
                </div>
                <p class="doc-legal">
                    Declaro ter recebido os Equipamentos de Proteção Individual (EPI) abaixo relacionados,
                    com o compromisso de usá-los apenas para a finalidade a que se destinam, responsabilizando-me
                    por sua guarda e conservação, e comunicando qualquer alteração que os torne impróprios para uso.
                </p>
            </div>

            <div class="table-container" v-if="selectedUserId">

                <div v-if="isLoading" class="loading-state no-print">
                    <span class="spinner"></span> Buscando registros...
                </div>

                <table class="nr6-table" v-else-if="historico.length > 0">
                    <thead>
                        <tr>
                            <th>Data de Entrega</th>
                            <th>Equipamento (EPI)</th>
                            <th>C.A.</th>
                            <th>Qtd</th>
                            <th>Status</th>
                            <th>Data de Devolução</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in historico" :key="item.id">
                            <td>{{ formatarData(item.created_at) }}</td>
                            <td><strong>{{ item.epis?.nome || 'EPI Desconhecido' }}</strong></td>
                            <td>{{ item.epis?.ca || '-' }}</td>
                            <td>{{ item.quantidade }}</td>
                            <td>
                                <span class="status-badge" :class="item.data_devolucao ? 'returned' : 'active'">
                                    {{ item.data_devolucao ? 'Devolvido' : 'Em Uso' }}
                                </span>
                            </td>
                            <td>{{ item.data_devolucao ? formatarData(item.data_devolucao) : '-' }}</td>
                        </tr>
                    </tbody>
                </table>

                <div v-else class="empty-state no-print">
                    <span class="empty-icon">📄</span>
                    <p>Nenhum registro encontrado.</p>
                    <span>Este usuário ainda não possui movimentações de EPI.</span>
                </div>

                <div class="print-only signature-footer">
                    <div class="signature-block">
                        <div class="line"></div>
                        <p><strong>{{ nomeSelecionado }}</strong></p>
                        <p>Assinatura do Colaborador</p>
                    </div>
                </div>

            </div>

            <div class="empty-state initial-state no-print" v-else>
                <span class="empty-icon"><img src="../assets/icons_sideBar/perfil_user.png"
                        alt="Nenhum usuário selecionado"></span>
                <p>Selecione um usuário acima.</p>
                <span>A ficha NR-6 será carregada automaticamente.</span>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '../composable/useSupabase'

const { supabase } = useSupabase()

const usuarios = ref([])
const historico = ref([])
const selectedUserId = ref('')
const isLoadingUsers = ref(true)
const isLoading = ref(false)

// Pega a data de hoje formatada para o cabeçalho do documento
const dataHoje = computed(() => {
    return new Date().toLocaleDateString('pt-BR')
})

// Encontra o nome do usuário selecionado para colocar no título do documento
const nomeSelecionado = computed(() => {
    const user = usuarios.value.find(u => u.id === selectedUserId.value)
    return user ? user.nome : ''
})

// Busca a lista de usuários para preencher o select
const fetchUsuarios = async () => {
    isLoadingUsers.value = true
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, nome')
            .order('nome')

        if (error) throw error
        usuarios.value = data
    } catch (error) {
        console.error('Erro ao carregar usuários:', error.message)
    } finally {
        isLoadingUsers.value = false
    }
}

// Busca o histórico apenas do usuário selecionado
const buscarHistorico = async () => {
    if (!selectedUserId.value) return

    isLoading.value = true
    try {
        const { data, error } = await supabase
            .from('entrega_epis')
            .select(`
        id, created_at, quantidade, data_devolucao,
        epis (nome, ca)
      `)
            .eq('usuario_id', selectedUserId.value)
            .order('created_at', { ascending: false })

        if (error) throw error
        historico.value = data
    } catch (error) {
        console.error('Erro ao buscar histórico:', error.message)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchUsuarios()
})

const formatarData = (dataString) => {
    if (!dataString) return ''
    return new Date(dataString).toLocaleDateString('pt-BR')
}

// Função nativa do navegador para imprimir/salvar PDF
const imprimirFicha = () => {
    window.print()
}
</script>

<style scoped>
/* Layout */
.nr6-page {
    animation: fadeIn 0.4s ease-out;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
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

.panel {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.04);
    padding: 24px;
}

/* ─── Filtro ─── */
.filter-bar {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f3f6;
    max-width: 400px;
}

.input-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #4a5a6a;
    margin-bottom: 8px;
}

select {
    width: 100%;
    padding: 12px;
    border: 1.5px solid #e0e6eb;
    border-radius: 8px;
    font-size: 14px;
    background: #f9fbfc;
    transition: 0.2s;
    outline: none;
}

select:focus {
    border-color: #3498db;
    background: #fff;
}

/* Cabeçalho do Documento */
.doc-header {
    margin-bottom: 24px;
    padding: 20px;
    background: #f8f9fb;
    border: 1px solid #eef2f5;
    border-radius: 8px;
}

.doc-header h2 {
    font-size: 18px;
    color: #1a2533;
    text-align: center;
    margin-bottom: 16px;
}

.doc-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 14px;
    color: #2c3e50;
}

.doc-legal {
    font-size: 12px;
    color: #5a6a78;
    line-height: 1.5;
    text-align: justify;
}

/* Tabela */
.table-container {
    overflow-x: auto;
}

.nr6-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 700px;
}

.nr6-table th {
    background: #f4f7fb;
    color: #5a6a78;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 14px;
    text-align: left;
    border-bottom: 2px solid #e0e6eb;
}

.nr6-table td {
    padding: 14px;
    border-bottom: 1px solid #f0f3f6;
    font-size: 13px;
    color: #2c3e50;
    vertical-align: middle;
}

.nr6-table tr:hover td {
    background: #fcfcfd;
}

/* Badges */
.status-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
}

.status-badge.active {
    background: rgba(46, 204, 113, 0.15);
    color: #1a9950;
}

.status-badge.returned {
    background: rgba(0, 0, 0, 0.06);
    color: #7a8a96;
}

.btn-secondary {
    background: #fff;
    border: 1.5px solid #dce2e8;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #2c3e50;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-secondary:hover:not(:disabled) {
    background: #f8f9fb;
    border-color: #b8c4cc;
}

.btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #a0aab4;
}

.initial-state {
    padding: 60px 20px;
}

.empty-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 16px;
    opacity: 0.6;
}

.loading-state {
    text-align: center;
    padding: 40px;
    color: #5a6a78;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #e0e6eb;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* A coluna de assinatura fica escondida na tela e só aparece na iompressão */
.print-only {
    display: none;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
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

/*  impressão */
@media print {

    /* Esconde tudo na tela, exceto o conteúdo do relatorio */
    body * {
        visibility: hidden;
    }

    .nr6-page,
    .nr6-page * {
        visibility: visible;
    }

    /* Esconde elementos específicos de navegação (Garante que a sidebar suma) */
    .no-print,
    aside,
    nav,
    .sidebar,
    #app>div:first-child {
        display: none !important;
    }

    /* Reposiciona a página para o topo esquerdo do papel */
    .nr6-page {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 0 !important;
        margin: 0 !important;
    }

    .panel {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
    }

    /* Formata o documento para  A4 */
    .doc-header {
        border: 2px solid #000;
        background: #fff;
        margin-top: 0;
    }

    .nr6-table {
        border: 1px solid #000;
        width: 100%;
        margin-bottom: 40px;
    }

    .nr6-table th,
    .nr6-table td {
        border: 1px solid #000 !important;
        color: #000 !important;
        padding: 8px !important;
        font-size: 11px;
    }

    .status-badge {
        background: none !important;
        color: #000 !important;
        padding: 0 !important;
        border: none !important;
    }

    /* Estilização da assinatura no rodape do pdf */
    .print-only {
        display: block !important;
    }

    .signature-footer {
        display: flex;
        justify-content: space-around;
        margin-top: 60px;
        page-break-inside: avoid;
        /* Evita que a assinatura corte no meio da folha */
    }

    .signature-block {
        text-align: center;
        width: 40%;
    }

    .signature-block .line {
        border-top: 1px solid #000;
        margin-bottom: 8px;
    }

    .signature-block p {
        margin: 4px 0;
        font-size: 12px;
        color: #000;
    }
}
</style>


<style>
/* A sidebar não estava escondendo por conta do style scoped,
   sendo necessário colocar esse estilo global para garantir que ela suma na impressão
*/

@media print {
  /* Esconde a Sidebar */
  body * {
    visibility: hidden;
  }
  
  /* Força menus, navbars e sidebars a desaparecerem */
  nav, aside, .sidebar, .menu, header:not(.doc-header) {
    display: none !important;
  }
  .nr6-page, .nr6-page * {
    visibility: visible;
  }

  /* Move a ficha pro topo esquerdo do papel, ocupando tudo */
  .nr6-page {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    margin: 0 !important;
    padding: 20px !important;
  }

  /* Oculta os botões e filtros na hora de imprimir */
  .no-print {
    display: none !important;
  }
}
</style>