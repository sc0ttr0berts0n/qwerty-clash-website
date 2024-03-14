import { z, object, string, union, literal } from 'zod';

const leaderboardSchema = object({
    player: object({
        pcode: string().length(3),
        name: string(),
        color: string().length(7),
        avatar: object({ url: string().url() }),
    }),
    outcome: union([literal('win'), literal('loss')]),
});

export type LeaderboardSchema = z.infer<typeof leaderboardSchema>;
