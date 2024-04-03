<script setup lang="ts">
import { ref } from 'vue';
import { LeaderboardSchema, StatlineSchema } from '../schemas/leaderboard';
import { queryPlayerRecords } from '../queries/playerRecords';
import PlayerBar from './PlayerBar.vue';
import { PlayerSchema } from '../schemas/components';

const data = ref<Awaited<ReturnType<typeof generateLeaderboard>> | null>(null);

const generateLeaderboard = async (res: LeaderboardSchema) => {
    const map = new Map<
        string,
        {
            win: number;
            loss: number;
            player: Partial<PlayerSchema>;
        }
    >(
        res.players.map((player) => {
            return [player.pcode, { win: 0, loss: 0, player }];
        })
    );

    res.statlines.forEach((statline) => {
        // Get the record for the player if it exists, otherwise initialize with default values.
        const record = map.get(statline.player.pcode);

        // undefined record guard
        if (!record) {
            throw new Error(
                `Player ${statline.player.pcode} had no map entry.`
            );
        }

        // Increment the count based on the outcome.
        record[statline.outcome] += 1;
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
    <h2>Leaderboard</h2>
    <div class="leaderboard" v-if="data">
        <h3>Top {{ data.length }}</h3>
        <PlayerBar
            v-for="(entry, index) in data.slice(0, Math.floor(data.length / 2))"
            :key="entry.pcode"
            :position="index + 1"
            :pcode="entry.pcode"
            :wins="entry.wins"
            :losses="entry.losses"
            :name="entry.player.name"
            :url="entry.player.avatar?.url"
            :color="entry.player.color"
        />
        <h3>Bottom {{ data.length }}</h3>
        <PlayerBar
            v-for="(entry, index) in data.slice(Math.floor(data.length / 2))"
            :key="entry.pcode"
            :position="index + 11"
            :pcode="entry.pcode"
            :wins="entry.wins"
            :losses="entry.losses"
            :name="entry.player.name"
            :url="entry.player.avatar?.url"
            :color="entry.player.color"
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
        grid-template-rows: min-content repeat(10, min-content);
        gap: 0.5rem 1rem;
    }
}
</style>
