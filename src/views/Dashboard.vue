<template>
    <main>
        <SideBar />
    <section class="dashboard">
        <div class="dashboard-container">
        <h1>Bem-vindo ao Dashboard do EPI TRACK</h1>
        <p>Aqui você pode gerenciar os Equipamentos de Proteção Individual (EPIs) da sua equipe, acompanhar o uso e garantir a segurança no ambiente de trabalho.</p>
        </div>
    </section>
    </main>
</template>

<script>
import SideBar from '../components/SideBar.vue';

    export default{
        name: "Dashboard",
        components: {
            SideBar
        }
    }
</script>