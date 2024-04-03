<script setup lang="ts">
import { ref } from 'vue';
import { queryMeet } from '../queries/meets';
import { MeetSchema } from '../schemas/meet';
import FullSchedule from '../components/FullSchedule.vue';

const meets = ref<MeetSchema[]>();
queryMeet().then((res) => {
    meets.value = res;
});
</script>

<template>
    <div class="wrapper" v-if="meets?.[0].match">
        <FullSchedule v-for="meet in meets" :meet="meet" />
    </div>
    <div class="empty-state" v-else>Loading</div>
</template>

<style scoped>
.wrapper {
    width: 100%;
    padding: 0.75rem;
    display: flex;
    justify-content: center;
}
</style>
