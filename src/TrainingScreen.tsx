import { useState } from 'react';
import type { Player } from './types';
import type { TrainingFocus } from './training';

const FOCUS_OPTIONS: { value: TrainingFocus; label: string; desc: string; color: string }[] = [
  { value: 'ATTACK',    label: '⚔️ Ataque',     desc: '+ATQ',           color: 'text-[#FB5C6B]'  },
  { value: 'DEFENSE',   label: '🛡️ Defesa',     desc: '+DEF',           color: 'text-[#38BDF8]'  },
  { value: 'INTENSITY', label: '🔥 Intensidade', desc: '+Tudo / 2x risco', color: 'text-[#FBBF24]'  },
  { value: 'BALANCED',  label: '⚖️ Equilibrado', desc: '+FÍS',           color: 'text-[#2DFFA8]'  },
];

const POSITION_LABEL: Record<string, string> = {
  GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA',
};

interface Props {
  players: Player[];
  onApply: (focusMap: Record<string, TrainingFocus>) => void;
}

export const TrainingScreen = ({ players, onApply }: Props) => {
  const myPlayers = players.filter(p => p.clubId !== '');
  const [focusMap, setFocusMap] = useState<Record<string, TrainingFocus>>(() => {
    const m: Record<string, TrainingFocus> = {};
    myPlayers.forEach(p => { m[p.id] = 'BALANCED'; });
    return m;
  });
  const [applied, setApplied] = useState(false);

  const setAll = (focus: TrainingFocus) => {
    const m: Record<string, TrainingFocus> = {};
    myPlayers.forEach(p => { m[p.id] = focus; });
    setFocusMap(m);
  };

  const handleApply = () => {
    onApply(focusMap);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Centro de Treino</h2>
          <p className="text-xs text-[#8B97A3] mt-0.5">Defina o foco semanal de cada jogador</p>
        </div>
        <div className="flex gap-2">
          {FOCUS_OPTIONS.map(f => (
            <button key={f.value} onClick={() => setAll(f.value)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/[0.06] text-[#8B97A3] hover:bg-white/10 transition-all cursor-pointer">
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legenda de risco */}
      <div className="bg-[rgba(251,191,36,0.06)] border border-[#FBBF24]/20 rounded-xl px-4 py-3 text-xs text-[#FBBF24]">
        ⚠️ Treino de <strong>Intensidade</strong> dobra a chance de lesão, mas acelera a evolução em todos os atributos.
      </div>

      {/* Lista de jogadores */}
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl overflow-hidden">
        {myPlayers.map((p, i) => (
          <div key={p.id}
            className={`flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] last:border-0 ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
            {/* Info jogador */}
            <div className="w-8 text-center text-lg font-black text-[#2DFFA8]">
              {p.currentRating}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#E6EDF3] truncate">{p.name}</span>
                <span className="text-xs bg-white/[0.06] text-[#8B97A3] px-2 py-0.5 rounded-md font-bold">
                  {POSITION_LABEL[p.position]}
                </span>
              </div>
              <div className="text-xs text-[#8B97A3] mt-0.5">{p.age} anos</div>
            </div>

            {/* Seletor de foco */}
            <div className="flex gap-1">
              {FOCUS_OPTIONS.map(f => (
                <button key={f.value}
                  onClick={() => setFocusMap(prev => ({ ...prev, [p.id]: f.value }))}
                  title={f.desc}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer
                    ${focusMap[p.id] === f.value
                      ? `bg-white/10 ${f.color} ring-1 ring-current`
                      : 'bg-white/[0.03] text-[#8B97A3] hover:bg-white/[0.06]'
                    }`}>
                  {f.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleApply}
        className="bg-[#2DFFA8] text-[#0B0F14] font-black py-3 rounded-full text-sm hover:brightness-110 transition-all cursor-pointer">
        {applied ? '✓ Treino aplicado!' : '▶ Aplicar Treino da Semana'}
      </button>
    </div>
  );
};