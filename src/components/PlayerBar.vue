<script setup lang="ts">
defineProps<{
    pcode: string;
    name: string;
    wins: number;
    losses: number;
    color: string;
    url: string;
}>();
</script>

<template>
    <div class="player-bar" :style="{ backgroundColor: color }">
        <img :src="url" :alt="name" />
        <div class="name">{{ name }}</div>
        <div class="pcode">{{ pcode }}</div>
        <div class="record">{{ wins }}&ndash;{{ losses }}</div>
    </div>
</template>

<style scoped>
.player-bar {
    display: flex;
    height: 3rem;
    border-radius: 0.5rem;
    overflow: hidden;
    width: 500px;

    text-transform: uppercase;
    font-weight: bold;
    font-family: monospace;
    font-size: 1.5rem;
    letter-spacing: 0.125rem;
    text-shadow: 0.125rem 0.125rem 0 black;
}
.name {
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
}
.pcode {
    display: none;
}

.record {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
