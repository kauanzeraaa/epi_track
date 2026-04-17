<template>
    <aside class="sidebar">
        <section class="sidebar-icons">
    
        </section>
    </aside>
</template>

<style>

    .sidebar {
        width: 100px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        padding: 20px;
        margin: 20px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        background-color: var(--color-blue);
        border-radius: 100px;
    }

    @media (max-width: 480px) {
        .sidebar {
            width: 40px;
            padding: 10px;
            margin: 10px;
        }
    }

    @media (max-width: 768px) {
        .sidebar {
            width: 60px;
            padding: 10px;
            margin: 10px;
        }
    }
</style>