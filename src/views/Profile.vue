<template>
    <div class="profile-page">

        <transition name="toast-slide">
            <div v-if="toast.visible" class="toast" :class="toast.type">
                <div class="toast-icon-wrap">
                    <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <span>{{ toast.message }}</span>
            </div>
        </transition>

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
                <div class="list-header">
                    <span class="list-header-title">Usuários</span>

                    <button @click.stop="createUser()" class="create-user">Novo</button>

                    <div class="search-wrap">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input v-model="searchQuery" type="text" placeholder="Buscar usuário..." class="search-input" />
                    </div>
                </div>

                <div class="list-body">
                    <div v-if="isLoading" class="skeleton-list">
                        <div v-for="n in 5" :key="n" class="skeleton-card">
                            <div class="skeleton skeleton-icon"></div>
                            <div class="skeleton-lines">
                                <div class="skeleton skeleton-line long"></div>
                                <div class="skeleton skeleton-line short"></div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="filteredUsuarios.length === 0" class="list-empty">
                        <p>Nenhum resultado para "<strong>{{ searchQuery }}</strong>"</p>
                    </div>

                    <div v-else class="user-list">
                        <div v-for="user in filteredUsuarios" :key="user.id" class="user-card"
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
                            <div class="status-dot" :class="user.status === 'Ativo' ? 'dot-active' : 'dot-inactive'" :title="user.status"></div>
                        </div>
                    </div>
                </div>
            </section>

            <aside class="panel form-panel">
                <div class="form-panel-header">
                    <div class="form-title-wrap">
                        <span class="form-panel-dot"></span>
                        <h3>{{ isAdmin && form.id ? 'Editar Cadastro' : (isAdmin && isCreating ? 'Novo Usuário' : (isAdmin ? 'Selecione um usuário' : 'Meus Dados')) }}</h3>
                    </div>
                </div>

                <form @submit.prevent="salvarUsuario" class="profile-form" v-if="form.id || !isAdmin || isCreating">

                    <div class="image-upload-area" :class="{ 'has-image': imagePreview }">
                        <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="image-preview" />
                        <div v-else class="upload-placeholder">
                            <span class="upload-icon"><img src="../assets/digital-camera.png" alt="" class="digital-cam"></span>
                            <p>Foto do usuário</p>
                            <span>Clique para selecionar</span>
                        </div>
                        <input type="file" @change="handleFileChange" accept="image/*" class="file-input" />
                    </div>

                    <div class="profile-hero">
                        <div class="hero-avatar" :class="form.tipo_usuario?.toLowerCase()">
                            {{ form.nome?.charAt(0)?.toUpperCase() || '?' }}
                        </div>
                        <div class="hero-meta">
                            <p class="hero-name">{{ form.nome || '—' }}</p>
                            <div class="hero-badges">
                                <span v-if="form.tipo_usuario" class="badge-role">{{ form.tipo_usuario }}</span>
                                <span v-if="form.perfil_acesso === 'Administrador'" class="badge-admin">Admin</span>
                                <span v-if="form.status" class="badge-status" :class="form.status === 'Ativo' ? 'status-active' : 'status-inactive'">{{ form.status }}</span>
                            </div>
                        </div>
                    </div>

                    <h4 class="section-title">Dados Gerais</h4>
                    <div class="form-section">
                        <div class="input-group">
                            <label>Nome Completo</label>
                            <input v-model="form.nome" type="text" required :disabled="!isAdmin" />
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

                    <h4 class="section-title">Acesso ao Sistema</h4>
                    <div class="form-section">
                        <div class="input-group">
                            <label>E-mail</label>
                            <input v-model="form.email" type="email" :required="isCreating" :disabled="!isAdmin && !isCreating" placeholder="usuario@exemplo.com" />
                        </div>

                        <template v-if="isCreating">
                            <div class="input-row">
                                <div class="input-group">
                                    <label>Senha Temporária</label>
                                    <input v-model="form.senha" type="password" required autocomplete="new-password" />
                                </div>
                                <div class="input-group">
                                    <label>Confirmar Senha</label>
                                    <input v-model="form.confirmar_senha" type="password" required autocomplete="new-password" />
                                </div>
                            </div>
                        </template>

                        <template v-else>
                            <div class="input-row">
                                <div class="input-group">
                                    <label>Nova Senha</label>
                                    <input v-model="form.nova_senha" type="password" placeholder="Deixe em branco para não alterar" autocomplete="new-password" />
                                </div>
                                <div class="input-group">
                                    <label>Confirmar Nova Senha</label>
                                    <input v-model="form.confirmar_senha" type="password" placeholder="Repita a nova senha" autocomplete="new-password" />
                                </div>
                            </div>
                        </template>
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
                            {{ isSaving ? 'Salvando...' : (isCreating ? 'Cadastrar Usuário' : 'Salvar Alterações') }}
                        </button>
                    </div>

                </form>

                <div v-else class="empty-state">
                    <div class="empty-illustration">
                        <img src="../assets/user.png" alt="Foto Usuário" class="user-img">
                    </div>
                    <p class="empty-title">Nenhum usuário selecionado</p>
                    <span class="empty-hint">Clique em um usuário na lista ao lado para visualizar e editar seus dados.</span>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAuthStore } from '../composable/useAuthStore';
