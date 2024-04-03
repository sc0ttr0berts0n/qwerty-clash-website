<script setup lang="ts">
import { ref } from 'vue';
import { queryMeet } from '../queries/meets';
import { MeetSchema } from '../schemas/meet';
import Meet from '../components/Meet.vue';

const meets = ref<MeetSchema[]>();
queryMeet().then((res) => {
    meets.value = res;
});
</script>

<template>
    <Meet v-for="meet in meets" :meet="meet" v-if="meets" />
    <div class="empty-state" v-else>
        No Meets with Matches Currently Scheduled
    </div>
</template>

<style scoped>
.wrapper {
    width: 100%;
    padding: 0.75rem;
    display: flex;
    justify-content: center;
}
</style>
