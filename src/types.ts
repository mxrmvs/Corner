export type Position = 'GK' | 'DEF' | 'MID' | 'ATT';
export type PositionFilter = 'ALL' | Position;
export type TacticalStyle = 'TIKI_TAKA' | 'COUNTER' | 'DIRECT';
export type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '5-3-2';
export type Division = 'A' | 'B' | 'C' | 'D';

export interface PlayerAttributes {
  attack: number;    // 0-99
  defense: number;   // 0-99
  physical: number;  // 0-99
}

export interface PlayerCondition {
  stamina: number;      // 0-100 — resistência física; cai com minutos jogados, sobe com descanso
  morale: number;       // 0-100 — humor; sobe com vitórias/tempo de jogo, cai com derrotas/banco
  matchFitness: number; // 0-100 — ritmo de jogo; só sobe jogando ou treino intensivo; cai parado
}

export interface Player {
  id: string;
  name: string;
  age: number;
  position: Position;
  foot: 'Destro' | 'Canhoto';
  currentRating: number;   // 0-99 overall
  clubId: string;
  salary: number;
  marketValue: number;
  attributes: PlayerAttributes;
  condition: PlayerCondition; // substitui morale solto
}

// ── Helpers de condição ──────────────────────────────────────────────────────

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/** Aplicado após uma partida — desconta stamina/matchFitness pelo tempo jogado */
export function applyMatchImpact(p: Player, minutesPlayed: number, won: boolean): Player {
  const staminaDrain  = minutesPlayed * 0.55;          // 90min = -49.5
  const fitnessBump   = minutesPlayed > 45 ? +8 : minutesPlayed > 0 ? +4 : -3; // banco perde ritmo
  const moraleDelta   = won ? +6 : -4;

  return {
    ...p,
    condition: {
      stamina:      clamp(p.condition.stamina      - staminaDrain),
      matchFitness: clamp(p.condition.matchFitness + fitnessBump),
      morale:       clamp(p.condition.morale       + moraleDelta),
    },
  };
}

/** Aplicado no treino semanal — foco define o trade-off */
export type TrainingFocus = 'REST' | 'TECHNICAL' | 'PHYSICAL' | 'MOTIVATIONAL' | 'INTENSITY';

export function applyTrainingImpact(p: Player, focus: TrainingFocus): {
  player: Player; injured: boolean; note: string;
} {
  let stamina      = p.condition.stamina;
  let morale       = p.condition.morale;
  let matchFitness = p.condition.matchFitness;
  let injuryRisk   = 0.03;
  let note         = '';

  switch (focus) {
    case 'REST':
      stamina      = clamp(stamina + 30);
      matchFitness = clamp(matchFitness - 5);  // descanso perde ritmo levemente
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
      injuryRisk   = 0.09;  // alto risco
      break;
  }

  // Risco de lesão sobe com stamina baixa e idade
  const ageMultiplier = p.age >= 32 ? 1.6 : p.age >= 28 ? 1.2 : 1;
  const staminaMod    = stamina < 30 ? 1.5 : 1;
  const finalRisk     = injuryRisk * ageMultiplier * staminaMod;
  const injured       = Math.random() < finalRisk;

  if (injured) {
    note = `🚑 ${p.name} se lesionou no treino.`;
    morale = clamp(morale - 10);
  }

  return {
    player: { ...p, condition: { stamina, morale, matchFitness } },
    injured,
    note,
  };
}

/** Recuperação passiva semanal para jogadores que NÃO treinaram (IA ou reservas) */
export function passiveRecovery(p: Player): Player {
  return {
    ...p,
    condition: {
      stamina:      clamp(p.condition.stamina      + 15),
      matchFitness: clamp(p.condition.matchFitness - 3),
      morale:       clamp(p.condition.morale       - 1),
    },
  };
}

/** Rating efetivo em jogo — condition impacta até ±8 pontos */
export function effectiveRating(p: Player): number {
  const conditionAvg = (p.condition.stamina + p.condition.matchFitness + p.condition.morale) / 3;
  const modifier = ((conditionAvg - 50) / 50) * 8; // -8 a +8
  return Math.round(Math.max(40, Math.min(99, p.currentRating + modifier)));
}