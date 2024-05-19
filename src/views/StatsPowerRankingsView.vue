<script setup lang="ts">
import { ref } from 'vue';
import { useSanityClient } from '../composables/sanityClient';
import { array, literal, number, object, string, union, z } from 'zod';
import { LeaderboardSchema } from '../schemas/leaderboard';
import { RecordData } from '../composables/generateLeaderboard';
import { useGenerateLeaderboard } from '../composables/generateLeaderboard';

document.body.classList.add('stats', 'power-rankings');

const stats = array(
    object({
        pcode: string(),
        game_number: string(),
        outcome: union([literal('win'), literal('loss')]),
        damage_given: number(),
        damage_taken: number(),
        kos: number(),
        falls: number(),
        self_destructs: number(),
        character_selected: string(),
    })
);

interface IStats {
    currentPowerRanking: string;
    wins: number;
    losses: number;
    _koTotal: number;
    koAverage: string | undefined;
    _fallTotal: number;
    fallAverage: string | undefined;
    kdr: string | undefined;
    _dmgGivenTotal: number;
    dmgGivenAverage: string | undefined;
    _dmgTakenTotal: number;
    dmgTakenAverage: string | undefined;
    charactersUsed: Map<string, { times: number; percent: number | undefined }>;
    playerIndex: string;
    cumulativeRank: string[] | undefined;
    // ranks tbd
}

const showKeys = ref(true);

const pcodeToBcode = (pcode: any) => {
    // Use a switch statement to match the name to its corresponding code
    switch (pcode) {
        case 'LEE': // - Allegedlee / Lee
            return 1;
        case 'AMR': // - Amorales / Andrew
            return 2;
        case 'BBG': // - Bbgameslab / BB
            return 3;
        case 'ATM': // - At0msk / Britnaa
            return 4;
        case 'OSA': // - Osageoj / Cleclair / Chris
            return 5;
        case 'DVD': // - David
            return 6;
        case 'DRE': // - Dredre / Andres
            return 7;
        case 'XAV': // - F.C.P.X.A.V.I. / Xav
            return 8;
        case 'FLD': // - Fieldday / Kenny
            return 9;
        case 'GRY': // - Gray / Gary
            return 10;
        case 'JMZ': // - Jmarutz /
            return 11;
        case 'KLE': // - Kelebrae /
            return 12;
        case 'NCR': // - Nerd Cruncher /
            return 13;
        case 'OLI': // - Oli.Online / Oli
            return 14;
        case 'CPY': // - Sebaceous / Evan
            return 15;
        case 'SKT': // - Skataroni / Scott
            return 16;
        case 'CHZ': // - SuperChenz /
            return 17;
        case 'SWG': // - Swaggerdragon / Lawson
            return 18;
        case 'VNL': // - Venilor / Cody
            return 19;
        case 'VFT': // - Veshift / Tim
            return 20;
        default:
            return '??'; // Return 86 for unmatched cases
    }
};

const characterToNumber = (character: string): number | null => {
    const characterMap: { [key: string]: number } = {
        'Banjo & Kazooie': 1,
        Bayonetta: 2,
        Bowser: 3,
        'Bowser Jr': 4,
        Byleth: 5,
        'Captain Falcon': 6,
        Chrom: 7,
        Cloud: 8,
        Corrin: 9,
        Daisy: 10,
        'Dark Pit': 11,
        'Dark Samus': 12,
        'Diddy Kong': 13,
        'Donkey Kong': 14,
        'Dr. Mario': 15,
        'Duck Hunt': 16,
        Falco: 17,
        Fox: 18,
        Ganondorf: 19,
        Greninja: 20,
        Hero: 21,
        'Ice Climbers': 22,
        Ike: 23,
        Incineroar: 24,
        Inkling: 25,
        Isabelle: 26,
        Jigglypuff: 27,
        Joker: 28,
        Kazuya: 29,
        Ken: 30,
        'King Dedede': 31,
        'King K Rool': 32,
        Kirby: 33,
        Link: 34,
        'Little Mac': 35,
        Lucario: 36,
        Lucas: 37,
        Lucina: 38,
        Luigi: 39,
        Mario: 40,
        Marth: 41,
        'Mega Man': 42,
        'Meta Knight': 43,
        Mewtwo: 44,
        'Mii Brawler': 45,
        'Mii Gunner': 46,
        'Mii Swordfighter': 47,
        'Min Min': 48,
        'Mr. Game & Watch': 49,
        Ness: 50,
        Olimar: 51,
        PacMan: 52,
        Palutena: 53,
        Peach: 54,
        Pichu: 55,
        Pikachu: 56,
        'Piranha Plant': 57,
        Pit: 58,
        'Pokemon Trainer': 59,
        'Pyra/Mythra': 60,
        ROB: 61,
        Richter: 62,
        Ridley: 63,
        Robin: 64,
        Rosalina: 65,
        Roy: 66,
        Ryu: 67,
        Samus: 68,
        Sephiroth: 69,
        Sheik: 70,
        Shulk: 71,
        Simon: 72,
        Snake: 73,
        Sonic: 74,
        Sora: 75,
        Steve: 76,
        Terry: 77,
        'Toon Link': 78,
        Villager: 79,
        Wario: 80,
        'Wii Fit Trainer': 81,
        Wolf: 82,
        Yoshi: 83,
        'Young Link': 84,
        Zelda: 85,
        'Zero Suit Samus': 86,
    };

    return characterMap[character] || null;
};

