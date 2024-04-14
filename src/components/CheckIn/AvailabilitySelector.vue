<script setup lang="ts">
import { ref } from 'vue';
import { useSendCheckIn } from '../../composables/sendCheckIn';
import { CheckinSingleSchema } from '../../schemas/checkin';
import { discord } from '../../store/discord';
import { CheckinFromComponent } from './CheckInSingle.vue';

const { checkin } = defineProps<{ checkin: CheckinFromComponent }>();

const proxySendCheckIn = (
    meetID: string,
    userStatus: CheckinSingleSchema['checkin_status']
) => {
    // send off to the server
    useSendCheckIn(meetID, userStatus)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            // if you get a server response, update the content
            const player = checkin?.players?.find(
                (p) => p.discord_id === data.discordData.id
            );
            if (!player) return;
            player.checkinStatus = data.checkinStatus;
        });

    // assume the update will succeed and paint it early
    const player = checkin?.players?.find((p) => p.discord_id === discord.id);
    if (player) {
        player.checkinStatus = userStatus;
    }
};

const options = ref([
    { text: '💤 No Response', value: 'unknown' },
    { text: '❌ Unavailable', value: 'unavailable' },
    { text: '🟡 Will Attend', value: 'rsvp' },
    { text: '✅ Check-In', value: 'checkedin' },
]);
const checkinWindow = 1000 * 60 * 60 * 3; // 3 hours

const isOptionAvailable = (opt: string, startTime: string) => {
    const now = Date.now();
    const start = Date.parse(startTime);
    if (opt === 'checkedin') {
        const checkInStart = start - checkinWindow;
        return now > checkInStart;
    }
    return true;
};

const isCheckinAvailable = (startTime: string) => {
    return isOptionAvailable('checkedin', startTime);
};
</script>
<template>
    <div class="label">Your Status:</div>
    <select
        name="status"
        class="status-select"
        v-model="checkin.userStatus"
        @change="proxySendCheckIn(checkin.meet._id, checkin.userStatus)"
    >
        <option
            v-for="option in options.filter((opt) => {
                return isOptionAvailable(opt.value, checkin.meet.meet_time);
            })"
            :value="option.value"
        >
            {{ option.text }}
        </option>
    </select>
</template>
