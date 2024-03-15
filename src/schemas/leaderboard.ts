import { z, object, union, literal } from 'zod';
import { player } from './components';

const leaderboardSchema = object({
    player,
    outcome: union([literal('win'), literal('loss')]),
});

export type LeaderboardSchema = z.infer<typeof leaderboardSchema>;
