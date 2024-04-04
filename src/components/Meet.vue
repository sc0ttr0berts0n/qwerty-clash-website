<script setup lang="ts">
import { useFormatDateTime } from '../composables/formatDateTime';
import { MeetSchema } from '../schemas/meet';
import Match from './Match.vue';

const { meet } = defineProps<{ meet: MeetSchema }>();

const upcomingGames = meet?.match?.filter((match) => {
    return match.match_status === 'pending';
});
const completeGames = meet?.match?.filter((match) => {
    return match.match_status === 'completed';
});
</script>

<template>
    <h2 v-if="meet">{{ useFormatDateTime(meet?.meet_time) }}</h2>
    <div class="game-list">
        <h3 v-if="upcomingGames?.length > 0">Upcoming Games</h3>
        <div class="meet" v-if="upcomingGames">
            <Match v-for="match in upcomingGames" :match="match" />
        </div>
        <h3 v-if="completeGames?.length > 0">Completed Games</h3>
        <div class="meet" v-if="completeGames">
            <Match v-for="match in completeGames" :match="match" />
        </div>
    </div>
    <p v-if="!meet.match">
        These games are still undetermined. Check back soon.
    </p>
</template>

<style scoped>
.meet {
    width: 100%;
    max-width: 750px;
}
</style>
