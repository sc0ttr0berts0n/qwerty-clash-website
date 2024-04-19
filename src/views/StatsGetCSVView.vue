<script setup lang="ts">
import { ref } from 'vue';
import { useSanityClient } from '../composables/sanityClient';
import { array, literal, number, object, string, union, z } from 'zod';
import { LeaderboardSchema } from '../schemas/leaderboard';
import { RecordData } from '../composables/generateLeaderboard';
import { useGenerateLeaderboard } from '../composables/generateLeaderboard';

document.body.classList.add('stats', 'current-matches');

const hitAPI = async () => {
    const res = await fetch('/.netlify/functions/getcsv', {
        method: 'POST',
    });

    const data = await res.text();

    // Create a temporary link element
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;

    const getFilenameSafeISOString = (): string => {
        const isoDateString = new Date().toISOString();
        // Replace characters that are not safe in filenames
        return isoDateString.replace(/:/g, '-').replace(/\./g, '-');
    };

    const filename = `statlines-${getFilenameSafeISOString()}.csv`;

    // Extract filename from res headers, if available
    // const contentDisposition = res.headers['content-disposition'];
    // if (contentDisposition) {
    //     const matches = /filename="(.+?)"/.exec(contentDisposition);
    //     if (matches && matches.length > 1) {
    //         filename = matches[1];
    //     }
    // }

    // Set the filename and trigger the download
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
};
</script>

<template>
    <button @click="hitAPI()">Get CSV</button>
</template>

<style lang="scss">
.player {
    margin-top: 3rem;
    font-family: monospace;
    line-height: 1.1;
}
.key {
    &::after {
        content: ': ';
    }
}
button {
    text-align: center;
    background-color: #111111;
    line-height: 2;
    color: #272f5a;
    font-weight: bold;
    background-color: #f89c3d;
    background-image: url('/public/background-nav.svg'),
        linear-gradient(45deg, #f5d626, #f89c3d);
    background-repeat: no-repeat;
    background-size: 400%;
    background-position: 20% 130%;
    padding: 0.25rem 1rem;
    position: relative;
    border-radius: 1rem;
    margin: 0 1rem 1rem;
    margin-bottom: calc(env(safe-area-inset-bottom) + 1rem);
    box-shadow: 0.25rem 0.25rem 0 0 black;

    &::after {
        content: '';
        pointer-events: none;
        position: absolute;
        inset: 0.25rem;
        border: 2px solid white;
        border-radius: 0.75rem;
    }
}
</style>
