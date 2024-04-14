<script setup lang="ts">
import { ref } from 'vue';
import { MeetSchema } from '../schemas/meet';
import { queryMeet } from '../queries/meets';

document.body.classList.add('stats', 'current-matches');

const meets = ref<MeetSchema[]>();
queryMeet().then((res) => {
    meets.value = res;
});

// pcode to corey code
const map = {
    LEE: 1, // - Allegedlee / Lee
    AMR: 2, // - Amorales / Andrew
    BBG: 3, // - Bbgameslab / BB
    ATM: 4, // - At0msk / Britnaa
    OSA: 5, // - Osageoj / Cleclair / Chris
    DVD: 6, // - David
    DRE: 7, // - Dredre / Andres
    XAV: 8, // - F.C.P.X.A.V.I. / Xav
    FLD: 9, // - Fieldday / Kenny
    GRY: 10, // - Gray / Gary
    JMZ: 11, // - Jmarutz /
    KLE: 12, // - Kelebrae /
    NCR: 13, // - Nerd Cruncher /
    OLI: 14, // - Oli.Online / Oli
    XXX: 15, // - Sebaceous / Evan
    SKT: 16, // - Skataroni / Scott
    CHZ: 17, // - SuperChenz /
    SWG: 18, // - Swaggerdragon / Lawson
    VNL: 19, // - Venilor / Cody
    VFT: 20, // - Veshift / Tim
} as const;
</script>

<template>
    <div class="meet" v-if="meets" v-for="match in meets[0].match">
        {{ match.game_number }},{{ map[match.team_a[0].pcode] }},{{
            map[match.team_a[1].pcode]
        }},{{ map[match.team_b[0].pcode] }},{{ map[match.team_b[1].pcode] }}
    </div>
</template>

<style lang="scss"></style>
