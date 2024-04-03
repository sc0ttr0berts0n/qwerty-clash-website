import { useSanityClient } from '../composables/sanityClient';
import { FullScheduleSchema } from '../schemas/fullSchedule';

const query = `
*[_type== "match" && season->number == "2"] | order(game_number asc) {
    match_status,
    game_number,
    team_a[]->{
      pcode,
      name,
      "avatar": avatar.asset->{url}
    },
    team_b[]->{
      pcode,
      name,
      "avatar": avatar.asset->{url}
    }
}`;

export const queryFullSchedule = () => {
    return useSanityClient.fetch<FullScheduleSchema[]>(query);
};
