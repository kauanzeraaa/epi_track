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

// variavel para armazenar a quantidade de usuarios cadastradas
const quantidadeUsuarios = computed(() => userProfile.value.length)
const isLoading = ref(true)

const isLoadingDados = ref(true)
const usuarios = ref([])

// formulario reativo
const form = reactive({
    id: '',
    nome: '',
    celular: '',
    email: '',
    perfil_acesso: '',
    cargo: '',
    departamento: '',
    matricula: ''
})

const fetchData = async () => {
    isLoadingDados.value = true

    try {
        const { data: userData } = await supabase
            .from('usuarios')
            .select('id, nome')
            .order('nome')

        if (userData) {
            usuarios.value = userData
        }

    } catch (error) {
        console.log('Erro ao carregar dados:', error)
    } finally {
        isLoadingDados.value = false
    }
}


onMounted(() => fetchData())

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