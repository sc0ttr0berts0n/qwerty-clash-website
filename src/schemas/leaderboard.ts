import { z, union, literal, array, string, object, number } from 'zod';
import { player } from './components';

const statline = object({
    player: object({ pcode: string() }),
    outcome: union([literal('win'), literal('loss')]),
    match: object({
        team_a: array(object({ pcode: string() })),
        team_b: array(object({ pcode: string() })),
    }),
    kos: number().nullable().optional(),
});

const leaderboardSchema = object({
    statlines: array(statline),
    players: array(player),
});

export type StatlineSchema = z.infer<typeof statline>;
export type LeaderboardSchema = z.infer<typeof leaderboardSchema>;
