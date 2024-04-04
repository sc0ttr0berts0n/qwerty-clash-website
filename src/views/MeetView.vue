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
    <h1>Meets</h1>
    <Meet v-for="meet in meets" :meet="meet" />
</template>

<style scoped>
.wrapper {
    width: 100%;
    padding: 0.75rem;
    display: flex;
    justify-content: center;
}
</style>
