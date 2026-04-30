<template>
    <main class="pagina">
        <section class="card">
            <h1>Cadastro de Funcionário</h1>
            <form @submit.prevent="cadastrarFuncionario">
                <label for="nome">Nome do Funcionário</label>

                <input id="nome" v-model="nome" type="text" placeholder="Digite o nome do funcionário" />

                <p v-if="erro" class="erro">{{ erro }}</p>
                <button type="submit">Cadastrar</button>
            </form>
        </section>

    </main>
</template>

<script setup>
    import { ref } from "vue"

    const nome = ref("")
    const erro = ref("")


    function cadastrarFuncionario() {
        erro.value = ""
        if (nome.value.trim() === "") {
            erro.value = "O nome do funcionário é obrigatório."
            return
        }
    }
</script>

