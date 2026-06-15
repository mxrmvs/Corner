import type { Player } from './types';

export interface MatchEvent {
  minute: number;
  text: string;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
}

function rng() {
  return Math.random();
}

function pickScorer(players: Player[]): Player {
  const attackers = players.filter(p => p.position === 'ATT' || p.position === 'MID');
  const pool = attackers.length ? attackers : players;
  const weights = pool.map(p => p.attributes.attack);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function teamRating(players: Player[]): number {
  if (!players.length) return 60;
  return players.reduce((s, p) => s + p.currentRating, 0) / players.length;
}

export function simulateMatch(
  homePlayers: Player[],
  awayPlayers: Player[],
  homeTeamName: string,
  awayTeamName: string,
): MatchResult {
  const events: MatchEvent[] = [];
  let homeGoals = 0;
  let awayGoals = 0;

  const homeStr = teamRating(homePlayers);
  const awayStr = teamRating(awayPlayers);
  const total = homeStr + awayStr;
  const homeAdvantage = homeStr / total + 0.05; // bônus de mando

  const MINUTES = [8,15,23,31,38,44,52,58,65,71,77,83,87,90];

  for (const minute of MINUTES) {
    const isHome = rng() < homeAdvantage;
    const attackers = isHome ? homePlayers : awayPlayers;
    const defStr = isHome ? awayStr : homeStr;
    const attStr = isHome ? homeStr : awayStr;
    const teamName = isHome ? homeTeamName : awayTeamName;

    const shotChance = 0.35 + (attStr - defStr) / 200;

    if (rng() < shotChance) {
      const scorer = pickScorer(attackers);
      const goalChance = 0.45 + (scorer.attributes.attack - defStr) / 300;

      if (rng() < goalChance) {
        if (isHome) homeGoals++; else awayGoals++;
        events.push({ minute, text: `⚽ Gol de ${scorer.name}! (${homeTeamName} ${homeGoals} x ${awayGoals} ${awayTeamName})` });
      } else if (rng() < 0.3) {
        events.push({ minute, text: `🧱 Na trave! ${scorer.name} quase abriu o placar pelo ${teamName}.` });
      } else {
        events.push({ minute, text: `⚠️ Goleiro adversário inspirado! Defendeu finalização de ${scorer.name}.` });
      }
    } else {
      const neutrals = [
        `${minute}' — ${teamName} pressiona mas a defesa afasta.`,
        `${minute}' — Troca de passes no meio-campo.`,
        `${minute}' — Falta perigosa para o ${teamName}.`,
      ];
      events.push({ minute, text: neutrals[Math.floor(rng() * neutrals.length)] });
    }
  }

  events.push({ minute: 90, text: `🏁 Fim de jogo! ${homeTeamName} ${homeGoals} x ${awayGoals} ${awayTeamName}` });

  return { homeGoals, awayGoals, events };
}
