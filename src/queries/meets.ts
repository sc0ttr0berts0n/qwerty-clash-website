import { useSanityClient } from '../composables/sanityClient';
import { MeetSchema } from '../schemas/meet';

const query = `
*[_type=="meet"] | order(meet_time asc) {
  _id,
  meet_time,
  match[]->{
    match_status,
    game_number,
    team_a[]->{
      pcode,
      name,
      "color": color.hex,
      "avatar": avatar.asset->{url}
    },
    team_b[]->{
      pcode,
      name,
      "color": color.hex,
      "avatar": avatar.asset->{url}
    }
  }
}`;

export const queryMeet = () => {
    return useSanityClient.fetch<MeetSchema[]>(query);
};
