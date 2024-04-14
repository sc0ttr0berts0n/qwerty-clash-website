<script setup lang="ts">
import CheckInList from '../components/CheckIn/CheckInList.vue';
</script>

<template>
    <h1>Check-Ins</h1>
    <p>
        Have a question? Is your availability not so black and white? Contact an
        admin such as
        <a href="https://discordapp.com/users/120436529725308930">@Skat</a>,
        <a href="https://discordapp.com/users/372880034459025409">@Dredre</a>,
        or
        <a href="https://discordapp.com/users/258769207087464449">@Fieldday</a>
        on Discord.
    </p>
    <CheckInList />
</template>

<style scoped>
.wrapper {
    width: 100%;
    max-width: 1280px;
    padding: 0.75rem;
}
</style>
