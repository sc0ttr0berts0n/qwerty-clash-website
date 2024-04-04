<script setup lang="ts">
import { useDiscordCredentials } from '../composables/discordCredentials';

useDiscordCredentials();
</script>

<template>
    <h1>Logged in.</h1>
    <p>
        You should be all set to close this window or go back to your original
        tab.
    </p>
</template>

<style scoped></style>
