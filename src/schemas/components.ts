import { array, object, string, z } from 'zod';

export const player = object({
    pcode: string().length(3),
    name: string(),
    color: string().length(7),
    avatar: object({ url: string().url() }),
});

export const match = object({
    match_status: string(),
    game_number: string(),
    team_a: array(player),
    team_b: array(player),
});

export type MatchSchema = z.infer<typeof match>;
export type PlayerSchema = z.infer<typeof player>;
