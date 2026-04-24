<template>
    <div class="profile-page">

        <header class="page-header">
            <div class="header-text">
                <h1>{{ isAdmin ? 'Gerenciamento de Usuários' : 'Meu Perfil' }}</h1>
                <p v-if="isAdmin">Gerencie os acessos, perfis e informações de todos cadastrados.</p>
                <p v-else>Visualize e edite suas informações pessoais.</p>
            </div>

            <div class="header-chips" v-if="isAdmin">
                <span class="chip blue">
                    <img src="../assets/icons_sideBar/perfil_user.png" alt="">
                    {{ quantidadeUsuarios }} cadastrados
                </span>
            </div>
        </header>

        <div class="profile-layout" :class="{ 'admin-view': isAdmin, 'user-view': !isAdmin }">

            <section class="panel list-panel" v-if="isAdmin">
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

                    <div v-else class="user-list">
                        <div v-for="user in usuarios" :key="user.id" class="user-card"
                            :class="{ 'active': form.id === user.id }" @click="selecionarUsuario(user)">
                            <div class="user-avatar" :class="user.tipo_usuario.toLowerCase()">
                                {{ user.nome.charAt(0).toUpperCase() }}
                            </div>
                            <div class="user-info">
                                <h4>{{ user.nome }}</h4>
                                <div class="user-badges">
                                    <span class="badge-role">{{ user.tipo_usuario }}</span>
                                    <span v-if="user.perfil_acesso === 'Administrador'" class="badge-admin">Admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <aside class="panel form-panel">
                <div class="form-panel-header">
                    <div class="form-title-wrap">
                        <span class="form-panel-dot"></span>
                        <h3>{{ isAdmin && form.id ? 'Editar Cadastro' : (isAdmin ? 'Selecione um usuário' : 'Meus Dados') }}</h3>
                    </div>
                </div>

                <form @submit.prevent="salvarUsuario" class="profile-form" v-if="form.id || !isAdmin">

                    <h4 class="section-title">Dados Gerais</h4>
                    <div class="form-section">
                        <div class="input-group">
                            <label>Nome Completo</label>
                            <input v-model="form.nome" type="text" required :disabled="!isAdmin && form.nome !== ''" />
                        </div>

                        <div class="input-row">
                            <div class="input-group">
                                <label>Celular</label>
                                <input v-model="form.celular" type="text" placeholder="(11) 99999-9999" />
                            </div>
                            <div class="input-group">
                                <label>Tipo de Vínculo</label>
                                <select v-model="form.tipo_usuario" required :disabled="!isAdmin">
                                    <option value="Funcionario">Funcionário</option>
                                    <option value="Aluno">Aluno</option>
                                    <option value="Visitante">Visitante</option>
                                </select>
                            </div>
                        </div>

                        <div class="input-row" v-if="isAdmin">
                            <div class="input-group">
                                <label>Perfil do Sistema</label>
                                <select v-model="form.perfil_acesso" required>
                                    <option value="Comum">Comum</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Status</label>
                                <select v-model="form.status" required>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div v-if="form.tipo_usuario === 'Funcionario'" class="dynamic-section">
                        <h4 class="section-title">Dados do RH</h4>
                        <div class="input-row">
                            <div class="input-group">
                                <label>Matrícula</label>
                                <input v-model="form.func_matricula" type="text" required />
                            </div>
                            <div class="input-group">
                                <label>Departamento</label>
                                <input v-model="form.func_departamento" type="text" required />
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Cargo</label>
                            <input v-model="form.func_cargo" type="text" required />
                        </div>
                    </div>

                    <div v-if="form.tipo_usuario === 'Aluno'" class="dynamic-section">
                        <h4 class="section-title">Dados Acadêmicos</h4>
                        <div class="input-row">
                            <div class="input-group">
                                <label>Matrícula Acadêmica</label>
                                <input v-model="form.aluno_matricula" type="text" required />
                            </div>
                            <div class="input-group">
                                <label>Turma</label>
                                <input v-model="form.aluno_turma" type="text" required />
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Curso</label>
                            <input v-model="form.aluno_curso" type="text" required />
                        </div>
                    </div>

                    <div v-if="form.tipo_usuario === 'Visitante'" class="dynamic-section">
                        <h4 class="section-title">Controle de Portaria</h4>
                        <div class="input-row">
                            <div class="input-group">
                                <label>CPF</label>
                                <input v-model="form.vis_cpf" type="text" required />
                            </div>
                            <div class="input-group">
                                <label>Empresa de Origem</label>
                                <input v-model="form.vis_empresa" type="text" />
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Motivo da Visita</label>
                            <input v-model="form.vis_motivo" type="text" required />
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary" :disabled="isSaving">
                            <span v-if="isSaving" class="btn-loading"></span>
                            {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
                        </button>
                    </div>
                </form>

                <div v-else class="empty-state">
                    <span class="empty-icon">👈</span>
                    <p>Selecione um usuário na lista</p>
                    <span>As informações dele aparecerão aqui para edição.</span>
                </div>

            </aside>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../composable/useAuthStore';
import { useSupabase } from '../composable/useSupabase';

const { userProfile } = useAuthStore();
const { supabase } = useSupabase();

// variavel para armazenar se usuario é administrador ou nao
const isAdmin = computed(() => userProfile.value?.perfil.acesso === 'Administrador')

const isSaving = ref(true)
const isLoading = ref(true)
const usuarios = ref([])

// variavel para armazenar a quantidade de usuarios cadastradas
const quantidadeUsuarios = computed(() => usuarios.value.length)

// formulario reativo
const form = reactive({
    id: '',
    nome: '',
    celular: '',
    tipo_usuario: '',
    perfil_acesso: 'Comum',
    statu: 'Ativo',

    // Funcionario
    func_matricula: '',
    func_cargo: '',
    func_departamento: '',

    // Aluno
    aluno_matricula: '',
    aluno_curso: '',
    aluno_turma: '',

    // Visitante
    vis_cpf: '',
    vis_motivo: '',
    vis_empresaOrigem: '',
})

// função para buscar os usuarios cadastrados no banco de dados
const fetchUsuarios = async () => {
    isLoading.value = true

    try {
        let query = supabase
            .from('usuarios')
            .select(`
                *,
                funcionarios(matricula, cargo, departamento),
                aluno(matricula, curso, turma),
                visitante(cpf, motivo_visita, empresa_origem)
            `)

        if (!isAdmin.value) {
            query = query.eq('id', userProfile.value.id)
        }

        const { data, error } = await query.order('nome')

        if (error) throw error

        usuarios.value = data

        if (!isAdmin.value && data.length > 0) {
            selecionarUsuario(data[0])
        }

    } catch (error) {
        console.log('Erro ao buscar usuários:', error.message)
    } finally {
        isLoading.value = false
    }
}

const limparForm = () => {
    Object.keys(form).forEach(key => form[key] = '')
    form.tipo_usuario = 'Funcionario'
    form.perfil_acesso = 'Comum'
    form.statu = 'Ativo'
}

// salva os dados dos usuarios no formulario
const selecionarUsuario = (usuario) => {
    // antes, limpa o formulario
    limparForm()

    form.id = usuario.id
    form.nome = usuario.nome
    form.celular = usuario.celular
    form.tipo_usuario = usuario.tipo_usuario
    form.perfil_acesso = usuario.perfil_acesso
    form.ativo = usuario.ativo

    if (usuario.tipo_usuario === 'Funcionario' && usuario.funcionarios) {
        const f = Array.isArray(usuario.funcionarios) ? usuario.funcionarios[0] : usuario.funcionarios
        form.matricula = f?.matricula || ''
        form.cargo = f?.cargo || ''
        form.departamento = f?.departamento || ''
    }
    else if (usuario.tipo_usuario === 'Aluno' && usuario.alunos) {
        const a = Array.isArray(usuario.alunos) ? usuario.alunos[0] : usuario.alunos
        form.matricula = a?.matricula || ''
        form.curso = a?.curso || ''
        form.turma = a?.turma || ''
    }
    else if (usuario.tipo_usuario === 'Visitante' && usuario.visitantes) {
        const v = Array.isArray(usuario.visitantes) ? usuario.visitantes[0] : usuario.visitantes
        form.cpf = v?.cpf || ''
        form.motivo = v?.motivo || ''
        form.empresaOrigem = v?.empresaOrigem || ''
    }
}

const salvarUsuario = async () => {
    if (!form.id) {
        alert('Nenhum usuário selecionado para salvar.')
        return
    }
    isSaving.value = true
        
    try {
        
    } catch (error) {
        console.error('Erro ao salvar usuário:', error.message)
    } finally {
        isSaving.value = false
    }
}

onMounted(() => fetchUsuarios())

</script>

<style scoped>
.profile-page {
    animation: fadeIn 0.4s ease-out;
}

.page-header {
    display: flex;
    justify-content: space-between;
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

.profile-layout {
    display: grid;
    gap: 24px;
    align-items: start;
}

.profile-layout.admin-view {
    grid-template-columns: 320px 1fr;
}

.profile-layout.user-view {
    grid-template-columns: 1fr;
    max-width: 700px;
    margin: 0 auto;
}

.panel {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.04);
    overflow: hidden;
}

/* Lista da Esquerda */
.list-body {
    max-height: 70vh;
    overflow-y: auto;
}

.user-list {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.user-card {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px;
    background: #f8f9fb;
    border: 1px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s;
}

.user-card:hover {
    background: #fff;
    border-color: #dce2e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.user-card.active {
    background: #fff;
    border-color: #3498db;
    box-shadow: 0 2px 12px rgba(52, 152, 219, 0.15);
}

/* Cores do Avatar por Tipo */
.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    color: #fff;
    flex-shrink: 0;
}

.user-avatar.funcionario {
    background: linear-gradient(135deg, #2c3e50, #34495e);
}

.user-avatar.aluno {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
}

.user-avatar.visitante {
    background: linear-gradient(135deg, #e67e22, #f39c12);
}

.user-info {
    min-width: 0;
    flex: 1;
}

.user-info h4 {
    margin: 0 0 4px;
    font-size: 13px;
    color: #1a2533;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-badges {
    display: flex;
    gap: 6px;
}

.badge-role {
    font-size: 10px;
    font-weight: 600;
    color: #5a6a78;
    background: #e8edf2;
    padding: 2px 6px;
    border-radius: 4px;
}

.badge-admin {
    font-size: 10px;
    font-weight: 700;
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
}

/* Formulário da Direita */
.form-panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f3f6;
}

.form-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-panel-dot {
    width: 10px;
    height: 10px;
    background: #3498db;
    border-radius: 50%;
}

.form-panel-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1a2533;
}

.profile-form {
    padding: 24px;
}

.section-title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    color: #a0aab4;
    margin: 0 0 16px 0;
}

