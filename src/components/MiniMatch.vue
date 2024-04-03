<script setup lang="ts">
import { MatchSchema } from '../schemas/components';

defineProps<{ match: MatchSchema }>();
</script>

<template>
    <div class="match">
        <div class="header">
            <div class="game-number">G{{ match.game_number }}</div>
            <div class="match-status">
                {{ match.match_status === 'pending' ? 'PEND' : 'DONE' }}
            </div>
        </div>
        <div class="players">
            <div class="player">
                <img
                    class="avatar"
                    :src="match.team_a[0].avatar.url"
                    :alt="`${match.team_a[0].name}'s Avatar`"
                />
                <div class="name">{{ match.team_a[0].pcode }}</div>
            </div>
            <div class="vs">&</div>
            <div class="player">
                <img
                    class="avatar"
                    :src="match.team_a[1].avatar.url"
                    :alt="`${match.team_a[1].name}'s Avatar`"
                />
                <div class="name">{{ match.team_a[1].pcode }}</div>
            </div>
            <div class="vs">VS</div>
            <div class="player">
                <img
                    class="avatar"
                    :src="match.team_b[0].avatar.url"
                    :alt="`${match.team_b[0].name}'s Avatar`"
                />
                <div class="name">{{ match.team_b[0].pcode }}</div>
            </div>
            <div class="vs">&</div>
            <div class="player">
                <img
                    class="avatar"
                    :src="match.team_b[1].avatar.url"
                    :alt="`${match.team_b[1].name}'s Avatar`"
                />
                <div class="name">{{ match.team_b[1].pcode }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
$size: 2.25rem;
.match {
    display: inline-flex;
    align-self: flex-start;
    flex-wrap: wrap;
    font-size: 1.75rem;
    font-weight: bold;
    font-variant-numeric: tabular-nums;
    color: #272f5a;
    gap: 0.5rem;
    flex-direction: row;
    background: #f89c3d;
    position: relative;
    border-radius: 0.75rem;
    padding: 0.5rem 1rem;
    box-shadow: 0.375rem 0.375rem 0 0 black;
    &::after {
        content: '';
        position: absolute;
        inset: 0.25rem;
        border: 0.125rem solid white;
        border-radius: 0.5rem;
    }
}
.header {
    line-height: 1;
    margin-right: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
}
.game-number {
    width: 3ch;
}
.match-status {
    width: 4ch;
}
.avatar {
    width: $size;
    height: auto;
    border: 2px solid white;
}
.players {
    display: flex;
    gap: 0.5rem;
}
.player {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
}
.name,
.vs {
    line-height: 1;
    display: flex;
    align-items: center;
}
.name {
    width: 3ch;
}
.avatar {
    overflow: hidden;
    border-radius: 0.25rem;
}
</style>
