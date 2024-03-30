import { array, literal, object, string, union, z } from 'zod';

export const player = object({
    pcode: string().length(3),
    name: string(),
    discord_id: string(),
    avatar: object({ url: string().url() }),
});

export const checkinSingle = object({
    meet: object({
        _ref: string().uuid(),
        _type: literal('reference'),
    }),
    discord_id: string(),
    checkin_status: union([
        literal('unknown'),
        literal('unavailable'),
        literal('rsvp'),
        literal('checkedin'),
    ]),
});

const meet = object({
    _id: string().uuid(),
    meet_time: string().datetime(),
});

const checkin = object({
    players: array(player),
    checkins: array(checkinSingle),
    meets: array(meet),
});

export type PlayerSchema = z.infer<typeof player>;
export type CheckinSingleSchema = z.infer<typeof checkinSingle>;
export type MeetSchema = z.infer<typeof meet>;
export type CheckinSchema = z.infer<typeof checkin>;
