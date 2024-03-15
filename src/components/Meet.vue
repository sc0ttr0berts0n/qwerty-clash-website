<script setup lang="ts">
import { MeetSchema } from '../schemas/meet';
import Match from './Match.vue';

defineProps<{ meet: MeetSchema }>();
</script>

<template>
    <div class="meet">
        <h2>Meet on {{ meet.meet_time }}</h2>
        <Match v-for="match in meet.match" :match="match" />
    </div>
</template>

<style scoped></style>
