import type { Player } from './types';

export type TrainingFocus = 'ATTACK' | 'DEFENSE' | 'INTENSITY' | 'BALANCED';

const BASE_INJURY_RISK = 0.04;

export interface TrainingResult {
  player: Player;
  injured: boolean;
  note: string;
}

export function applyTraining(p: Player, focus: TrainingFocus): TrainingResult {
  const np: Player = { ...p, attributes: { ...p.attributes } };
  let injuryRisk = BASE_INJURY_RISK;
  const ageRisk = np.age >= 30 ? 1.5 : np.age <= 21 ? 0.8 : 1;

  switch (focus) {
    case 'ATTACK':
      np.attributes.attack = Math.min(99, np.attributes.attack + 0.3);
      break;
    case 'DEFENSE':
      np.attributes.defense = Math.min(99, np.attributes.defense + 0.3);
      break;
    case 'INTENSITY':
      np.attributes.attack   = Math.min(99, np.attributes.attack   + 0.35);
      np.attributes.defense  = Math.min(99, np.attributes.defense  + 0.35);
      np.attributes.physical = Math.min(99, np.attributes.physical + 0.5);
      injuryRisk *= 2;
      break;
    case 'BALANCED':
      np.attributes.physical = Math.min(99, np.attributes.physical + 0.2);
      break;
  }

  np.currentRating = Math.round(
    np.attributes.attack * 0.4 +
    np.attributes.defense * 0.35 +
    np.attributes.physical * 0.25
  );

  if (Math.random() < injuryRisk * ageRisk) {
    const weeks = 1 + Math.floor(Math.random() * 5);
    return {
      player: np,
      injured: true,
      note: `🚑 ${p.name} se lesionou no treino! (${weeks} sem. afastado)`,
    };
  }

  return { player: np, injured: false, note: '' };
}

export function applySquadTraining(
  players: Player[],
  focusMap: Record<string, TrainingFocus>,
): { players: Player[]; injuries: string[] } {
  const result: Player[] = [];
  const injuries: string[] = [];

  for (const p of players) {
    const focus = focusMap[p.id] ?? 'BALANCED';
    const { player, injured, note } = applyTraining(p, focus);
    result.push(player);
    if (injured) injuries.push(note);
  }

  return { players: result, injuries };
}