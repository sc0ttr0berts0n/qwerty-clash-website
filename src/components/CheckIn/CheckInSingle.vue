<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { singlePlayerCheckin } from '../../queries/singlePlayerCheckin';
import { discord } from '../../store/discord';
import { useDiscordCredentials } from '../../composables/discordCredentials';
import { useFormatDateTime } from '../../composables/formatDateTime';
import {
    MeetSchema,
    PlayerSchema,
    CheckinSingleSchema,
} from '../../schemas/checkin';
import { useSendCheckIn } from '../../composables/sendCheckIn';
import { FullScheduleSchema } from '../../schemas/fullSchedule';
import MiniMatch from '../MiniMatch.vue';
import { MatchSchema } from '../../schemas/components';
import { parseCommandLine } from 'typescript';

export type CheckinFromComponent = {
    meet: MeetSchema;
    players: Array<
        PlayerSchema & {
            checkinStatus: CheckinSingleSchema['checkin_status'];
        }
    >;
    userStatus: CheckinSingleSchema['checkin_status'];
};

const props = defineProps<{
    checkin: CheckinFromComponent;
    schedule: FullScheduleSchema[] | null;
}>();

const { checkin, schedule } = props;

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

const checkinWindow = 1000 * 60 * 60 * 3; // 3 hours

const options = ref([
    { text: '💤 No Response', value: 'unknown' },
    { text: '❌ Unavailable', value: 'unavailable' },
    { text: '🟡 Will Attend', value: 'rsvp' },
    { text: '✅ Check-In', value: 'checkedin' },
]);

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

watch(discord, async (newDiscord) => {
    if (!newDiscord.accessToken) return;

    const pcheckins = await singlePlayerCheckin(discord.id);

    pcheckins?.forEach((pcheck) => {
        const existingMeet = checkin.meet._id === pcheck.meet._ref;

        if (!existingMeet) return;
        checkin.userStatus = pcheck.checkin_status;
    });
});

const possibleMatches = computed((): MatchSchema[] => {
    const avail = checkin.players
        .filter(
            (p) => p.checkinStatus === 'checkedin' || p.checkinStatus === 'rsvp'
        )
        .map((p) => p.pcode);
    const matches =
        schedule
            ?.filter((match) => {
                // only matches which are pending
                if (match.match_status !== 'pending') return false;

                // get a list of all matches players
                const players = [...match.team_a, ...match.team_b];

                // make sure every player in match is avail
                return players.every((p) => avail.includes(p.pcode));
            })
            ?.slice(0, 10) ?? [];

    return matches;
});

const appearances = computed(() => {
    const pMap = new Map(checkin.players.map((p) => [p.pcode, 0]));
    possibleMatches.value
        .map((m) => [
            ...m.team_a.map((p) => p.pcode),
            ...m.team_b.map((p) => p.pcode),
        ])
        .flat()
        .forEach((p) => {
            const count = pMap.get(p);
            if (count !== undefined) {
                pMap.set(p, count + 1);
            }
        });

    const byes = [...pMap.entries()]
        .filter(([_p, count]) => count === 0)
        .map(([pcode]) => pcode);
    const participant = [...pMap.entries()]
        .filter(([_p, count]) => count > 0)
        .map(([pcode, count]) => {
            return { pcode, count };
        });

    return {
        byes,
        participant,
    };
});
</script>

<template>
    <div class="checkin">
        <div class="header">
            <h3>{{ useFormatDateTime(checkin.meet.meet_time) }}</h3>
            <div class="your-status">
                <div class="logged-in" v-show="discord.accessToken">
                    <div class="label">Your Status:</div>
                    <select
                        name="status"
                        class="status-select"
                        v-model="checkin.userStatus"
                        @change="
                            proxySendCheckIn(
                                checkin.meet._id,
                                checkin.userStatus
                            )
                        "
                    >
                        <option
                            v-for="option in options.filter((opt) => {
                                return isOptionAvailable(
                                    opt.value,
                                    checkin.meet.meet_time
                                );
                            })"
                            :value="option.value"
                        >
                            {{ option.text }}
                        </option>
                    </select>
                </div>
                <div class="logged-out" v-show="!discord.accessToken">
                    <div class="label">Login to set status</div>
                    <button @click="useDiscordCredentials(false)">
                        Discord
                    </button>
                </div>
            </div>
        </div>
        <div class="check-in-note">
            <p v-if="isCheckinAvailable(checkin.meet.meet_time)">
                Check-in is now open!
            </p>
            <p v-else>
                Please share your tentative availability now and stop back
                later. Check-in begins
                {{ checkinStartTime(checkin.meet.meet_time) }}.
            </p>
        </div>
        <div class="players">
            <div
                class="player"
                v-for="player in checkin.players"
                :key="player.name"
            >
                <img
                    class="avatar"
                    :src="player.avatar.url"
                    alt=""
                    width="500"
                    height="500"
                />
                <div class="name">
                    <div class="full-name">{{ player.name }}</div>
                    <div class="pcode-name">{{ player.pcode }}</div>
                </div>
                <div class="availability">
                    {{ availEmoji(player.checkinStatus) }}
                </div>
            </div>
        </div>
        <h3>Possible Matches</h3>
        <p>These are subject to change as availability updates.</p>
        <div class="matches-wrapper">
            <MiniMatch v-for="match in possibleMatches" :match="match" />
        </div>
        <div class="appearances">
            <h4>Byes</h4>
            {{ appearances.byes.join(', ') }}
            <h4>Game Count:</h4>
            <span v-for="p in appearances.participant"
                >{{ p.pcode }}: {{ p.count }}<br
            /></span>
        </div>
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

.matches-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 750px;
}
</style>
