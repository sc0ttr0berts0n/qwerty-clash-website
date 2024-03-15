<script setup lang="ts">
import { MatchSchema } from '../schemas/components';

defineProps<{ match: MatchSchema }>();
</script>

<template>
    <div class="match">
        <div class="game-number">Game {{ match.game_number }}</div>
        <div class="status">Match is {{ match.match_status }}</div>
        <div class="players">
            <div class="player team-a p1">
                <img
                    class="avatar"
                    :src="match.team_a[0].avatar.url"
                    :alt="`${match.team_a[0].name}'s Avatar`"
                />
                <div class="name">{{ match.team_a[0].pcode }}</div>
            </div>
            <div class="player team-a p2">
                <img
                    class="avatar"
                    :src="match.team_a[1].avatar.url"
                    :alt="`${match.team_a[1].name}'s Avatar`"
                />
                <div class="name">{{ match.team_a[1].pcode }}</div>
            </div>
            <div class="player team-b p1">
                <img
                    class="avatar"
                    :src="match.team_b[0].avatar.url"
                    :alt="`${match.team_b[0].name}'s Avatar`"
                />
                <div class="name">{{ match.team_b[0].pcode }}</div>
            </div>
            <div class="player team-b p2">
                <img
                    class="avatar"
                    :src="match.team_b[1].avatar.url"
                    :alt="`${match.team_b[1].name}'s Avatar`"
                />
                <div class="name">{{ match.team_b[1].pcode }}</div>
            </div>
        </div>
        <div class="vs">VS</div>
    </div>
</template>

<style lang="scss" scoped>
.match {
    container: match / inline-size;
    margin-top: 2rem;
}
.players {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 50cqw;
    width: 100%;
    max-width: 1280px;
    background-color: yellow;
}
.player {
    position: relative;
    // height: 25cqw;
    // width: 25cqw;
}
.name {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    background-color: rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    font-weight: bold;
    font-family: monospace;
    font-size: 2.5rem;
    line-height: 1;
    letter-spacing: 0.125rem;
    text-shadow: 0.25rem 0.25rem 0 black;
    text-align: center;
    .team-a & {
        bottom: auto;
        top: 0;
    }
}
.avatar {
    display: block;
    // position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
}
.vs {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -25%) skewX(-20deg);
    line-height: 1;
    font-size: 4rem;
    font-weight: bold;
    font-family: monospace;
    text-shadow: 0.25rem 0.25rem 0 black;
}
</style>
