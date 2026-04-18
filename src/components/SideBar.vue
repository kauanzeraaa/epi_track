<template>
    <aside class="sidebar">
        <section class="sidebar-icons">

            <router-link to="/dashboard" class="nav-item" title="Dashboard">
                <img src="../assets/icons_sideBar/dashboard_home.png" alt="Dashboard" class="sidebar-icon" />
                <span class="nav-label">Dashboard</span>
            </router-link>

            <template v-if="perfilUsuario === 'Administrador'">
                <router-link to="/catalog" class="nav-item">
                    <img src="../assets/icons_sideBar/catalogo_epis.png" alt="Catálogo" class="sidebar-icon" />
                    <span class="nav-label">Catálogo</span>
                </router-link>
                <router-link to="/movements" class="nav-item">
                    <img src="../assets/icons_sideBar/entrega_epis.png" alt="Movimentação" class="sidebar-icon" />
                    <span class="nav-label">Movimentações</span>
                </router-link>
                <router-link to="/history" class="nav-item">
                    <img src="../assets/icons_sideBar/historico_epis.png" alt="Histórico" class="sidebar-icon" />
                    <span class="nav-label">Histórico NR-6</span>
                </router-link>
                <router-link to="/alerts" class="nav-item">
                    <img src="../assets/icons_sideBar/alerta_epis.png" alt="Alertas" class="sidebar-icon" />
                    <span class="nav-label">Alertas</span>
                </router-link>
            </template>

            <router-link to="/profile" class="nav-item">
                <img src="../assets/icons_sideBar/perfil_user.png" alt="Perfil" class="sidebar-icon" />
                <span class="nav-label">Meu Perfil</span>
            </router-link>

            <div class="spacer"></div>

            <button @click="handleLogout" class="nav-item logout-btn">
                <img src="../assets/icons_sideBar/system_out.png" alt="Sair" class="sidebar-icon" />
                <span class="nav-label">Sair</span>
            </button>

        </section>
    </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabase } from '../composable/useSupabase'

const router = useRouter()
const { supabase } = useSupabase()

const perfilUsuario = ref('Comum')

const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
}
</script>

<style scoped>
    .sidebar {
        width: 100px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        padding: 40px 0;
        margin: 20px;
        box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
        background-color: var(--color-blue, #2C3E50);
        border-radius: 100px;
        z-index: 100;
    }

    .sidebar-icons {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        height: 100%;
    }

    /* Item de navegação base */
    .nav-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        text-decoration: none;
        transition: background-color 0.2s ease;
        cursor: pointer;
    }

    .nav-item:hover {
        background-color: rgba(255, 255, 255, 0.12);
    }

    /* Estado ativo da rota */
    .nav-item.router-link-active,
    .nav-item.router-link-exact-active {
        background-color: rgba(243, 156, 18, 0.18);
    }

    /* Indicador lateral de rota ativa */
    .nav-item.router-link-active::before,
    .nav-item.router-link-exact-active::before {
        content: '';
        position: absolute;
        left: -14px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 24px;
        background-color: #F39C12;
        border-radius: 0 4px 4px 0;
    }

    /* Ícone */
    .sidebar-icon {
        width: 28px;
        height: 28px;
        opacity: 0.55;
        transition: opacity 0.2s ease, transform 0.2s ease;
        display: block;
        object-fit: contain;
    }

    .nav-item:hover .sidebar-icon {
        opacity: 1;
        transform: scale(1.1);
    }

    .nav-item.router-link-active .sidebar-icon,
    .nav-item.router-link-exact-active .sidebar-icon {
        opacity: 1;
        filter: drop-shadow(0px 0px 6px rgba(243, 156, 18, 0.65));
    }

    /* Tooltip customizado */
    .nav-label {
        position: absolute;
        left: calc(100% + 14px);
        top: 50%;
        transform: translateY(-50%) translateX(-6px);
        background-color: #1a252f;
        color: #ecf0f1;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        padding: 6px 12px;
        border-radius: 6px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.18s ease, transform 0.18s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        z-index: 200;
    }

    /* Seta do tooltip */
    .nav-label::before {
        content: '';
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        border: 5px solid transparent;
        border-right-color: #1a252f;
    }

    .nav-item:hover .nav-label {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
    }

    /* Botão de logout */
    .logout-btn {
        background: transparent;
        border: none;
        padding: 0;
    }

    .logout-btn:hover .sidebar-icon {
        filter: invert(30%) sepia(100%) saturate(300%) hue-rotate(330deg) brightness(1.1);
        opacity: 1;
    }

    .spacer {
        flex-grow: 1;
    }

    @media (max-width: 768px) {
        .sidebar {
            width: 60px;
            padding: 10px 0;
            margin: 10px;
        }

        .nav-item {
            width: 44px;
            height: 44px;
        }

        .sidebar-icon {
            width: 22px;
            height: 22px;
        }
    }

    @media (max-width: 480px) {
        .sidebar {
            width: 40px;
            padding: 8px 0;
            margin: 8px;
        }

        .nav-item {
            width: 36px;
            height: 36px;
        }

        .sidebar-icon {
            width: 18px;
            height: 18px;
        }
    }
</style>
