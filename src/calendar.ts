import { CLUBS } from './clubs';

export interface Match {
  id: string;
  round: number;
  homeClubId: string;
  awayClubId: string;
  homeGoals?: number;
  awayGoals?: number;
  played: boolean;
}

export interface Calendar {
  rounds: Match[][];
  currentRound: number;
}

function roundRobin(ids: string[]): string[][][] {
  const list = [...ids];
  if (list.length % 2) list.push('BYE');
  const n = list.length;
  const rounds: string[][][] = [];
  for (let r = 0; r < n - 1; r++) {
    const pairs: string[][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i], b = list[n - 1 - i];
      if (a !== 'BYE' && b !== 'BYE')
        pairs.push(r % 2 ? [b, a] : [a, b]);
    }
    rounds.push(pairs);
    list.splice(1, 0, list.pop()!);
  }
  return rounds;
}

export function generateCalendar(): Calendar {
  const ids = CLUBS.map(c => c.id);
  const firstHalf = roundRobin(ids);
  // returno: inverte mando
  const secondHalf = firstHalf.map(round =>
    round.map(([h, a]) => [a, h])
  );
  const allRounds = [...firstHalf, ...secondHalf];

  const rounds: Match[][] = allRounds.map((pairs, ri) =>
    pairs.map(([ homeClubId, awayClubId ], mi) => ({
      id: `r${ri + 1}m${mi + 1}`,
      round: ri + 1,
      homeClubId,
      awayClubId,
      played: false,
    }))
  );

  return { rounds, currentRound: 1 };
}