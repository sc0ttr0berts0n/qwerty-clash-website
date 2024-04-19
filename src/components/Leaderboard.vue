<script setup lang="ts">
import { ref } from 'vue';
import { LeaderboardSchema, StatlineSchema } from '../schemas/leaderboard';
import { queryPlayerRecords } from '../queries/playerRecords';
import PlayerBar from './PlayerBar.vue';
import { useGenerateLeaderboard } from '../composables/generateLeaderboard';

const data = ref<Awaited<ReturnType<typeof useGenerateLeaderboard>> | null>(
    null
);

queryPlayerRecords()
    .then(useGenerateLeaderboard)
    .then((res) => {
        data.value = res;
    });
</script>

<template>
    <h2>Overall Standings</h2>
    <div class="leaderboard" v-if="data">
        <PlayerBar
            v-for="(entry, index) in data"
            :key="entry.player.pcode"
            :position="index + 1"
            :pcode="entry.player.pcode"
            :wins="entry.win"
            :losses="entry.loss"
            :name="entry.player.name"
            :url="entry.player.avatar?.url"
            :color="entry.player.color"
            :tie-breakers="entry.tieBreaker"
            :kos="entry.kos"
        />
    </div>
</template>

<style lang="scss" scoped>
.leaderboard-wrapper {
    width: 100%;
}
.leaderboard {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 0.5rem;
    width: 100%;
    @media screen and (min-width: 1200px) {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        grid-template-columns: repeat(2, min-content);
        grid-template-rows: repeat(10, min-content);
        gap: 0.5rem 1rem;
    }
}
</style>
