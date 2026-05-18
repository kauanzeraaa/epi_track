<template>
    <div class="alerts-page">

        <header class="page-header">
            <div class="header-text">
                <h1>Central de Alertas</h1>
                <p>Monitore vencimentos de C.A. e reposição de estoque.</p>
            </div>

            <div class="header-chips">
                <span class="chip danger" v-if="alertasPendentes.length > 0">
                    <span class="pulse-dot"></span>
                    {{ alertasPendentes.length }} pendentes
                </span>
                <span class="chip success" v-else>
                    Tudo sob controle!
                </span>
            </div>
        </header>

        <div class="alerts-layout">

            <div class="alerts-toolbar">
                <button class="tab-btn" :class="{ active: filtroStatus === 'Pendente' }"
                    @click="filtroStatus = 'Pendente'">
                    <img :src="iconAtencao" alt="Atenção" class="tab-icon" />
                    Requer Atenção ({{ alertasPendentes.length }})
                </button>
                
                <button class="tab-btn" :class="{ active: filtroStatus === 'Resolvido' }"
                    @click="filtroStatus = 'Resolvido'">
                    <img :src="iconResolvido" alt="Resolvido" class="tab-icon" />
                    Resolvidos ({{ alertasResolvidos.length }})
                </button>
            </div>

            <div class="alerts-body">

                <div v-if="isLoading" class="loading-state">
                    <span class="spinner"></span> Carregando alertas...
                </div>

                <div v-else-if="alertasFiltrados.length === 0" class="empty-state">
                    <span class="empty-icon">{{ filtroStatus === 'Pendente' ? '' : '' }}</span>
                    <p>{{ filtroStatus === 'Pendente' ? 'Nenhum problema detectado!' : 'Nenhum alerta resolvido ainda.'
                        }}</p>
                    <span>{{ filtroStatus === 'Pendente' ? 'Estoque e validades estão em dia.' : 'O histórico de resoluções aparecerá aqui.'
                        }}</span>
                </div>

                <div v-else class="alerts-grid">
                    <div v-for="alerta in alertasFiltrados" :key="alerta.id" class="alert-card"
                        :class="getAlertClass(alerta)">
                    <div class="alert-icon">
                        <img
                            :src="alerta.tipo_alerta === 'CA Vencido' ? iconCalendar : iconEntrega"
                            alt="Ícone do alerta"
                            class="img-alerta"
                        />
                    </div>

                        <div class="alert-content">
                            <div class="alert-header">
                                <span class="alert-type">{{ alerta.tipo_alerta }}</span>
                                <span class="alert-date">{{ formatarData(alerta.created_at) }}</span>
                            </div>

                            <h3 class="alert-title">{{ alerta.epis?.nome || 'EPI Desconhecido' }}</h3>

                            <p class="alert-details" v-if="alerta.tipo_alerta === 'Estoque Baixo'">
                                Estoque atual: <strong>{{ alerta.epis?.estoque_atual }}</strong> / Mínimo: {{
                                alerta.epis?.estoque_minimo }}
                            </p>
                            <p class="alert-details" v-if="alerta.tipo_alerta === 'CA Vencido'">
                                C.A. {{ alerta.epis?.ca }} venceu em <strong>{{ formatarData(alerta.epis?.validade_ca,
                                    false) }}</strong>
                            </p>
                        </div>

                        <div class="alert-actions" v-if="alerta.status === 'Pendente'">
                            <router-link to="/catalog" class="btn-resolve">
                                {{ alerta.tipo_alerta === 'CA Vencido' ? 'Atualizar C.A. no Catálogo' : 'Repor Estoque' }}
                            </router-link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '../composable/useSupabase'
import iconCalendar from '../assets/calendar.png'
import iconEntrega from '../assets/icons_sideBar/entrega_epis.png'
import iconAtencao from '../assets/atencao.png'
import iconResolvido from '../assets/aceitar.png'

const { supabase } = useSupabase()

const alertas = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const filtroStatus = ref('Pendente')

// Computadas para facilitar a interface
const alertasPendentes = computed(() => alertas.value.filter(a => a.status === 'Pendente'))
const alertasResolvidos = computed(() => alertas.value.filter(a => a.status === 'Resolvido'))

const alertasFiltrados = computed(() => {
    return filtroStatus.value === 'Pendente' ? alertasPendentes.value : alertasResolvidos.value
})

