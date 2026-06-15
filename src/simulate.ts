import type { Match } from './calendar';
import { CLUBS } from './clubs';

function teamStrength(clubId: string): number {
  const idx = CLUBS.findIndex(c => c.id === clubId);
  return 70 + (CLUBS.length - idx) * 1.5;
}

function poisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function simulateMatch(match: Match): Match {
  const homeStr = teamStrength(match.homeClubId);
  const awayStr = teamStrength(match.awayClubId);
  const diff = (homeStr - awayStr) / 10;
  const homeXg = Math.max(0.3, 1.4 + diff * 0.4 + 0.2);
  const awayXg = Math.max(0.2, 1.1 - diff * 0.4);
  return {
    ...match,
    homeGoals: poisson(homeXg),
    awayGoals: poisson(awayXg),
    played: true,
  };
}