import { useSanityClient } from '../composables/sanityClient';
import { LeaderboardSchema } from '../schemas/leaderboard';

const query = `
{
  "statlines": *[
    _type== "statline" &&
    match->season->number == '2'
  ] {
      player->{
        pcode,
      },
      outcome,
      match->{
        team_a[]->{pcode},
        team_b[]->{pcode}
      },
      kos
    },
    "players": *[_type == "player"] {
      pcode,
      name,
      "color": color.hex,
      "avatar": avatar.asset->{url},
    }
}`;

export const queryPlayerRecords = () => {
    return useSanityClient.fetch<LeaderboardSchema>(query);
};