export type StatsSchema = z.infer<typeof stats>;

const statMap = new Map<string, IStats>();

const playerInfo = ref<any>('lol');
const overalInfo = ref<any>('lol');

const meetLeaderboardMap = new Map<number, RecordData>();

const trimZeros = (n: number): string => {
    return n.toFixed(1).replace('.0', '');
};

useSanityClient
    .fetch(
        `
*[_type=="power_rankings" && _id=="26ca9852-9022-4cc5-a8d0-589cf6a48a89"] {
  meets[]->{
    match[]->{
      game_number
    }
  }
}
`
    )
    .then((data: Array<{ meets: { match: { game_number: number }[] }[] }>) => {
        Promise.all(
            data[0].meets.map((meet) => {
                const gameNumbers = meet.match
                    .map((g) => g.game_number)
                    .map((g) => {
                        return `match->game_number=="${g}"`;
                    })
                    .join('||');

                const query = `{ "statlines": *[ _type == "statline" && match->season->number == '2' && (${gameNumbers}) ] { player->{ pcode }, outcome, match->{ team_a[]->{ pcode }, team_b[]->{ pcode } }, kos }, "players": *[ _type == "player" ] { pcode, name, "color": color.hex, "avatar": avatar.asset->{ url }, } }`;

                return useSanityClient.fetch(query);
            })
        ).then((res: LeaderboardSchema[]) => {
            const cumulative = Array(res.length)
                .fill(0)
                .map((_el, index) => {
                    const statlines = res
                        .map((el) => el.statlines)
                        .slice(0, index + 1)
                        .flat();
                    return useGenerateLeaderboard({
                        statlines,
                        players: res[0].players,
                    });
                });

            const targetGames = data[0].meets
                .map((meet) => {
                    return meet.match.map((game) => game.game_number);
                })
                .flat()
                .map((g) => {
                    return `match->game_number=="${g}"`;
                })
                .join('||');

            const statlineQuery = `
        *[_type=="statline" && (${targetGames}) ] {
          "pcode": player->pcode,
          "character_selected": character_selected->name,
          "game_number": match->game_number,
          outcome,
          kos,
          falls,
          self_destructs,
          damage_given,
          damage_taken,
        }
            `;

            useSanityClient.fetch(statlineQuery).then((data: StatsSchema) => {
                // build up the data
                for (const el of data) {
                    if (!statMap.has(el.pcode)) {
                        statMap.set(el.pcode, {
                            currentPowerRanking: '?',
                            wins: 0,
                            losses: 0,
                            _koTotal: 0,
                            koAverage: undefined,
                            _fallTotal: 0,
                            fallAverage: undefined,
                            kdr: undefined,
                            _dmgGivenTotal: 0,
                            dmgGivenAverage: undefined,
                            _dmgTakenTotal: 0,
                            dmgTakenAverage: undefined,
                            charactersUsed: new Map<
                                string,
                                { times: number; percent: number | undefined }
                            >(),
                            playerIndex: pcodeToBcode(el.pcode).toString(),
                            cumulativeRank: undefined,
                        });
                    }

                    // input totals
                    const entry = statMap.get(el.pcode)!;

                    entry.wins += el.outcome === 'win' ? 1 : 0;
                    entry.losses += el.outcome === 'loss' ? 1 : 0;
                    entry._koTotal += el.kos;
                    entry._fallTotal += el.falls;
                    entry._dmgGivenTotal += el.damage_given;
                    entry._dmgTakenTotal += el.damage_taken;

                    // setup char usage
                    if (!entry.charactersUsed.has(el.character_selected)) {
                        entry.charactersUsed.set(el.character_selected, {
                            times: 0,
                            percent: undefined,
                        });
                    }

                    // count char usage
                    const charMap = entry.charactersUsed.get(
                        el.character_selected
                    )!;
                    charMap.times += 1;
                }

                // get avg stats
                statMap.forEach((p) => {
                    const gameCount = p.wins + p.losses;
                    p.charactersUsed.forEach((char) => {
                        char.percent = char.times / gameCount;
                    });
                    p.koAverage = trimZeros(p._koTotal / gameCount);
                    p.fallAverage = trimZeros(p._fallTotal / gameCount);
                    p.kdr = trimZeros(p._koTotal / p._fallTotal);
                    p.dmgGivenAverage = trimZeros(p._dmgGivenTotal / gameCount);
                    p.dmgTakenAverage = trimZeros(p._dmgTakenTotal / gameCount);
                });

                // final data return
                playerInfo.value = [...statMap.entries()].map(
                    ([pcode, stat]) => {
                        return {
                            pcode,
                            ...stat,
                            charactersUsed: [...stat.charactersUsed.entries()]
                                .sort((a, b) => {
                                    return b[1].times - a[1].times;
                                })
                                .slice(0, 5)
                                .map((ch) => {
                                    return {
                                        name: ch[0],
                                        index: characterToNumber(ch[0]),
                                        times: ch[1].times,
                                        percent: ch[1].percent,
                                    };
                                }),
                            cumulativeRank: cumulative.map((board) => {
                                return (
                                    board.findIndex(
                                        (p) => p.player.pcode === pcode
                                    ) + 1
                                );
                            }),
                            currentPowerRanking:
                                cumulative
                                    .at(-1)!
                                    ?.findIndex(
                                        (p) => p.player.pcode === pcode
                                    ) + 1,
                        };
                    }
                );

                const max = (key: string) => {
                    return Math.max(
                        ...playerInfo.value.map((p: any) => p[key])
                    );
                };

                const min = (key: string) => {
                    return Math.min(
                        ...playerInfo.value.map((p: any) => p[key])
                    );
                };

                const avg = (key: string) => {
                    const count = playerInfo.value.length;
                    const sum = playerInfo.value.reduce(
                        (acc: number, p: any) => {
                            return acc + Number(p[key]);
                        },
                        0
                    );
                    return sum / count;
                };

                overalInfo.value = {
                    ranks: cumulative
                        .at(-1)
                        ?.map((p) => pcodeToBcode(p.player.pcode)),
                    lowKO: trimZeros(min('koAverage')),
                    highKO: trimZeros(max('koAverage')),
                    avgKO: trimZeros(avg('koAverage')),
                    lowFalls: trimZeros(min('fallAverage')),
                    highFalls: trimZeros(max('fallAverage')),
                    avgFalls: trimZeros(avg('fallAverage')),
                    lowDmgGiven: trimZeros(min('dmgGivenAverage')),
                    highDmgGiven: trimZeros(max('dmgGivenAverage')),
                    avgDmgGiven: trimZeros(avg('dmgGivenAverage')),
                    lowDmgTaken: trimZeros(min('dmgTakenAverage')),
                    highDmgTaken: trimZeros(max('dmgTakenAverage')),
                    avgDmgTaken: trimZeros(avg('dmgTakenAverage')),
                    lowKDR: trimZeros(min('kdr')),
                    highKDR: trimZeros(max('kdr')),
                    avgKDR: trimZeros(avg('kdr')),
                };
            });
        });
    });
