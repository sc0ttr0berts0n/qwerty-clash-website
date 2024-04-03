<script setup lang="ts">
import { ref } from 'vue';
import { queryFullSchedule } from '../queries/fullSchedule';
import FullSchedule from '../components/FullSchedule.vue';
import { FullScheduleSchema } from '../schemas/fullSchedule';

const schedule = ref<FullScheduleSchema[]>();
queryFullSchedule().then((res) => {
    schedule.value = res;
});
</script>

<template>
    <div class="wrapper" v-if="schedule">
        <FullSchedule :schedule="schedule" />
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
