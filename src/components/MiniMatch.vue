<script setup lang="ts">
import { MatchSchema } from '../schemas/components';

defineProps<{ match: MatchSchema }>();
</script>

<template>
    <div class="match">
        <div class="header">
            <div class="game-number">G{{ match.game_number }}</div>
            <div class="status">
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
    gap: 0.5rem;
    flex-direction: row;
    font-family: monospace;
    background: #f89c3d;
    position: relative;
    border-radius: 0.75rem;
    padding: 0.5rem;
    &::after {
        content: '';
        position: absolute;
        inset: 0.25rem;
        border: 0.125rem solid white;
        border-radius: 0.5rem;
    }
}
.header {
    line-height: 0.6;
    margin-right: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.avatar {
    width: $size;
    height: auto;
}
.players {
    display: flex;
    gap: 0.5rem;
}
.player {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}
.name,
.vs {
    line-height: 1;
    display: flex;
    align-items: flex-end;
}
.avatar {
    overflow: hidden;
    border-radius: 0.25rem;
}
</style>