import { useSupabase } from '../composable/useSupabase';

const { userProfile, currentUser, fetchUserProfile } = useAuthStore();
const { supabase } = useSupabase();

const isAdmin = computed(() => userProfile.value?.perfil_acesso === 'Administrador')

const isSaving = ref(false)
const isLoading = ref(true)
const usuarios = ref([])
const searchQuery = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const isCreating = ref(false)

const quantidadeUsuarios = computed(() => usuarios.value.length)

const filteredUsuarios = computed(() => {
    if (!searchQuery.value.trim()) return usuarios.value
    const q = searchQuery.value.toLowerCase()
    return usuarios.value.filter(u => u.nome.toLowerCase().includes(q))
})

const toast = reactive({ visible: false, message: '', type: 'success' })
let toastTimeout = null
let timerToast = 5000 // alterar tempo de mensagem na tela

const showNotification = (message, type = 'success') => {
    clearTimeout(toastTimeout)
    toast.message = message
    toast.type = type
    toast.visible = true
    toastTimeout = setTimeout(() => { toast.visible = false }, timerToast)
}

const form = reactive({
    id: '',
    email: '',
    nome: '',
    celular: '',
    tipo_usuario: '',
    perfil_acesso: 'Comum',
    status: 'Ativo',
    senha: '',
    nova_senha: '',
    confirmar_senha: '',
    func_matricula: '',
    func_cargo: '',
    func_departamento: '',
    aluno_matricula: '',
    aluno_curso: '',
    aluno_turma: '',
    vis_cpf: '',
    vis_motivo: '',
    vis_empresa: '',
})

