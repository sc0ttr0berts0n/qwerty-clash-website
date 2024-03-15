import { useSanityClient } from '../composables/sanityClient';
import { LeaderboardSchema } from '../schemas/leaderboard';

const query = `
*[
  _type== "statline" &&
  match->season->number == '2'
] {
  player->{
    pcode,
    name,
    "color": color.hex,
    "avatar": avatar.asset->{url},
  },
  outcome,
}`;

export const queryPlayerRecords = () => {
    return useSanityClient.fetch<LeaderboardSchema[]>(query);
};
