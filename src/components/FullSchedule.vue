<script setup lang="ts">
import { ref } from 'vue';
import { FullScheduleSchema } from '../schemas/fullSchedule';
import MiniMatch from './MiniMatch.vue';

const { schedule } = defineProps<{ schedule: FullScheduleSchema[] }>();

const workingSchedule = ref(schedule);
const filter = ref('');

const filterSchedule = () => {
    workingSchedule.value = schedule.filter((match) => {
        const { game_number, match_status, team_a, team_b } = match;
        const extractStrings = (teams: { name: string; pcode: string }[][]) => {
            return teams
                .flatMap((team) => {
                    return team.map(({ name, pcode }) => `${name} ${pcode}`);
                })
                .join(' ');
        };
        const teams = extractStrings([team_a, team_b]);
        const bigString =
            `${game_number} ${match_status} ${teams}`.toLowerCase();

        const terms = filter.value.toLowerCase().trim().split(' ');
        const includeTerms = terms.filter((term) => !term.startsWith('-'));
        const excludeTerms = terms
            .filter((term) => term.startsWith('-'))
            .map((term) => term.slice(1));

        const includeTest = includeTerms.every((term) =>
            bigString.includes(term)
        );
        const excludeTest = excludeTerms.every(
            (term) => !bigString.includes(term)
        );

        return includeTest && excludeTest;
    });
};
</script>

<template>
    <div class="matches-wrapper" v-if="schedule">
        <h2>Full Schedule</h2>
        <h3>Filter</h3>
        <input
            class="filter"
            type="text"
            v-model="filter"
            @keyup="filterSchedule"
        />
        <p>Separate terms with a space. Use a "-" minus to omit terms.</p>
        <h3>
            {{
                workingSchedule.length === schedule.length ? '' : 'Filtered '
            }}Schedule ({{ workingSchedule.length }} Games)
        </h3>
        <MiniMatch v-for="match in workingSchedule" :match="match" />
        <div class="empty-state" v-if="workingSchedule.length === 0">
            No games found using current filters.
        </div>
    </div>
</template>

<style lang="scss" scoped>
.matches-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 750px;
}
.filter {
    --size: 2rem;
    background-color: white;
    border: 0;
    height: var(--size);
    border-radius: calc(var(--size) / 2);
    padding: 0.125rem 0.75rem 0;
    font-size: 1.5rem;
    font-family: 'Bebas Neue', sans-serif;
    line-height: 1;
    color: black;
}
</style>
