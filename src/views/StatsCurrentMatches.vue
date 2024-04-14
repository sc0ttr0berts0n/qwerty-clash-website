<script setup lang="ts">
import { ref } from 'vue';
import { MeetSchema } from '../schemas/meet';
import { queryMeet } from '../queries/meets';

document.body.classList.add('stats', 'current-matches');

const meets = ref<MeetSchema[]>();
queryMeet().then((res) => {
    meets.value = res;
});

const pcodeToBcode = (pcode: any) => {
    // Use a switch statement to match the name to its corresponding code
    switch (pcode) {
        case 'LEE': // - Allegedlee / Lee
            return 1;
        case 'AMR': // - Amorales / Andrew
            return 2;
        case 'BBG': // - Bbgameslab / BB
            return 3;
        case 'ATM': // - At0msk / Britnaa
            return 4;
        case 'OSA': // - Osageoj / Cleclair / Chris
            return 5;
        case 'DVD': // - David
            return 6;
        case 'DRE': // - Dredre / Andres
            return 7;
        case 'XAV': // - F.C.P.X.A.V.I. / Xav
            return 8;
        case 'FLD': // - Fieldday / Kenny
            return 9;
        case 'GRY': // - Gray / Gary
            return 10;
        case 'JMZ': // - Jmarutz /
            return 11;
        case 'KLE': // - Kelebrae /
            return 12;
        case 'NCR': // - Nerd Cruncher /
            return 13;
        case 'OLI': // - Oli.Online / Oli
            return 14;
        case 'XXX': // - Sebaceous / Evan
            return 15;
        case 'SKT': // - Skataroni / Scott
            return 16;
        case 'CHZ': // - SuperChenz /
            return 17;
        case 'SWG': // - Swaggerdragon / Lawson
            return 18;
        case 'VNL': // - Venilor / Cody
            return 19;
        case 'VFT': // - Veshift / Tim
            return 20;
        default:
            return 86; // Return 86 for unmatched cases
    }
};
</script>

<template>
    <div class="meet" v-if="meets" v-for="match in meets[0].match">
        {{ match.game_number }},{{ pcodeToBcode(match.team_a[0].pcode) }},{{
            pcodeToBcode(match.team_a[1].pcode)
        }},{{ pcodeToBcode(match.team_b[0].pcode) }},{{
            pcodeToBcode(match.team_b[1].pcode)
        }}
    </div>
</template>

<style lang="scss"></style>