const fetchUsuarios = async () => {
    isLoading.value = true
    try {
        let query = supabase
            .from('usuarios')
            .select(`
                *,
                funcionarios(matricula, cargo, departamento),
                alunos(matricula, curso, turma),
                visitantes(cpf, motivo_visita, empresa_origem)
            `)

        if (!isAdmin.value) {
            query = query.eq('id', userProfile.value.id)
        }

        const { data, error } = await query
            .order('status', { ascending: true })
            .order('nome', { ascending: true })
        if (error) throw error

        usuarios.value = data

        if (!isAdmin.value && data.length > 0) {
            await selecionarUsuario(data[0])
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
    form.status = 'Ativo'
}

const limparSenhas = () => {
    form.senha = ''
    form.nova_senha = ''
    form.confirmar_senha = ''
}

const selecionarUsuario = async (usuario) => {
    isCreating.value = false
    imageFile.value = null
    imagePreview.value = usuario.foto_perfil || null
    limparForm()
    form.id = usuario.id
    form.nome = usuario.nome
    form.celular = usuario.celular
    form.tipo_usuario = usuario.tipo_usuario
    form.perfil_acesso = usuario.perfil_acesso
    form.status = usuario.status

    // Se for o próprio usuário logado, pega o e-mail dele. Se for outro, deixa em branco por segurança.
    if (usuario.id === currentUser.value?.id) {
        form.email = currentUser.value.email || ''
    } else {
        form.email = '' 
    }

    if (usuario.tipo_usuario === 'Funcionario' && usuario.funcionarios) {
        const f = Array.isArray(usuario.funcionarios) ? usuario.funcionarios[0] : usuario.funcionarios
        form.func_matricula = f?.matricula || ''
        form.func_cargo = f?.cargo || ''
        form.func_departamento = f?.departamento || ''
    } else if (usuario.tipo_usuario === 'Aluno' && usuario.alunos) {
        const a = Array.isArray(usuario.alunos) ? usuario.alunos[0] : usuario.alunos
        form.aluno_matricula = a?.matricula || ''
        form.aluno_curso = a?.curso || ''
        form.aluno_turma = a?.turma || ''
    } else if (usuario.tipo_usuario === 'Visitante' && usuario.visitantes) {
        const v = Array.isArray(usuario.visitantes) ? usuario.visitantes[0] : usuario.visitantes
        form.vis_cpf = v?.cpf || ''
        form.vis_motivo = v?.motivo_visita || ''
        form.vis_empresa = v?.empresa_origem || ''
    }
}

const salvarUsuario = async () => {
    if (!form.id && !isCreating.value) {
        showNotification('Nenhum usuário selecionado para salvar.', 'error')
        return
    }

    if (isCreating.value) {
        if (!form.email) {
            showNotification('Informe o e-mail de acesso.', 'error')
            return
        }
        if (!form.senha) {
            showNotification('Informe a senha temporária.', 'error')
            return
        }
        if (form.senha !== form.confirmar_senha) {
            showNotification('As senhas não conferem.', 'error')
            return
        }
    }

    if (!isCreating.value && form.nova_senha) {
        if (form.nova_senha !== form.confirmar_senha) {
            showNotification('As senhas não conferem.', 'error')
            return
        }
        if (form.nova_senha.length < 6) {
            showNotification('A nova senha deve ter pelo menos 6 caracteres.', 'error')
            return
        }
    }

    isSaving.value = true

    try {
        if (!isCreating.value && isAdmin.value && form.status === 'Inativo'){
            const { count, error: countError} = await supabase
                .from('entrega_epis')
                .select('*', {count: 'exact', head: true})
                .eq('usuario_id', form.id)
                .is('data_devolucao', null)

            if (countError) throw countError

            if (count > 0) {
                showNotification(`Não é possível inativar o usuário. Ele possui ${count} EPI(s) pendente(s) de devolução.`, 'error')
                isSaving.value = false
                return 
            }
        }

        let publicImageUrl = null

        if (imageFile.value) {
            const fileExt = imageFile.value.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `user_photos/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, imageFile.value)

            if (uploadError) throw uploadError

            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)
            publicImageUrl = urlData.publicUrl
        }

        const payloadUsuario = {
            nome: form.nome,
            celular: form.celular,
            tipo_usuario: form.tipo_usuario,
            ...(isAdmin.value && {
                perfil_acesso: form.perfil_acesso,
                status: form.status
            })
        }

        if (publicImageUrl) {
            payloadUsuario.foto_perfil = publicImageUrl
        }

        let userId = form.id

        if (isCreating.value) {
            // Chama a Edge Function segura na nuvem
            const { data, error: functionError } = await supabase.functions.invoke('criar-usuario', {
                body: { email: form.email, password: form.senha }
            })

            if (functionError || data?.error) {
                throw new Error('Erro ao criar acesso: ' + (functionError?.message || data?.error))
            }

            userId = data.userId
            
            const { error: errorUsuario } = await supabase
                .from('usuarios')
                .upsert({ id: userId, ...payloadUsuario })

            if (errorUsuario) throw new Error('Erro ao criar cadastro: ' + errorUsuario.message)
        } else {
            const { error: errorUsuario } = await supabase
                .from('usuarios')
                .update(payloadUsuario)
                .eq('id', form.id)

            if (errorUsuario) throw new Error('Erro ao salvar dados: ' + errorUsuario.message)

            // Permite alterar a senha APENAS se o usuário estiver editando a si mesmo
            if (form.nova_senha) {
                if (form.id === currentUser.value?.id) {
                    const { error } = await supabase.auth.updateUser({ password: form.nova_senha })
                    if (error) throw new Error('Erro ao alterar senha: ' + error.message)
                } else {
                    throw new Error('Por segurança, apenas o próprio usuário pode alterar sua senha.')
                }
            }
        }

        let errorFilha = null

        if (form.tipo_usuario === 'Funcionario') {
            const { error } = await supabase.from('funcionarios').upsert({
                id: userId,
                matricula: form.func_matricula,
                cargo: form.func_cargo,
                departamento: form.func_departamento
            })
            errorFilha = error
        } else if (form.tipo_usuario === 'Aluno') {
            const { error } = await supabase.from('alunos').upsert({
                id: userId,
                matricula: form.aluno_matricula,
                curso: form.aluno_curso,
                turma: form.aluno_turma
            })
            errorFilha = error
        } else if (form.tipo_usuario === 'Visitante') {
            const { error } = await supabase.from('visitantes').upsert({
                id: userId,
                cpf: form.vis_cpf,
                motivo_visita: form.vis_motivo,
                empresa_origem: form.vis_empresa
            })
            errorFilha = error
        }

        if (errorFilha) throw new Error('Erro ao salvar dados específicos: ' + errorFilha.message)

        showNotification(isCreating.value ? 'Usuário cadastrado com sucesso!' : 'Perfil atualizado com sucesso!')
        isCreating.value = false
        imageFile.value = null
        limparSenhas()
        await fetchUsuarios()
        await fetchUserProfile()

        if (publicImageUrl && userId === currentUser.value?.id && userProfile.value) {
            userProfile.value.foto_perfil = publicImageUrl
        }

        imagePreview.value = publicImageUrl || imagePreview.value

    } catch (error) {
        console.error(error)
        showNotification(error.message, 'error')
    } finally {
        isSaving.value = false
    }
}
const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        imageFile.value = file
        imagePreview.value = URL.createObjectURL(file)
    }
}

const createUser = () => {
    isCreating.value = true
    limparForm()
    limparSenhas()
    imageFile.value = null
    imagePreview.value = null
}

watch(userProfile, (perfil) => {
    if (perfil) fetchUsuarios()
}, { immediate: true })
</script>

<style scoped>

/* Toast  */
.toast {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #1a2533;
    background: #fff;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    min-width: 240px;
    max-width: 360px;
}

.toast.success { border-left: 4px solid #27ae60; }
.toast.error   { border-left: 4px solid #e74c3c; }

.toast-icon-wrap {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.toast-icon-wrap svg { width: 100%; height: 100%; }
.toast.success .toast-icon-wrap { color: #27ae60; }
.toast.error   .toast-icon-wrap { color: #e74c3c; }

.toast-slide-enter-active,
.toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from,
.toast-slide-leave-to { opacity: 0; transform: translateX(110%); }

/*  Page */
.profile-page { animation: fadeIn 0.4s ease-out; }

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

.header-chips { display: flex; gap: 10px; flex-wrap: wrap; }

.chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
}

.chip img { width: 15px; height: 15px; object-fit: contain; }
.chip.blue { background: rgba(52, 152, 219, 0.1); color: #2176ae; }

/*  Layout */
.profile-layout { display: grid; gap: 24px; align-items: start; }

.profile-layout.admin-view { grid-template-columns: 300px 1fr; }

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

/*  List Panel */
.list-header {
    padding: 14px 16px;
    border-bottom: 1px solid #f0f3f6;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.list-header-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #a0aab4;
}

.create-user{

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

.search-wrap { position: relative; }

.search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #a0aab4;
    pointer-events: none;
}

.search-input {
    width: 100%;
    padding: 9px 12px 9px 32px;
    border: 1.5px solid #e0e6eb;
    border-radius: 8px;
    font-size: 13px;
    background: #f9fbfc;
    color: #1a2533;
    box-sizing: border-box;
    transition: 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #3498db;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.list-body { max-height: 70vh; overflow-y: auto; }

.list-empty {
    padding: 32px 16px;
    text-align: center;
    color: #a0aab4;
    font-size: 13px;
}

.list-empty strong { color: #4a5a6a; }

.user-list {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.user-card {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 12px;
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

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-left: auto;
}

.status-dot.dot-active  { background: #27ae60; }
.status-dot.dot-inactive { background: #e74c3c; }

/*  Avatares  */
.user-avatar,
.hero-avatar {
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
}

.user-avatar { width: 38px; height: 38px; font-size: 15px; }
.hero-avatar  { width: 52px; height: 52px; font-size: 20px; border-radius: 14px; }

.user-avatar.funcionario,
.hero-avatar.funcionario { background: linear-gradient(135deg, #2c3e50, #34495e); }

.user-avatar.aluno,
.hero-avatar.aluno { background: linear-gradient(135deg, #27ae60, #2ecc71); }

.user-avatar.visitante,
.hero-avatar.visitante { background: linear-gradient(135deg, #e67e22, #f39c12); }

.user-info { min-width: 0; flex: 1; }
.user-info h4 {
    margin: 0 0 4px;
    font-size: 13px;
    color: #1a2533;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/*  Badges */
.user-badges,
.hero-badges { display: flex; gap: 5px; flex-wrap: wrap; }

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

.badge-status {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
}

.badge-status.status-active  { color: #27ae60; background: rgba(39, 174, 96, 0.1); }
.badge-status.status-inactive { color: #e74c3c; background: rgba(231, 76, 60, 0.1); }

/*  Form Panel */
.form-panel-header {
    padding: 18px 24px;
    border-bottom: 1px solid #f0f3f6;
}

.form-title-wrap { display: flex; align-items: center; gap: 10px; }

.form-panel-dot {
    width: 10px;
    height: 10px;
    background: #3498db;
    border-radius: 50%;
}

.form-panel-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1a2533;
}

.profile-form { padding: 24px; }

/*  Profile Hero */
.profile-hero {
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(135deg, #f8fafc, #f0f4f8);
    border: 1px solid #e8edf2;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
}

.hero-meta { min-width: 0; }

.hero-name {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 700;
    color: #1a2533;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/*  Form Fields  */
.section-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    font-weight: 700;
    color: #a0aab4;
    margin: 0 0 14px 0;
}

.form-section { margin-bottom: 8px; }

.dynamic-section {
    animation: fadeIn 0.3s ease-out;
    background: #f8fafc;
    padding: 18px 20px;
    border-radius: 12px;
    border: 1px dashed #dce2e8;
    margin-bottom: 24px;
}

.divider { height: 1px; background: #f0f3f6; margin: 8px 0 24px; }

.input-group { margin-bottom: 14px; flex: 1; }

.input-row { display: flex; gap: 16px; }

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
    padding: 10px 13px;
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
select:disabled { opacity: 0.55; cursor: not-allowed; }

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
    padding: 11px 24px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-primary:hover:not(:disabled) {
    background: #1a2533;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(44, 62, 80, 0.3);
}

.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-loading {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

/*  Empty State  */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 56px 24px;
    text-align: center;
}

.empty-illustration { margin-bottom: 20px; opacity: 0.85; }

.user-img { width: 80px; opacity: 70%; }

.empty-title {
    font-size: 15px;
    font-weight: 600;
    color: #4a5a6a;
    margin: 0 0 8px;
}

.empty-hint {
    font-size: 13px;
    color: #a0aab4;
    max-width: 260px;
    line-height: 1.6;
}

/*  Skeleton  */
.skeleton-list {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skeleton-card {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 12px;
    background: #f8f9fb;
    border-radius: 10px;
}

.skeleton {
    background: linear-gradient(90deg, #e8edf2 25%, #f2f5f8 50%, #e8edf2 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
}

.skeleton-icon { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; }
.skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 7px; }
.skeleton-line  { height: 10px; }
.skeleton-line.long  { width: 65%; }
.skeleton-line.short { width: 38%; }

/*  Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Upload de imagem */
.image-upload-area {
    width: 200px;
    height: 200px;
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
}

.image-upload-area:hover { border-color: #3498db; }

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

.upload-icon { font-size: 24px; }

.digital-cam { width: 15px; opacity: 50%; }

.upload-placeholder p {
    font-size: 13px;
    font-weight: 600;
    color: #7a8a96;
    margin: 0;
}

.upload-placeholder span { font-size: 12px; color: #b0bcc6; }

.file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

/*  Responsive */
@media (max-width: 900px) {
    .profile-layout.admin-view { grid-template-columns: 1fr; }
    .input-row { flex-direction: column; gap: 0; }
}
</style>
