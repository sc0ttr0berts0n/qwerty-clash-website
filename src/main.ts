import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import LeaderboardView from './views/LeaderboardView.vue';
import MeetView from './views/MeetView.vue';

const routes = [
    { path: '/', component: LeaderboardView },
    { path: '/leaderboard', component: LeaderboardView },
    { path: '/meet', component: MeetView },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

createApp(App).use(router).mount('#app');
