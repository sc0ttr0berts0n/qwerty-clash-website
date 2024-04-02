import { z, union, literal, array, string, object } from 'zod';
import { player } from './components';

const statline = object({
    player: object({ pcode: string() }),
    outcome: union([literal('win'), literal('loss')]),
});

const leaderboardSchema = object({
    statlines: array(statline),
    players: array(player),
});

export type StatlineSchema = z.infer<typeof statline>;
export type LeaderboardSchema = z.infer<typeof leaderboardSchema>;
