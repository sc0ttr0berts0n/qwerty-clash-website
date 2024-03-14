import { createClient } from '@sanity/client';

export const useSanityClient = createClient({
    projectId: '6355cpgg',
    dataset: 'production',
    useCdn: false, // set to `false` to bypass the edge cache
    apiVersion: '2022-03-07', // use current date (YYYY-MM-DD) to target the latest API version
    // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});
