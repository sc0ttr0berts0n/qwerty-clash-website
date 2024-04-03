import { useSanityClient } from '../composables/sanityClient';
import { CheckinSchema } from '../schemas/checkin';

const query = `
{
  "players": *[_type == "player"] {
    pcode,
    name,
    discord_id,
    "avatar": avatar.asset->{url}
  },
  "checkins": *[_type == "checkin"] {
    meet,
    discord_id,
    checkin_status
  },
  "meets": *[_type == "meet" && dateTime(meet_time) > dateTime(now()) - 60*60*5] | order(meet_time asc) {
    _id,
    meet_time
  }
}`;

export const queryCheckIns = () => {
    return useSanityClient.fetch<CheckinSchema>(query);
};
