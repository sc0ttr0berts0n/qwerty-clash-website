<script setup lang="ts">
enum ETieBreakers {
    WIN_RATE,
    LOSS,
    WIN,
    HEAD_TO_HEAD,
    KOS,
    TIE,
}

withDefaults(
    defineProps<{
        position: number;
        pcode: string;
        name: string;
        wins: number;
        losses: number;
        color: string;
        url: string;
        kos: number;
        tieBreakers: ETieBreakers;
    }>(),
    {
        name: 'unknown',
        url: 'https://fakeimg.pl/1000x1000/282828?retina=1&text=?',
        color: '#282828',
    }
);

const tieBreakerLetter = (tb: ETieBreakers) => {
    switch (tb) {
        case ETieBreakers.WIN_RATE:
            return '%';
        case ETieBreakers.WIN:
            return 'W';
        case ETieBreakers.LOSS:
            return 'L';
        case ETieBreakers.HEAD_TO_HEAD:
            return 'H';
        case ETieBreakers.KOS:
            return 'K';
        default:
            return '?';
    }
};
</script>

<template>
    <div class="player-bar" :style="{ backgroundColor: color }">
        <img class="avatar" :src="url" :alt="name" />
        <div class="position" v-if="position">{{ position }}</div>
        <div class="name">{{ name }}</div>
        <div class="pcode">{{ pcode }}</div>
        <div v-if="tieBreakers > 0" class="token">
            <div class="token-element">{{ tieBreakerLetter(tieBreakers) }}</div>
            <div class="token-helper">Tie Broken by reason</div>
        </div>
        <div class="record">{{ wins }}&ndash;{{ losses }}</div>
    </div>
</template>

<style lang="scss" scoped>
.player-bar {
    position: relative;
    display: flex;
    border-radius: 0.5rem;
    overflow: hidden;
    max-width: 500px;

    text-transform: uppercase;
    font-weight: bold;
    font-family: monospace;
    text-shadow: 0.175rem 0.175rem 0 black;

    height: 3rem;

    box-shadow: 0.375rem 0.375rem 0 0 black;
    @media screen and (min-width: 400px) {
        height: 4rem;
        font-size: 1.5rem;
    }
    @media screen and (min-width: 600px) {
        height: 3rem;
        font-size: 1.25rem;
    }
    @media screen and (min-width: 800px) {
        height: 4rem;
        font-size: 1.5rem;
    }
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
.token {
    align-self: center;
    width: 2ch;
    height: 2ch;
    line-height: 1;
    text-align: center;
    background-color: white;
    border-radius: 50%;
    color: black;
    text-shadow: none;
    font-weight: bold;
    font-size: 1rem;
    margin: 1ch;
    box-shadow: 0.1875rem 0.1875rem 0 0 black;
}
.token-helper {
    background-color: white;
    position: absolute;
    z-index: 100;
}
.name {
    position: relative;
    flex-grow: 1;
    height: 100%;
    display: flex;
    // justify-content: center;
    align-items: center;
    padding: 0 1rem;
    // white-space: nowrap;
    overflow: hidden;
    line-height: 1;
    text-overflow: ellipsis;
    width: 20%;
    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
            to left,
            v-bind(color) 10%,
            rgba(255, 255, 255, 0) 20%
        );
    }
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
    white-space: nowrap;
}
</style>
