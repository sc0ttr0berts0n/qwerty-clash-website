<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { queryCheckIns } from '../../queries/checkin';
import { singlePlayerCheckin } from '../../queries/singlePlayerCheckin';
import { discord } from '../../store/discord';
import { useDiscordCredentials } from '../../composables/discordCredentials';
import { useFormatDateTime } from '../../composables/formatDateTime';
import CheckInSingle from './CheckInSingle.vue';
import {
    CheckinSchema,
    MeetSchema,
    PlayerSchema,
    CheckinSingleSchema,
} from '../../schemas/checkin';
import { useSendCheckIn } from '../../composables/sendCheckIn';
import { FullScheduleSchema } from '../../schemas/fullSchedule';
import { queryFullSchedule } from '../../queries/fullSchedule';

type Checkin = {
    meet: MeetSchema;
    players: Array<
        PlayerSchema & {
            checkinStatus: CheckinSingleSchema['checkin_status'];
        }
    >;
    userStatus: CheckinSingleSchema['checkin_status'];
}[];

const checkins = ref<Checkin | null>(null);

const schedule = ref<FullScheduleSchema[] | null>(null);
queryFullSchedule().then((res) => {
});

Promise.all([
    queryCheckIns(),
    queryFullSchedule(),
]).then(([checkinRes, scheduleRes]) => {
    schedule.value = scheduleRes;
    const checkinMap = new Map(
        checkinRes.checkins.map((el) => {
            return [`${el.meet._ref}${el.discord_id}`, el];
        })
    );

    checkins.value = checkinRes.meets.map((meet) => {
        return {
            meet,
            players: checkinRes.players.map((player) => {
                return {
                    ...player,
                    checkinStatus:
                        checkinMap.get(`${meet._id}${player.discord_id}`)
                            ?.checkin_status ?? 'unknown',
                };
            }),
            userStatus:
                checkinMap.get(`${meet._id}${discord.id}`)?.checkin_status ??
                'unknown',
        };
    });
});



const availEmoji = computed(() => {
    return (avail: CheckinSingleSchema['checkin_status']) => {
        switch (avail) {
            case 'unavailable':
                return '❌';
            case 'unknown':
                return '💤';
            case 'rsvp':
                return '🟡';
            case 'checkedin':
                return '✅';
            default:
                return '🪦';
        }
    };
});

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

const checkinStartTime = (meetTime: string) => {
    const start = new Date(meetTime);
    const checkinStart = new Date(start.getTime() - checkinWindow);
    return useFormatDateTime(checkinStart.toISOString());
};

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

watch(discord, async (newDiscord) => {
    if (!newDiscord.accessToken) return;

    const pcheckins = await singlePlayerCheckin(discord.id);

    pcheckins?.forEach((pcheck) => {
        const existingMeet = checkins.value?.find(
            (check) => check.meet._id === pcheck.meet._ref
        );

        if (!existingMeet) return;
        existingMeet.userStatus = pcheck.checkin_status;
    });
});

</script>

<template>
    <div class="legend">
        <h2 class="legend-title">Legend</h2>
        <div class="key-wrapper">
            <div class="key">❌ Unavailable</div>
            <div class="key">💤 No Response</div>
            <div class="key">🟡 Will Attend</div>
            <div class="key">✅ Checked-In</div>
        </div>
    </div>
    <h2>Availability Overview</h2>
    <div class="checkin-wrapper">
        <CheckInSingle v-for="checkin in checkins" :checkin="checkin" :schedule="schedule"/>
    </div>
</template>

<style lang="scss" scoped>
pre {
    max-width: 500px;
}
.checkin {
    font-size: 1.25rem;
    margin-top: 5rem;
    &:first-child {
        margin-top: 0;
    }
}
.header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    h3 {
        margin: 0;
        line-height: 1;
    }
}
.players {
    width: 100%;
    margin-top: 1rem;
    display: grid;
    gap: 0.25rem;
    grid-template-columns: repeat(10, 1fr);
}
.player {
    background-color: rgba(128, 128, 128, 0.1);
    &:nth-child(odd) {
        background-color: rgba(128, 128, 128, 0.05);
    }
}
.name {
    width: 100%;
    text-align: center;
    line-height: 1;
    display: block;
    .pcode-name {
        font-size: 1rem;
        padding: 0.25rem 0;
        @media screen and (min-width: 600px) {
            font-size: 1.25rem;
            padding: 0.25rem 0;
        }
        @media screen and (min-width: 1628px) {
            display: none;
        }
    }
    .full-name {
        font-size: 1rem;
        display: none;
        padding: 0.5rem 0;
        font-size: 1.5cqw;
        @media screen and (min-width: 1628px) {
            display: block;
        }
        @media screen and (min-width: 1280px) {
            font-size: 1.25rem;
            padding: 1rem 0;
        }
    }
}
.availability {
    width: 100%;
    text-align: center;
    font-size: 0.75rem;
    line-height: 1;
    padding-bottom: 0.5rem;
    @media screen and (min-width: 600px) {
        font-size: 1.25rem;
        padding-bottom: 0.75rem;
    }
    @media screen and (min-width: 980px) {
        font-size: 1.25rem;
        padding-bottom: 1rem;
    }
}
.check-in-note {
    margin-top: 0.5rem;
}
.avatar {
    display: block;
    width: 100%;
    /* max-width: 20%; */
    height: auto;
}
.key-wrapper {
    display: inline-flex;
    border: 1px solid gray;
    gap: 0.5rem;
    padding: 0.5rem;
    font-size: 0.75rem;
    @media screen and (min-width: 600px) {
        gap: 1rem;
        padding: 1rem;
        font-size: 1rem;
    }
}
.logged-in {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.75rem;
}
.logged-out {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    background-color: #7289da;
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    border-radius: 0.5rem;

    button {
        padding: 0.25rem 1rem;
    }
}
.status-select {
    display: inline-block;
    padding: 0.5rem;
    font-size: 1rem;
}
</style>
