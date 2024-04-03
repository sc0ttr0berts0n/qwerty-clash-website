<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useDiscordCredentials } from './composables/discordCredentials';
import { discord } from './store/discord';

const discordCreds = useDiscordCredentials();
discord.accessToken = discordCreds?.accessToken;
discord.expiresAt = discordCreds?.expiresAt;
discord.expiresIn = discordCreds?.expiresIn;
discord.tokenType = discordCreds?.tokenType;
discord.id = discordCreds?.id;
discord.avatar = discordCreds?.avatar;
</script>

<template>
    <header>
        <h1>Qwerty Clash 💥</h1>
        <a
            href="https://discord.com/oauth2/authorize?client_id=1219998739381616650&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fdiscord&scope=identify"
            >Discord</a
        >
    </header>
    <nav>
        <RouterLink to="/leaderboard">Leaderboard</RouterLink>
        <RouterLink to="/game-nights">Game Nights</RouterLink>
        <RouterLink to="/full-schedule">Full Schedule</RouterLink>
        <RouterLink to="/check-in">Check-In</RouterLink>
    </nav>
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
nav {
    display: flex;
    gap: 1rem;
}
main {
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
}
footer {
    margin-top: 6rem;
    text-align: center;
    background-color: #111111;
    width: 100%;
    line-height: 2;
}
h1 {
    margin: 0;
    line-height: 1;
    padding: 1rem;
}
</style>
