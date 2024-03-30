import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import {
    createMemoryHistory,
    createRouter,
    createWebHistory,
} from 'vue-router';

import LeaderboardView from './views/LeaderboardView.vue';
import MeetView from './views/MeetView.vue';
import CheckInView from './views/CheckInView.vue';
import DiscordAuthView from './views/DiscordAuthView.vue';

const routes = [
    { path: '/', component: LeaderboardView },
    { path: '/leaderboard', component: LeaderboardView },
    { path: '/meet', component: MeetView },
    { path: '/check-in', component: CheckInView },
    {
        path: '/auth/discord',
        component: DiscordAuthView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app');
