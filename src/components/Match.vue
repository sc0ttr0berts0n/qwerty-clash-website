<script setup lang="ts">
import { MatchSchema } from '../schemas/components';

defineProps<{ match: MatchSchema }>();
</script>

<template>
    <div class="match">
        <div class="header">
            <div class="game-number">Game {{ match.game_number }}</div>
            <div class="status">Match is {{ match.match_status }}</div>
        </div>
        <div class="players">
            <div class="player team-a p1">
                <img
                    class="avatar"
                    :src="match.team_a[0].avatar.url"
                    :alt="`${match.team_a[0].name}'s Avatar`"
                />
                <div class="name">{{ match.team_a[0].name }}</div>
            </div>
            <div class="player team-a p2">
                <img
                    class="avatar"
                    :src="match.team_a[1].avatar.url"
                    :alt="`${match.team_a[1].name}'s Avatar`"
                />
                <div class="name">{{ match.team_a[1].name }}</div>
            </div>
            <div class="vs">VS</div>
            <div class="player team-b p1">
                <img
                    class="avatar"
                    :src="match.team_b[0].avatar.url"
                    :alt="`${match.team_b[0].name}'s Avatar`"
                />
                <div class="name">{{ match.team_b[0].name }}</div>
            </div>
            <div class="player team-b p2">
                <img
                    class="avatar"
                    :src="match.team_b[1].avatar.url"
                    :alt="`${match.team_b[1].name}'s Avatar`"
                />
                <div class="name">{{ match.team_b[1].name }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.match {
    container: match / inline-size;
    margin-top: 1rem;
}
.header {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
}
.status {
    font-size: 2rem;
}
.game-number {
    display: inline-block;
    font-weight: bold;
    font-size: 2rem;
    padding: 0.75rem 2rem 0.5rem;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    border: 0.25rem solid white;
    line-height: 1;
    @media screen and (min-width: 700px) {
        font-size: 2rem;
        padding: 0.75rem 2rem 0.5rem;
    }
}
.players {
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns: 1fr 1fr 0.5fr 1fr 1fr;
    gap: 0px 2.5cqw;
    width: 100%;
    max-width: 1280px;
    margin-top: 2rem;
}
.player {
    // overflow: hidden;
    &.team-a {
        border-color: red;
    }
}
.name {
    text-align: center;
    font-size: 3.5cqw;
}
.avatar {
    border-radius: 50%;
    height: auto;
    width: calc(100% - 1cqw - 1cqw);
    border: double 1cqw transparent;
    border-radius: 50%;
    background-image: linear-gradient(white, white), linear-gradient(black, red);
    background-origin: border-box;
    background-clip: content-box, border-box;
    .team-b & {
        background-image: linear-gradient(white, white),
            linear-gradient(black, blue);
    }
}
.vs {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6cqw;
}
</style>
