import { useSanityClient } from '../composables/sanityClient';
import { CheckinSchema, CheckinSingleSchema } from '../schemas/checkin';

export const singlePlayerCheckin = (discordID: string | undefined) => {
    if (!discordID) return console.error('discordID was null');
    const query = `
      *[_type == "checkin" && discord_id == "${discordID}"] {
        meet,
        discord_id,
        checkin_status
      }`;
    return useSanityClient.fetch<CheckinSingleSchema[]>(query);
};
