<script setup lang="ts">
import { ref } from 'vue';
import { MeetSchema } from '../schemas/meet';
import MeetView from './MeetView.vue'
import { MatchSchema } from '../schemas/components';

import { queryMeet } from '../queries/meets';
import Match from '../components/Match.vue'
import MiniMatch from '../components/MiniMatch.vue'
document.body.classList.add('twitch', 'upcoming-games');

const match = ref();
const nextUp = ref<MatchSchema[]>();
queryMeet().then((res) => {
    match.value = res[0]?.match?.find((match) => {
        return match.match_status === 'pending';
    });
    nextUp.value = res[0]?.match?.slice(1).filter((match) => {
        return match.match_status === 'pending';
    })
});



</script>

<template>
    <h3>Next Match</h3>
    <Match :match="match"/>
    <div class="spacer"></div>
    <h3>On Deck</h3>
    <MiniMatch v-for="match in nextUp" :match="match" />
</template>

<style lang="scss">
body.twitch.upcoming-games {

    background: #00ff00;
}
.twitch.upcoming-games {
    #app {
        max-width: 750px;
    }
    .nav-container {
        display: none!important;
    }
    footer {
        display: none!important;
    }
    h1 {
        display: none!important;
    }
    h2 {
        display: none !important;
    }

    .spacer {
        margin: 2rem 0;
    }
    .match {
        margin-bottom: 1rem;
    }

}
</style>
