<template>
    <div class="profile-page">

        <header class="page-header">
            <div class="header-text">
                <h1>Meu Perfil</h1>
                <p>Aqui você pode visualizar e editar suas informações pessoais.</p>
            </div>
            <div class="header-chips">
                <span class="chip blue">
                    <img src="../assets/icons_sideBar/perfil_user.png" alt="">
                    {{ quantidadeUsuarios }} usuários
                </span>
            </div>
        </header>

        <div class="profile-layout">

            <!-- Painel de usuários -->
            <section class="panel list-panel">

                <div class="list-body">
                    <div v-if="isLoading" class="skeleton-list">
                        <div v-for="n in 4" :key="n" class="skeleton-card">
                            <div class="skeleton skeleton-ison"></div>
                            <div class="skeleton-lines">
                                <div class="skeleton skeleton-line long"></div>
                                <div class="skeleton skeleton-line short"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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

const isLoading = ref(true)
const usuarios = ref([])

// variavel para armazenar a quantidade de usuarios cadastradas
const quantidadeUsuarios = computed(() => userProfile.value.length)

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

const fetchUsuarios = async () => {
    isLoading.value = true

    try{
        let query = supabase
            .from('usuarios')
            .select(`
                *,
                funcionarios(matricula, cargo, departamento),
                aluno(matricula, curso, turma),
                visitante(cpf, motivo_visita, empresa_origem)
            `)

        if (!isAdmin.value){
            query = query.eq('id', userProfile.value.id)
        }

        const { data, error } = await query.order('nome')

        if (error) throw error

        usuarios.value = data

        if(!isAdmin.value && data.length > 0){
            selecionarUsuario(data[0])
        }

    }catch(error){
        console.log('Erro ao buscar usuários:', error.message)
    }finally{
        isLoading.value = false
    }
}

const limparForm = () => {
    Object.keys(form).forEach(key => form[key] = '')
    form.tipo_usuario = 'Funcionario'
    form.perfil_acesso = 'Comum'
    form.statu = 'Ativo'
}

const selecionarUsuario = (usuario) => {

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
</style>