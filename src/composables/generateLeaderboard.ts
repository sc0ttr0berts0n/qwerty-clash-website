import { PlayerSchema } from '../schemas/components';
import { LeaderboardSchema, StatlineSchema } from '../schemas/leaderboard';

export interface RecordData {
    win: number;
    loss: number;
    kos: number;
    player: PlayerSchema;
    tieBreaker: ETieBreakers;
}

enum ETieBreakers {
    WIN_RATE,
    LOSS,
    WIN,
    HEAD_TO_HEAD,
    KOS,
    TIE,
}

export const useGenerateLeaderboard = (res: LeaderboardSchema) => {
    const _statlinesToWinLossData = (
        statlines: StatlineSchema[],
        players: PlayerSchema[]
    ) => {
        const map = new Map<
            string, // pcode
            RecordData
        >(
            players.map((player) => {
                return [
                    player.pcode,
                    {
                        win: 0,
                        loss: 0,
                        kos: 0,
                        player,
                        tieBreaker: ETieBreakers.WIN_RATE,
                    },
                ];
            })
        );

        statlines.forEach((statline) => {
            // guard aginst empty table entries
            if (!map.has(statline.player.pcode)) return;

            // Get the record for the player if it exists, otherwise initialize with default values.
            const record = map.get(statline.player.pcode);

            // Increment the count based on the outcome.
            record![statline.outcome] += 1;
            record!.kos += statline?.kos ?? 0;
        });

        return [...map.values()];
    };

    const _sortPlayerSet = (
        players: RecordData[],
        opts?: { miniseason: boolean }
    ) => {
        return players.sort((a, b) => {
            const aWinRate = a.win / (a.win + a.loss) || 0;
            const bWinRate = b.win / (b.win + b.loss) || 0;
            const winRate = bWinRate - aWinRate;
            const kos = b.kos - a.kos;

            if (winRate !== 0) {
                return winRate;
            }
            const losses = a.loss - b.loss;
            if (losses !== 0) {
                (losses > 0 ? b : a).tieBreaker = ETieBreakers.LOSS;
                return losses;
            }
            const wins = b.win - a.win;
            if (wins !== 0) {
                (wins > 0 ? b : a).tieBreaker = ETieBreakers.WIN;
                return wins;
            }
            if (opts?.miniseason) {
                return 0;
            }
            // if (b.player.pcode === 'OLI' && a.player.pcode === 'AMR') {
            //     debugger;
            // }
            const headToHead = _sortByMiniSeasonWins(a, b);
            if (headToHead !== 0) {
                (headToHead > 0 ? b : a).tieBreaker = ETieBreakers.HEAD_TO_HEAD;
                return headToHead;
            }
            if (kos !== 0) {
                (kos > 0 ? b : a).tieBreaker = ETieBreakers.KOS;
                return kos;
            }

            // failsafe backup
            a.tieBreaker = ETieBreakers.TIE;
            b.tieBreaker = ETieBreakers.TIE;
            return 0;
        });
    };

    const _sortByMiniSeasonWins = (a: RecordData, b: RecordData): number => {
        const pcodes = [a.player.pcode, b.player.pcode];
        const miniseason = res.statlines.filter((statline) => {
            const player = statline.player.pcode;

            // guard if not from a/b perspective
            if (!pcodes.includes(player)) return false;

            const other = pcodes.find(
                (code) => code !== statline.player.pcode
            )!;
            const team_a = statline.match.team_a.map((p) => p.pcode);
            const team_b = statline.match.team_b.map((p) => p.pcode);
            if (team_a.includes(player)) {
                return team_b.includes(other);
            } else {
                return team_a.includes(other);
            }
        });

        const miniseasonPlayers = res.players.filter((p) =>
            pcodes.includes(p.pcode)
        );
        const winLossData = _statlinesToWinLossData(
            miniseason,
            miniseasonPlayers
        );

        const miniSeasonResults = _sortPlayerSet(winLossData, {
            miniseason: true,
        });

        // if no wins at all, return 0
        if (miniSeasonResults.every((res) => res.win === 0)) return 0;

        // otherwise top player wins
        return miniSeasonResults[0].player.pcode === a.player.pcode ? -1 : 1;
    };

    const winLossData = _statlinesToWinLossData(res.statlines, res.players);
    return _sortPlayerSet(winLossData);
};
