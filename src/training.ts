import type { Player } from './types';

export type TrainingFocus = 'REST' | 'TECHNICAL' | 'PHYSICAL' | 'MOTIVATIONAL' | 'INTENSITY';

interface TrainingResult {
  player: Player;
  injured: boolean;
  note: string;
}

function clamp(v: number) { return Math.max(0, Math.min(100, v)); }

function applyTraining(p: Player, focus: TrainingFocus): TrainingResult {
  let stamina      = p.condition.stamina;
  let morale       = p.condition.morale;
  let matchFitness = p.condition.matchFitness;
  let injuryRisk   = 0.03;

  switch (focus) {
    case 'REST':
      stamina      = clamp(stamina + 30);
      matchFitness = clamp(matchFitness - 5);
      morale       = clamp(morale + 4);
      injuryRisk   = 0;
      break;
    case 'TECHNICAL':
      stamina      = clamp(stamina - 8);
      matchFitness = clamp(matchFitness + 6);
      morale       = clamp(morale + 2);
      injuryRisk   = 0.02;
      break;
    case 'PHYSICAL':
      stamina      = clamp(stamina - 15);
      matchFitness = clamp(matchFitness + 4);
      morale       = clamp(morale - 2);
      injuryRisk   = 0.05;
      break;
    case 'MOTIVATIONAL':
      stamina      = clamp(stamina - 5);
      matchFitness = clamp(matchFitness + 2);
      morale       = clamp(morale + 18);
      injuryRisk   = 0.01;
      break;
    case 'INTENSITY':
      stamina      = clamp(stamina - 25);
      matchFitness = clamp(matchFitness + 14);
      morale       = clamp(morale - 5);
      injuryRisk   = 0.09;
      break;
  }

  const ageMultiplier = p.age >= 32 ? 1.6 : p.age >= 28 ? 1.2 : 1;
  const staminaMod    = stamina < 30 ? 1.5 : 1;
  const finalRisk     = injuryRisk * ageMultiplier * staminaMod;
  const injured       = Math.random() < finalRisk;

  if (injured) morale = clamp(morale - 10);

  return {
    player:  { ...p, condition: { stamina, morale, matchFitness } },
    injured,
    note: injured ? `🚑 ${p.name} se lesionou no treino.` : '',
  };
}

export function applySquadTraining(
  players: Player[],
  focusMap: Record<string, TrainingFocus>,
): { players: Player[]; injuries: string[] } {
  const injuries: string[] = [];
  const updated = players.map(p => {
    const focus = focusMap[p.id];
    if (!focus) return p;
    const result = applyTraining(p, focus);
    if (result.injured && result.note) injuries.push(result.note);
    return result.player;
  });
  return { players: updated, injuries };
}