</script>

<template>
    <button @click="showKeys = !showKeys">hide keys</button>
    <div class="fields">
        <div class="player">
            <div class="entry">
                <span class="value">LEAGUE,</span>
            </div>
            <div class="entry" v-for="(el, index) in overalInfo.ranks">
                <span class="key" v-if="showKeys"
                    >POS{{ (index + 1).toString().padStart(2, '0') }}</span
                >
                <span class="value">{{ el }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Lowest KO</span>
                <span class="value">{{ overalInfo.lowKO }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Highest KO</span>
                <span class="value">{{ overalInfo.highKO }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Lowest Falls</span>
                <span class="value">{{ overalInfo.lowFalls }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Highest Falls</span>
                <span class="value">{{ overalInfo.highFalls }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Lowest DMG+</span>
                <span class="value">{{ overalInfo.lowDmgGiven }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Highest DMG+</span>
                <span class="value">{{ overalInfo.highDmgGiven }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Lowest DMG-</span>
                <span class="value">{{ overalInfo.lowDmgTaken }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Highest DMG-</span>
                <span class="value">{{ overalInfo.highDmgTaken }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Lowest KDR</span>
                <span class="value">{{ overalInfo.lowKDR }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Highest KDR</span>
                <span class="value">{{ overalInfo.highKDR }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">AVG KO</span>
                <span class="value">{{ overalInfo.avgKO }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">AVG Falls</span>
                <span class="value">{{ overalInfo.avgFalls }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">AVG DMG+</span>
                <span class="value">{{ overalInfo.avgDmgGiven }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">AVG DMG-</span>
                <span class="value">{{ overalInfo.avgDmgTaken }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">AVG KDR</span>
                <span class="value">{{ overalInfo.avgKDR }}</span>
            </div>
        </div>
        <div class="player" v-for="p in playerInfo">
            <div class="entry">
                <span class="key" v-if="showKeys">PCode</span>
                <span class="value">{{ p.pcode }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Current Power Ranking</span>
                <span class="value">{{ p.currentPowerRanking }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Wins</span>
                <span class="value">{{ p.wins }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Losses</span>
                <span class="value">{{ p.losses }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">KO Average</span>
                <span class="value">{{ p.koAverage }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">Fall Average</span>
                <span class="value">{{ p.fallAverage }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">KDR</span>
                <span class="value">{{ p.kdr }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">DMG+ Average</span>
                <span class="value">{{ p.dmgGivenAverage }},</span>
            </div>
            <div class="entry">
                <span class="key" v-if="showKeys">DMG- Average</span>
                <span class="value">{{ p.dmgTakenAverage }},</span>
            </div>

            <!-- most used char index -->
            <div
                class="entry"
                v-for="char in [
                    ...p.charactersUsed,
                    ...new Array(5).fill(0),
                ].slice(0, 5)"
            >
                <span class="key" v-if="showKeys">Most Used</span>
                <span v-if="char.name && showKeys" class="detail"
                    >({{ char.name }},
                    {{ char.percent.toFixed(1) * 100 }})</span
                >
                <span class="value">{{ char.index ?? 0 }},</span>
            </div>

            <!-- most used char percent -->
            <div
                class="entry"
                v-for="char in [
                    ...p.charactersUsed,
                    ...new Array(5).fill(0),
                ].slice(0, 5)"
            >
                <span class="key" v-if="showKeys">Most Used</span>
                <span v-if="char.name && showKeys" class="detail"
                    >({{ char.name }},
                    {{ char.percent.toFixed(1) * 100 }})</span
                >
                <span class="value"
                    >{{ ((char.percent ?? 0) * 100).toFixed(0) }},</span
                >
            </div>

            <div class="entry">
                <span class="key" v-if="showKeys">Player Index</span>
                <span class="detail" v-if="showKeys">({{ p.pcode }})</span>
                <span class="value">{{ p.playerIndex }},</span>
            </div>

            <!-- cumulative rank -->
            <div
                class="entry"
                v-for="(rank, index) in [
                    ...p.cumulativeRank,
                    ...new Array(11).fill(0),
                ].slice(0, 11)"
            >
                <span class="key" v-if="showKeys"
                    >Day {{ index + 1 }} Rank</span
                >
                <span class="value"
                    >{{ rank }}{{ index === 9 ? '' : ',' }}</span
                >
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.power-rankings {
    .player {
        margin-top: 1rem;
        font-family: monospace;
        line-height: 1.1;
    }
    .key {
        &::after {
            content: ': ';
        }
    }

    .entry {
        display: inline;
    }
}
</style>
