import type { Player } from './types';

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

function gaussian(mean = 0, std = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const RETIRE_AGE: Record<string, number> = {
  GK: 39, DEF: 36, MID: 36, ATT: 35,
};

export interface EvolveResult {
  player: Player;
  retired: boolean;
  summary: string;
}

export function evolvePlayer(p: Player): EvolveResult {
  const age = p.age + 1;
  let rating = p.currentRating;
  let summary = '';

  if (age <= 23) {
    // JOVENS: cresce em direção ao potencial
    const gap = 90 - rating; // teto simplificado de 90
    const growth = clamp(gap * 0.12 + gaussian(0, 1.5), -2, 6);
    rating = clamp(rating + growth, 40, 90);
    summary = growth >= 2 ? `📈 ${p.name} evoluiu muito!`
            : growth >= 0 ? `📈 ${p.name} progrediu.`
            : `📉 ${p.name} não correspondeu às expectativas.`;
  } else if (age <= 29) {
    // AUGE: leve flutuação
    const drift = clamp(gaussian(0, 0.8), -1.5, 1.5);
    rating = clamp(rating + drift, 40, 99);
    summary = `➡️ ${p.name} manteve o nível.`;
  } else {
    // DECLÍNIO: perde atributos físicos
    const decay = 0.6 + (age - 30) * 0.3 + Math.max(0, gaussian(0, 0.4));
    rating = clamp(rating - decay, 35, 99);
    p.attributes.physical = clamp(p.attributes.physical - (1 + (age - 30) * 0.5), 20, 99);
    summary = `📉 ${p.name} (${age}) sentiu o desgaste.`;
  }

  // atributos acompanham o overall
  const delta = rating - p.currentRating;
  const updated: Player = {
    ...p,
    age,
    currentRating: Math.round(rating),
    attributes: {
      attack:   clamp(Math.round(p.attributes.attack  + delta * 0.8), 20, 99),
      defense:  clamp(Math.round(p.attributes.defense + delta * 0.8), 20, 99),
      physical: clamp(Math.round(p.attributes.physical), 20, 99),
    },
  };

  // aposentadoria dinâmica
  let retired = false;
  if (age >= 34) {
    const ceiling = RETIRE_AGE[p.position];
    const pr = clamp((age - (ceiling - 4)) / 6, 0, 1) * (rating < 70 ? 1.4 : 0.7);
    if (age >= ceiling || Math.random() < pr) {
      retired = true;
      summary = `👋 ${p.name} se aposentou aos ${age} anos.`;
    }
  }

  return { player: updated, retired, summary };
}

export function evolveSquad(players: Player[]): {
  players: Player[];
  retired: Player[];
  news: string[];
} {
  const next: Player[] = [];
  const retired: Player[] = [];
  const news: string[] = [];

  for (const p of players) {
    const { player, retired: isRetired, summary } = evolvePlayer(p);
    if (isRetired) {
      retired.push(p);
    } else {
      next.push(player);
    }
    news.push(summary);
  }

  return { players: next, retired, news };
}