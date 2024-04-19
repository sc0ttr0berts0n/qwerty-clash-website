import type { Context } from '@netlify/functions';
import { createClient } from '@sanity/client';
import 'dotenv/config';

const client = createClient({
    projectId: '6355cpgg',
    dataset: 'production',
    useCdn: false, // set to `false` to bypass the edge cache
    apiVersion: '2022-03-07', // use current date (YYYY-MM-DD) to target the latest API version
});

const query = `
*[]
`;
async function fetchData() {
    const url = `https://6355cpgg.api.sanity.io/v2022-03-07/data/query/production?query=*%5B_type+%3D%3D+%22statline%22%5D%7B+++%27details%27%3A%5B+++%7B%27game%23%27%3Amatch-%3Egame_number%7D%2C+++%7B%27player%27%3Aplayer-%3Ename%7D%2C+++%7B%27character_selected%27%3Acharacter_selected-%3Ename%7D%2C+++%7Boutcome%7D%2C+++%7Bout_time%7D%2C+++%7Bkos%7D%2C+++%7Bfalls%7D%2C+++%7B%27sd%27%3Aself_destructs%7D%2C+++%7B%27dmg%2B%27%3Adamage_given%7D%2C+++%7B%27dmg-%27%3Adamage_taken%7D%2C+++%7B%27dmg_peak%27%3Adamage_peak%7D%2C+++%7B%27hit%25%27%3Ahit_rate%7D%2C+++%7Bsmash_attacks%7D%2C+++%7Bground_time%7D%2C+++%7Bair_time%7D%2C+++%7Bground_attacks%7D%2C+++%7Bair_attacks%7D%2C+++%7Bgrabs%7D%2C+++%7Bthrows%7D%2C+++%7Bedge_grabs%7D%2C+++%7Bprojectiles%7D%2C+++%7B_updatedAt%7D%2C+++%7B_createdAt%7D+%5D+%7D%0A`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function generate_csv(): Promise<string> {
    const allData = await fetchData();
    const dataDict = allData.result.map((r) => r.details);

    const header = dataDict[0].map((d) => Object.keys(d)).join(',');

    const rows = dataDict
        .map((data) => {
            return data.map((d) => Object.values(d)).join(',');
        })
        .join('\n');

    const csv = header + '\n' + rows;

    return csv;
}

const getFilenameSafeISOString = (): string => {
    const isoDateString = new Date().toISOString();
    // Replace characters that are not safe in filenames
    return isoDateString.replace(/:/g, '-').replace(/\./g, '-');
};

const filename = `statlines-${getFilenameSafeISOString()}`;

console.log('hiihihihihi');

export default async (req: Request, context: Context) => {
    try {
        return new Response(await generate_csv(), {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=`${filename}.csv`',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }));
    }
};
