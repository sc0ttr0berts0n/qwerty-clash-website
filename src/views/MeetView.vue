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
    <div class="wrapper">
        <Meet v-if="meets" v-for="meet in meets" :meet="meet" />
    </div>
</template>

<style scoped>
.wrapper {
    width: 100%;
    max-width: 1280px;
    padding: 0.75rem;
}
</style>
