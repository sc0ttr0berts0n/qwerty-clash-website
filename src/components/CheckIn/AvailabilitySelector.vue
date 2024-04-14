<script setup lang="ts">
import { useSendCheckIn } from '../../composables/sendCheckIn';
import { CheckinSingleSchema } from '../../schemas/checkin';

const props = defineProps({checkins})

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
            const player = checkins.value
                ?.find((el) => el.meet._id === data.meetID)
                ?.players?.find((p) => p.discord_id === data.discordData.id);
            if (!player) return;
            player.checkinStatus = data.checkinStatus;
        });

    // assume the update will succeed and paint it early
    const player = checkins.value
        ?.find((el) => el.meet._id === meetID)
        ?.players?.find((p) => p.discord_id === discord.id);
    if (player) {
        player.checkinStatus = userStatus;
    }
};
</script>
<template>
    <div class="label">Your Status:</div>
    <select name="status" class="status-select" v-model="checkin.userStatus" @change="
        proxySendCheckIn(
            checkin.meet._id,
            checkin.userStatus
        )
        ">
        <option v-for="option in options.filter((opt) => {
            return isOptionAvailable(
                opt.value,
                checkin.meet.meet_time
            );
        })" :value="option.value">
            {{ option.text }}
        </option>
    </select>
</template>
