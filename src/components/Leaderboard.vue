<script setup lang="ts">
import { ref } from 'vue';
import { LeaderboardSchema } from '../schemas/leaderboard';
import { queryPlayerRecords } from '../queries/playerRecords';
import PlayerBar from './PlayerBar.vue';

const data: any = ref(null);

const generateLeaderboard = async (data: LeaderboardSchema[]) => {
    const map = new Map<
        string,
        { win: number; loss: number; player: LeaderboardSchema['player'] }
    >();
    data.forEach((statline) => {
        const { pcode } = statline.player;

        // Get the record for the player if it exists, otherwise initialize with default values.
        const record = map.get(pcode) || {
            win: 0,
            loss: 0,
            player: statline.player,
        };

        // Increment the count based on the outcome.
        record[statline.outcome] += 1;

        // Update the map entry for the player.
        map.set(pcode, record);
    });

    return [...map.entries()]
        .map((entry) => {
            return {
                pcode: entry[0],
                wins: entry[1].win,
                losses: entry[1].loss,
                player: entry[1].player,
            };
        })
        .sort((a, b) => b.wins - a.wins);
};

queryPlayerRecords()
    .then(generateLeaderboard)
    .then((res) => {
        data.value = res;
    });
</script>

<template>
    <div class="leaderboard" v-if="data">
        <h2>Top {{ data.length }}</h2>
        <PlayerBar
            v-for="entry in data"
            :key="entry.pcode"
            :pcode="entry.pcode"
            :wins="entry.wins"
            :losses="entry.losses"
            :name="entry.player.name"
            :url="entry.player.avatar.url"
            :color="entry.player.color"
        />
    </div>
</template>

<style scoped>
h2 {
    text-align: center;
    margin: 0;
}
.leaderboard {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
../queries/playerRecords
