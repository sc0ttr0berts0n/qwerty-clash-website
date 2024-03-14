<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <header>
        <h1>Qwerty Clash 💥</h1>
    </header>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/leaderboard">Leaderboard</RouterLink>
        <RouterLink to="/meet">Meets</RouterLink>
    </nav>
    <main>
        <RouterView />
    </main>
    <footer>QWERTYCAST MADE THIS</footer>
</template>

<style scoped>
header {
    background-color: #ff5050;
    width: 100%;
    text-align: center;
    padding: 0;
    margin: 0;
}
nav {
    display: flex;
    gap: 1rem;
}
main {
    width: 100%;
    max-width: 600px;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
footer {
    text-align: center;
    background-color: #111111;
}
h1 {
    margin: 0;
    line-height: 1;
    padding: 1rem;
}
</style>