.form-section {
    margin-bottom: 24px;
}

.dynamic-section {
    animation: fadeIn 0.3s ease-out;
    background: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    border: 1px dashed #dce2e8;
    margin-bottom: 24px;
}

.divider {
    height: 1px;
    background: #f0f3f6;
    margin: 24px 0;
}

.input-group {
    margin-bottom: 14px;
    flex: 1;
}

.input-row {
    display: flex;
    gap: 16px;
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
    padding: 11px 14px;
    border: 1.5px solid #e0e6eb;
    border-radius: 8px;
    font-size: 13px;
    color: #1a2533;
    background: #f9fbfc;
    transition: 0.2s;
    box-sizing: border-box;
}

input:focus,
select:focus {
    outline: none;
    border-color: #3498db;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

input:disabled,
select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    border-top: 1px solid #f0f3f6;
}

.btn-primary {
    background: #2C3E50;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    align-items: center;
}

.btn-primary:hover:not(:disabled) {
    background: #1a2533;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-loading {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #8896a3;
}

.empty-icon {
    font-size: 40px;
    display: block;
    margin-bottom: 12px;
    opacity: 0.5;
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

@media (max-width: 900px) {
    .profile-layout.admin-view {
        grid-template-columns: 1fr;
    }

    .input-row {
        flex-direction: column;
        gap: 0;
    }
}
</style>