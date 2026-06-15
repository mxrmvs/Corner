import { useState } from 'react';
import type { Player } from './types';

const POSITION_LABEL: Record<string, string> = {
  GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA',
};

const ratingColor = (v: number) =>
  v >= 85 ? 'text-[#2DFFA8]' : v >= 75 ? 'text-[#38BDF8]' : v >= 65 ? 'text-[#FBBF24]' : 'text-[#8B97A3]';

interface Props {
  players: Player[];
  onConfirm: (lineup: Player[]) => void;
  onBack: () => void;
}

export const LineupScreen = ({ players, onConfirm, onBack }: Props) => {
  const available = players.filter(p => p.clubId !== '');
  const [selected, setSelected] = useState<string[]>(() =>
    available.slice(0, 11).map(p => p.id)
  );

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(x => x !== id));
    } else if (selected.length < 11) {
      setSelected(prev => [...prev, id]);
    }
  };

  const selectedPlayers = selected.map(id => available.find(p => p.id === id)!).filter(Boolean);

  const posCounts = {
    GK:  selectedPlayers.filter(p => p.position === 'GK').length,
    DEF: selectedPlayers.filter(p => p.position === 'DEF').length,
    MID: selectedPlayers.filter(p => p.position === 'MID').length,
    ATT: selectedPlayers.filter(p => p.position === 'ATT').length,
  };

  const isValid = posCounts.GK >= 1 && posCounts.DEF >= 3 &&
    posCounts.MID >= 2 && posCounts.ATT >= 1 && selected.length === 11;

  const avgRating = selectedPlayers.length
    ? Math.round(selectedPlayers.reduce((s, p) => s + p.currentRating, 0) / selectedPlayers.length)
    : 0;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Escalar Time</h2>
          <p className="text-xs text-[#8B97A3] mt-0.5">Selecione exatamente 11 jogadores</p>
        </div>
        <button onClick={onBack}
          className="text-[#8B97A3] hover:text-[#E6EDF3] text-sm cursor-pointer transition-colors">
          ← Voltar
        </button>
      </div>

      {/* Status da escalação */}
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold">
            {selected.length}/11 selecionados
          </span>
          <span className={`text-sm font-black ${ratingColor(avgRating)}`}>
            OVR médio: {avgRating}
          </span>
        </div>
        <div className="flex gap-3 text-xs">
          {(['GK','DEF','MID','ATT'] as const).map(pos => (
            <span key={pos} className={`font-bold px-2 py-1 rounded-lg
              ${posCounts[pos] > 0 ? 'bg-white/[0.08] text-[#E6EDF3]' : 'bg-white/[0.03] text-[#8B97A3]'}`}>
              {POSITION_LABEL[pos]}: {posCounts[pos]}
            </span>
          ))}
        </div>
        {!isValid && selected.length === 11 && (
          <p className="text-xs text-[#FB5C6B] mt-2">
            ⚠️ Precisa de ao menos: 1 GOL, 3 ZAG, 2 MEI, 1 ATA
          </p>
        )}
      </div>

      {/* Lista de jogadores */}
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl overflow-hidden">
        {(['GK','DEF','MID','ATT'] as const).map(pos => {
          const group = available.filter(p => p.position === pos);
          if (!group.length) return null;
          return (
            <div key={pos}>
              <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.04]">
                <span className="text-xs font-bold text-[#8B97A3] uppercase tracking-wider">
                  {POSITION_LABEL[pos]}
                </span>
              </div>
              {group.map((p, i) => {
                const isSel = selected.includes(p.id);
                return (
                  <button key={p.id} onClick={() => toggle(p.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] last:border-0
                      text-left transition-all cursor-pointer
                      ${isSel
                        ? 'bg-[rgba(45,255,168,0.06)] hover:bg-[rgba(45,255,168,0.08)]'
                        : 'hover:bg-white/[0.03]'
                      } ${i === group.length - 1 ? '' : ''}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                      ${isSel ? 'border-[#2DFFA8] bg-[#2DFFA8]' : 'border-white/20'}`}>
                      {isSel && <span className="text-[#0B0F14] text-xs font-black">✓</span>}
                    </div>
                    <span className={`text-2xl font-black tabular-nums w-8 ${ratingColor(p.currentRating)}`}>
                      {p.currentRating}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isSel ? 'text-[#2DFFA8]' : 'text-[#E6EDF3]'}`}>
                        {p.name}
                      </p>
                      <p className="text-xs text-[#8B97A3]">{p.age} anos · {p.foot}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <span className="text-xs text-[#8B97A3]">ATA {p.attributes.attack}</span>
                      <span className="text-xs text-[#8B97A3]">·</span>
                      <span className="text-xs text-[#8B97A3]">DEF {p.attributes.defense}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => isValid && onConfirm(selectedPlayers)}
        disabled={!isValid}
        className={`py-3 rounded-full text-sm font-black transition-all
          ${isValid
            ? 'bg-[#2DFFA8] text-[#0B0F14] hover:brightness-110 cursor-pointer'
            : 'bg-white/[0.06] text-[#8B97A3] cursor-not-allowed'
          }`}>
        {isValid ? '▶ Confirmar Escalação e Jogar' : `Selecione ${11 - selected.length} jogador(es) ainda`}
      </button>
    </div>
  );
};