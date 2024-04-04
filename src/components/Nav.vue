<script setup lang="ts">
import { ref } from 'vue';

const navOpen = ref(false);
</script>

<template>
    <div class="nav-container" :class="{ active: navOpen }">
        <div class="nav-wrapper">
            <header>
                <div class="logo"><img src="/public/logo.svg" /></div>
            </header>
            <nav>
                <RouterLink to="/leaderboard">Leaderboard</RouterLink>
                <RouterLink to="/game-nights">Game Nights</RouterLink>
                <RouterLink to="/full-schedule">Full Schedule</RouterLink>
                <RouterLink to="/check-in">Check-In</RouterLink>
            </nav>
        </div>
        <div class="nav-toggle" @click="navOpen = !navOpen">
            <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="none"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="48"
                    d="M88 152h336M88 256h336M88 360h336"
                ></path>
            </svg>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.nav-container {
    position: fixed;
    z-index: 100;
    right: 0;
    transform: translateX(calc(280px - 1rem));
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transition: 300ms;
    &.active {
        transform: translateX(0);
    }
    @media screen and (min-width: 900px) {
        transition: 0ms;
        transform: none;
        position: static;
    }
}
.nav-wrapper {
    background-color: #f89c3d;
    background-image: url('/public/background-nav.svg'),
        linear-gradient(45deg, #f5d626, #f89c3d);
    background-repeat: no-repeat;
    background-size: 400%;
    background-position: 20% 130%;
    width: calc(280px - 1rem - 1rem);
    padding: 1rem;
    position: fixed;
    right: 0;
    z-index: 100;
    height: calc(100vh - 1rem - 1rem);
    border-radius: 1rem;
    margin: 1rem;
    box-shadow: 0.25rem 0.25rem 0 0 black;

    &::after {
        content: '';
        pointer-events: none;
        position: absolute;
        inset: 0.25rem;
        border: 2px solid white;
        border-radius: 0.75rem;
    }
    @media screen and (min-width: 900px) {
        transition: 0;
        position: sticky;
    }
}

.logo {
    transition: 200ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateX(50px) scale(0.5) rotate(30deg);

    .active & {
        transition-delay: 50ms;
        transform: translateX(0) scale(1.4) rotate(0);
    }
    @media screen and (min-width: 900px) {
        transform: translateX(0) scale(1.4) rotate(0);
    }
}

nav {
    margin-top: 3rem;
}

nav > a {
    color: #272f5a;
    font-size: 2rem;
    display: block;
    text-align: center;
    cursor: pointer;
    border-radius: 1rem;
    line-height: 1;
    margin: 0.25rem 0;
    padding: 0.25rem 0;
    &:hover {
        background-color: #272f5a;
        color: white;
    }
}

.nav-toggle {
    position: fixed;
    z-index: 200;
    top: 1rem;
    right: calc(280px);
    background-color: #f89c3d;
    background-image: linear-gradient(-45deg, #f5d626, #f89c3d);

    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    box-shadow: 0.25rem 0.25rem 0 0 black;

    @media screen and (min-width: 900px) {
        display: none;
    }

    &::after {
        pointer-events: none;
        content: '';
        position: absolute;
        border-radius: 0.75rem;
        inset: 0.25rem;
        border: 2px solid white;
    }
}

.nav-toggle svg {
    width: 2.75rem;
    height: 2.75rem;
}
</style>