const fetchAlertas = async () => {
    isLoading.value = true
    try {
        // chama a função do banco que verifica se o ca esta vencido
        await supabase.rpc('verificar_ca_vencido')
        // comando rpc (Remote Procedure Call) é a forma que o supabase usa para rodar funções que estão guardadas dentro do banco

        const { data, error } = await supabase
            .from('alertas')
            .select(`
                *,
                epis (nome, ca, validade_ca, estoque_atual, estoque_minimo)
            `)
            .order('status', { ascending: true })
            .order('created_at', { ascending: false })
            .limit(30)

        if (error) throw error
        alertas.value = data
    } catch (error) {
        console.error('Erro ao buscar alertas:', error.message)
    } finally {
        isLoading.value = false
    }
}

const getAlertClass = (alerta) => {
    if (alerta.status === 'Resolvido') return 'card-resolved'
    if (alerta.tipo_alerta === 'CA Vencido') return 'card-danger'
    if (alerta.tipo_alerta === 'Estoque Baixo') return 'card-warning'
    return ''
}

const formatarData = (dataString, comHora = true) => {
    if (!dataString) return ''
    const data = new Date(dataString)
    if (comHora) {
        return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

onMounted(() => fetchAlertas())
</script>

<style scoped>
.alerts-page {
    animation: fadeIn 0.4s ease-out;
}

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
}

.chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
}

.chip.danger {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
}

.chip.success {
    background: rgba(39, 174, 96, 0.1);
    color: #27ae60;
}

.pulse-dot {
    width: 8px;
    height: 8px;
    background: #e74c3c;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7);
    animation: pulse 1.5s infinite;
}

.alerts-layout {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.04);
    overflow: hidden;
}

.alerts-toolbar {
    display: flex;
    border-bottom: 1px solid #f0f3f6;
    background: #f8fafc;
}

.tab-btn {
    flex: 1;
    padding: 16px;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: #8896a3;
    cursor: pointer;
    transition: 0.2s;
    border-bottom: 3px solid transparent;
    
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.tab-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.tab-btn:hover {
    color: #2c3e50;
    background: #f0f4f8;
}

.tab-btn.active {
    color: #1a2533;
    border-bottom-color: #3498db;
    background: #fff;
}

.alerts-body {
    padding: 24px;
    min-height: 400px;
}

.alerts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
}

.alert-card {
    display: flex;
    flex-direction: column;
    padding: 18px;
    border-radius: 12px;
    border-left: 4px solid #dce2e8;
    background: #f9fbfc;
    transition: 0.2s;
    position: relative;
}

.alert-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-danger {
    border-left-color: #e74c3c;
    background: rgba(231, 76, 60, 0.02);
    border-top: 1px solid rgba(231, 76, 60, 0.1);
    border-right: 1px solid rgba(231, 76, 60, 0.1);
    border-bottom: 1px solid rgba(231, 76, 60, 0.1);
}

.card-warning {
    border-left-color: #f39c12;
    background: rgba(243, 156, 18, 0.02);
    border-top: 1px solid rgba(243, 156, 18, 0.1);
    border-right: 1px solid rgba(243, 156, 18, 0.1);
    border-bottom: 1px solid rgba(243, 156, 18, 0.1);
}

.card-resolved {
    border-left-color: #27ae60;
    opacity: 0.7;
}

.alert-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.alert-type {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #1a2533;
}

.card-danger .alert-type {
    color: #e74c3c;
}

.card-warning .alert-type {
    color: #d68910;
}

.alert-date {
    font-size: 11px;
    color: #a0aab4;
}

.alert-title {
    margin: 0 0 8px;
    font-size: 15px;
    font-weight: 700;
    color: #1a2533;
}

.alert-details {
    margin: 0;
    font-size: 13px;
    color: #5a6a78;
}

.alert-actions {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed #e0e6eb;
    display: flex;
    justify-content: flex-end;
}

.btn-resolve {
    background: #fff;
    border: 1.5px solid #dce2e8;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #2c3e50;
    cursor: pointer;
    transition: 0.2s;
    text-decoration: none;
    display: inline-block;
    text-align: center;
}

.btn-resolve:hover {
    background: #27ae60;
    border-color: #27ae60;
    color: #fff;
}

.loading-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: #8896a3;
}

.spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #e0e6eb;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 10px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
}

.empty-state p {
    font-size: 16px;
    font-weight: 700;
    color: #4a5a6a;
    margin: 0 0 6px;
}

.empty-state span {
    font-size: 14px;
}

.img-alerta {
    width: 32px;
    height: 32px;
    object-fit: contain;
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

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7);
    }

    70% {
        box-shadow: 0 0 0 6px rgba(231, 76, 60, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
    }
}
</style>