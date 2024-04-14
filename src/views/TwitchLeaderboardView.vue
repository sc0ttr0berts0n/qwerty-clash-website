<script setup lang="ts">
import { ref } from 'vue';
import Leaderboard from '../components/Leaderboard.vue';
import Meet from '../components/Meet.vue';
import { MeetSchema } from '../schemas/meet';
import { queryMeet } from '../queries/meets';

document.body.classList.add('twitch', 'leaderboard');

const meets = ref<MeetSchema[]>();
queryMeet().then((res) => {
    meets.value = res;
});

</script>

<template>
    <Leaderboard />
</template>

<style lang="scss">
.twitch.leaderboard{

    #app {
        background: #00ff00;
    }
    .nav-container {
        display: none!important;
    }
    footer {
        display: none!important;
    }
}
</style>
