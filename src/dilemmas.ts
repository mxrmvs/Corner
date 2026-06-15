import type { Player } from './types';

export interface DilemmaChoice {
  label: string;
  moraleEffect: number;    // efeito na moral do jogador
  squadEffect: number;     // efeito na moral do elenco inteiro
  balanceEffect: number;   // efeito no caixa
}

export interface Dilemma {
  id: string;
  subjectId: string;
  title: string;
  body: string;
  choices: DilemmaChoice[];
}

export function rollDilemma(players: Player[]): Dilemma | null {
  // só rola 40% de chance por rodada
  if (Math.random() > 0.4) return null;

  const candidates = players.filter(p =>
    p.clubId !== '' && (
      p.currentRating >= 78 ||
      p.age >= 32
    )
  );

  if (!candidates.length) return null;

  const p = candidates[Math.floor(Math.random() * candidates.length)];

  const dilemmas: Dilemma[] = [
    {
      id: `playtime_${p.id}`,
      subjectId: p.id,
      title: 'Pedido de mais minutos',
      body: `${p.name} está insatisfeito com o tempo de jogo e ameaça pedir transferência.`,
      choices: [
        { label: '✅ Prometer titularidade',      moraleEffect: +20, squadEffect:  0,  balanceEffect:  0          },
        { label: '🏋️ Mandar provar no treino',    moraleEffect:  -8, squadEffect:  0,  balanceEffect:  0          },
        { label: '🚪 Ignorar a reclamação',        moraleEffect: -15, squadEffect: -5,  balanceEffect:  0          },
      ],
    },
    {
      id: `raise_${p.id}`,
      subjectId: p.id,
      title: 'Pedido de aumento salarial',
      body: `${p.name} acha que merece um reajuste após suas boas atuações.`,
      choices: [
        { label: '💰 Conceder aumento',            moraleEffect: +18, squadEffect: +3,  balanceEffect: -500_000    },
        { label: '🤝 Negociar bônus por metas',    moraleEffect:  +6, squadEffect:  0,  balanceEffect: -100_000    },
        { label: '❌ Recusar',                     moraleEffect: -20, squadEffect: -3,  balanceEffect:  0          },
      ],
    },
    {
      id: `conflict_${p.id}`,
      subjectId: p.id,
      title: 'Conflito no vestiário',
      body: `${p.name} entrou em atrito com outro jogador durante o treino.`,
      choices: [
        { label: '🗣️ Reunião com o elenco',        moraleEffect:  +5, squadEffect: +8,  balanceEffect:  0          },
        { label: '⚠️ Advertir ${p.name}',          moraleEffect: -10, squadEffect: +5,  balanceEffect:  0          },
        { label: '🤐 Deixar passar',               moraleEffect:  0,  squadEffect: -8,  balanceEffect:  0          },
      ],
    },
    {
      id: `sponsor_${p.id}`,
      subjectId: p.id,
      title: 'Proposta de patrocinador',
      body: `Um patrocinador quer usar a imagem do clube. Requer aprovação da comissão.`,
      choices: [
        { label: '✅ Aceitar o contrato',           moraleEffect:  +5, squadEffect: +5,  balanceEffect: +1_000_000  },
        { label: '🔍 Negociar melhores termos',     moraleEffect:   0, squadEffect:  0,  balanceEffect: +600_000    },
        { label: '❌ Recusar por ética',            moraleEffect:  +3, squadEffect: +2,  balanceEffect:  0          },
      ],
    },
  ];

  return dilemmas[Math.floor(Math.random() * dilemmas.length)];
}