<script setup lang="ts">
import { FullScheduleSchema } from '../schemas/fullSchedule';
import MiniMatch from './MiniMatch.vue';

defineProps<{ schedule: FullScheduleSchema[] }>();
</script>

<template>
    <div class="matches-wrapper" v-if="schedule">
        <h2>Full Schedule</h2>
        <MiniMatch v-for="match in schedule" :match="match" />
    </div>
</template>

<style scoped>
.matches-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 750px;
}
</style>
