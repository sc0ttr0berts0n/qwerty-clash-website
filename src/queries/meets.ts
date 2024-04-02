import { useSanityClient } from '../composables/sanityClient';
import { MeetSchema } from '../schemas/meet';

const query = `
*[
  _type=="meet"
  && (
      // normal flow, now is greater than publish time
      // now is less than removal time
      (
        dateTime(publish_time) < dateTime(now())
        && dateTime(now()) < dateTime(remove_time)
      )
      // or forced to show
      || publish_overrides == 'force_show'
  )
  // and not forced to hide
  && publish_overrides != 'force_hide'
] | order(meet_time asc) {
  _id,
  meet_time,
  publish_time,
  remove_time,
  publish_overrides,
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
