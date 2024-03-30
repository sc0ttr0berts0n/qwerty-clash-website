import type { Context } from '@netlify/functions';
import { createClient } from '@sanity/client';
import 'dotenv/config';

const client = createClient({
    projectId: '6355cpgg',
    dataset: 'production',
    useCdn: false, // set to `false` to bypass the edge cache
    apiVersion: '2022-03-07', // use current date (YYYY-MM-DD) to target the latest API version
    token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

export default async (req: Request, context: Context) => {
    try {
        // inbound data
        const { accessToken, tokenType, meetID, checkinStatus } =
            await req.json();

        console.log('INBOUND DATA:');
        console.log({
            accessToken,
            tokenType,
            meetID,
            checkinStatus,
        });

        // hit discord and get user info
        const discordResult = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokenType} ${accessToken}`,
            },
        });
        const discordData = await discordResult.json();
        console.log('\nHITTING DISCORD FOR ID:');
        console.log({
            discordID: discordData.id,
        });

        // see if that user exists in the DB
        const knownUser = await client.fetch(
            `*[_type== "player" && discord_id == '${discordData.id}'] {name}`
        );
        console.log('\nCHECKING IF USER EXISTS IN CMS:');
        console.log({
            knownUser,
        });

        // if user doesnt exist, exit early with error
        if (!knownUser) {
            return new Response(
                JSON.stringify({
                    accessToken,
                    meetID,
                    checkinStatus,
                    discordData,
                    knownUser,
                    error: `Discord ID "${discordData.id}" not found in Player documents.`,
                })
            );
        }

        // User exists, so we create the doc to be inserted
        const doc = {
            _id: `checkin-${discordData.id}-${meetID}`,
            _type: 'checkin',
            discord_name: discordData.global_name,
            discord_id: discordData.id,
            checkin_status: checkinStatus,
            meet: {
                _ref: meetID,
                _type: 'meet',
            },
        };

        // place it
        const query = await client.createOrReplace(doc);

        if (query) {
            console.log('\nQUERY SUCCESSFUL:');
            console.log({
                query,
            });
        }

        // return metadata
        return new Response(
            JSON.stringify({
                accessToken,
                meetID,
                checkinStatus,
                discordData,
                knownUser,
                doc,
                query,
            })
        );
    } catch (error) {
        return new Response(JSON.stringify({ error }));
    }
};
