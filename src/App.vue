<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useDiscordCredentials } from './composables/discordCredentials';
import { discord } from './store/discord';
import Nav from './components/Nav.vue';

const discordCreds = useDiscordCredentials();
discord.accessToken = discordCreds?.accessToken;
discord.expiresAt = discordCreds?.expiresAt;
discord.expiresIn = discordCreds?.expiresIn;
discord.tokenType = discordCreds?.tokenType;
discord.id = discordCreds?.id;
discord.avatar = discordCreds?.avatar;
</script>

<template>
    <Nav />
    <main>
        <RouterView />
    </main>
    <footer>QWERTYCAST MADE THIS</footer>
</template>

<style scoped>
header {
    display: flex;
    align-items: center;
    background-color: #f89c3d;
    width: 100%;
    text-align: center;
    padding: 0;
    margin: 0;
}
header > a {
    background-color: #282828;
    padding: 0.5rem 1rem;
    line-height: 1;
    border-radius: 0.25rem;
    display: block;
}
.nav-container {
    grid-area: 1 / 1 / 3 / 2;
}
main {
    grid-area: 1 / 2 / 2 / 3;
    width: 100%;
    flex-grow: 1;
    justify-content: center;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-top: 3rem;
    padding: 0 2rem 4rem;
}
footer {
    grid-area: 2 / 2 / 3 / 3;
    text-align: center;
    background-color: #111111;
    line-height: 2;
    color: #272f5a;
    font-weight: bold;
    background-color: #f89c3d;
    background-image: url('/public/background-nav.svg'),
        linear-gradient(45deg, #f5d626, #f89c3d);
    background-repeat: no-repeat;
    background-size: 400%;
    background-position: 20% 130%;
    padding: 1rem;
    position: relative;
    border-radius: 1rem;
    margin: 0 1rem 1rem;
    box-shadow: 0.25rem 0.25rem 0 0 black;

    &::after {
        content: '';
        pointer-events: none;
        position: absolute;
        inset: 0.25rem;
        border: 2px solid white;
        border-radius: 0.75rem;
    }
}
h1 {
    margin: 0;
    line-height: 1;
    padding: 1rem;
}
</style>
