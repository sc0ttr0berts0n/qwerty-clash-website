import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import {
    createMemoryHistory,
    createRouter,
    createWebHistory,
} from 'vue-router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import LeaderboardView from './views/LeaderboardView.vue';
import MeetView from './views/MeetView.vue';
import FullSchedule from './views/FullScheduleView.vue';
import CheckInView from './views/CheckInView.vue';
import DiscordAuthView from './views/DiscordAuthView.vue';
import TwitchLeaderboardView from './views/TwitchLeaderboardView.vue';
import TwitchUpcomingGames from './views/TwitchUpcomingGamesView.vue';
import StatsCurrentMatches from './views/StatsCurrentMatches.vue';

const routes = [
    { path: '/', component: LeaderboardView },
    { path: '/leaderboard', component: LeaderboardView },
    { path: '/game-nights', component: MeetView },
    { path: '/full-schedule', component: FullSchedule },
    { path: '/check-in', component: CheckInView },
    { path: '/twitch-leaderboard', component: TwitchLeaderboardView },
    { path: '/twitch-upcoming-games', component: TwitchUpcomingGames },
    { path: '/stats-current-matches', component: StatsCurrentMatches },
    {
        path: '/auth/discord',
        component: DiscordAuthView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const vuetify = createVuetify({
    components,
    directives,
});

createApp(App).use(router).use(vuetify).mount('#app');
