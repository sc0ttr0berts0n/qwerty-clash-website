<script setup lang="ts">
withDefaults(
    defineProps<{
        position: number;
        pcode: string;
        name: string;
        wins: number;
        losses: number;
        color: string;
        url: string;
    }>(),
    {
        name: 'unknown',
        url: 'https://fakeimg.pl/1000x1000/282828?retina=1&text=?',
        color: '#282828',
    }
);
</script>

<template>
    <div class="player-bar" :style="{ backgroundColor: color }">
        <img class="avatar" :src="url" :alt="name" />
        <div class="position" v-if="position">{{ position }}</div>
        <div class="name">{{ name }}</div>
        <div class="pcode">{{ pcode }}</div>
        <div class="record">{{ wins }}&ndash;{{ losses }}</div>
    </div>
</template>

<style lang="scss" scoped>
.player-bar {
    position: relative;
    display: flex;
    height: 4rem;
    border-radius: 0.5rem;
    overflow: hidden;
    max-width: 500px;

    text-transform: uppercase;
    font-weight: bold;
    font-family: monospace;
    font-size: 1.5rem;
    text-shadow: 0.175rem 0.175rem 0 black;

    box-shadow: 0.375rem 0.375rem 0 0 black;
    &::after {
        content: '';
        position: absolute;
        inset: 2px;
        display: block;
        border-radius: 0.25rem;
        border: 2px solid white;
    }
}
.avatar {
    border-right: 2px solid white;
}
.name {
    flex-grow: 1;
    height: 100%;
    display: flex;
    // justify-content: center;
    align-items: center;
    padding: 0 1rem;
}
.position {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 0.5rem;
    width: 2rem;
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
