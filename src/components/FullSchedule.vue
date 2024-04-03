<script setup lang="ts">
import { useFormatDateTime } from '../composables/formatDateTime';
import { MeetSchema } from '../schemas/meet';
import MiniMatch from './MiniMatch.vue';

defineProps<{ meet: MeetSchema }>();
</script>

<template>
    <div class="meet" v-if="meet.match">
        <h2>Full Schedule</h2>
        <MiniMatch v-for="match in meet.match" :match="match" />
    </div>
</template>

<style scoped>
.meet {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 750px;
}
</style>
