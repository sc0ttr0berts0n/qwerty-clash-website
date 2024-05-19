import { player } from './../schemas/components';
import { PlayerSchema } from '../schemas/components';
import { LeaderboardSchema, StatlineSchema } from '../schemas/leaderboard';

export interface RecordData {
    win: number;
    loss: number;
    kos: number;
    player: PlayerSchema;
    tieBreaker: ETieBreakers;
}

export enum ETieBreakers {
    WIN_RATE,
    LOSS,
    WIN,
    HEAD_TO_HEAD_WINS,
    KOS,
    HEAD_TO_HEAD_KOS,
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

            // Tie Breaker 1: win rate
            if (winRate !== 0) {
                return winRate;
            }

            // Tie Breaker 2: least losses
            const losses = a.loss - b.loss;
            if (losses !== 0) {
                (losses > 0 ? b : a).tieBreaker = ETieBreakers.LOSS;
                return losses;
            }

            // Tie Breaker 3: most wins
            const wins = b.win - a.win;
            if (wins !== 0) {
                (wins > 0 ? b : a).tieBreaker = ETieBreakers.WIN;
                return wins;
            }

            // when calcing miniseasons, exit here
            if (opts?.miniseason) return 0;

            // Tie Breaker 4: Head to Head Mini Season Wins
            const tiedPlayers = players.filter(
                (player) => player.win === a.win && player.loss === a.loss
            );
            const headToHead = _sortByMiniSeasonWins(
                tiedPlayers,
                a.player.pcode,
                b.player.pcode
            );
            if (headToHead.win !== 0) {
                (headToHead.win > 0 ? b : a).tieBreaker =
                    ETieBreakers.HEAD_TO_HEAD_WINS;
                return headToHead.win;
            }

            // Tie Breaker 5: KOs
            if (kos !== 0) {
                (kos > 0 ? b : a).tieBreaker = ETieBreakers.KOS;
                return kos;
            }

            // Tie Breaker 6: Head to Head Miniseason KOs
            if (headToHead?.ko !== 0) {
                (headToHead?.ko > 0 ? b : a).tieBreaker =
                    ETieBreakers.HEAD_TO_HEAD_KOS;
                console.log(headToHead);

                return headToHead?.ko;
            }

            // failsafe backup
            if (
                (a.player.pcode === 'SKT' && b.player.pcode === 'LEE') ||
                (a.player.pcode === 'LEE' && b.player.pcode === 'SKT')
            ) {
                // debugger;
            }

            // Tied
            a.tieBreaker = ETieBreakers.TIE;
            b.tieBreaker = ETieBreakers.TIE;
            return 0;
        });
    };

    const _sortByMiniSeasonWins = (
        tiedPlayers: RecordData[],
        aPCode: string,
        bPCode: string
    ): { win: number; ko: number } => {
        const tiedPCodes = tiedPlayers.map((el) => el.player.pcode);
        const miniseason = res.statlines.filter((statline) => {
            const statlinePlayer = statline.player.pcode;

            // guard if not from a/b perspective
            if (!tiedPCodes.includes(statlinePlayer)) return false;
            if (statline.outcome !== 'win') return false;

            const others = tiedPCodes.filter(
                (code) => code !== statline.player.pcode
            )!;

            return others.some((other) => {
                const team_aPCodes = statline.match.team_a.map((p) => p.pcode);
                const team_bPCodes = statline.match.team_b.map((p) => p.pcode);
                if (team_aPCodes.includes(statlinePlayer)) {
                    return team_bPCodes.includes(other);
                } else {
                    return team_aPCodes.includes(other);
                }
            });
        });

        const miniseasonPlayers = res.players.filter((p) =>
            tiedPCodes.includes(p.pcode)
        );
        const winLossData = _statlinesToWinLossData(
            miniseason,
            miniseasonPlayers
        );

        const miniSeasonResults = _sortPlayerSet(winLossData, {
            miniseason: true,
        });

        const aResults = miniSeasonResults.find(
            (result) => result.player.pcode === aPCode
        );
        const bResults = miniSeasonResults.find(
            (result) => result.player.pcode === bPCode
        );

        // if no wins for a or b, return 0
        if (!aResults || !bResults) {
            return { win: 0, ko: 0 };
        }

        // if no wins at all, return 0
        if (miniSeasonResults.every((res) => res.win === 0)) {
            return { win: 0, ko: 0 };
        }
        console.log(JSON.stringify(miniSeasonResults, null, 2));

        // if (
        //     (aPCode === 'SKT' || aPCode === 'LEE') &&
        //     (bPCode === 'SKT' || bPCode === 'LEE')
        // ) {
        //     debugger;
        // }
        const win = bResults.win - aResults.win;
        const ko = bResults.kos - aResults.kos;
        return { win, ko };
    };

    const winLossData = _statlinesToWinLossData(res.statlines, res.players);
    return _sortPlayerSet(winLossData);
};
