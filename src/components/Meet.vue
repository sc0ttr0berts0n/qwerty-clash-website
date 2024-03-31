<script setup lang="ts">
import { useFormatDateTime } from '../composables/formatDateTime';
import { MeetSchema } from '../schemas/meet';
import Match from './Match.vue';

defineProps<{ meet: MeetSchema }>();
</script>

<template>
    <div class="meet" v-if="meet.match">
        <h2>{{ useFormatDateTime(meet.meet_time) }}</h2>
        <Match v-for="match in meet.match" :match="match" />
    </div>
</template>

<style scoped></style>
