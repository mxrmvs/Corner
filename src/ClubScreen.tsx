import { useState } from 'react';
import type { Club } from './clubs';
import type { TacticalStyle, Formation } from './types';

const STYLES: { value: TacticalStyle; label: string; desc: string }[] = [
  { value: 'TIKI_TAKA', label: 'Tiki-Taka',     desc: 'Posse e troca de passes. Anula jogo direto.' },
  { value: 'COUNTER',   label: 'Contra-Ataque',  desc: 'Velocidade na transição. Pune o Tiki-Taka.' },
  { value: 'DIRECT',    label: 'Jogo Direto',    desc: 'Objetividade e força. Quebra o contra-ataque.' },
];

const FORMATIONS: Formation[] = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2'];

const fmt = (n: number) =>
  n >= 1_000_000
    ? `R$ ${(n / 1_000_000).toFixed(1)}M`
    : `R$ ${(n / 1_000).toFixed(0)}K`;

interface Props {
  club: Club;
  onUpdate: (club: Club) => void;
}

export const ClubScreen = ({ club, onUpdate }: Props) => {
  const [saved, setSaved] = useState(false);
  const [style, setStyle]         = useState<TacticalStyle>(club.tactical.style);
  const [formation, setFormation] = useState<Formation>(club.tactical.formation);

  const handleSave = () => {
    onUpdate({ ...club, tactical: { style, formation } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reputationLabel = (r: number) =>
    r >= 80 ? 'Elite' : r >= 70 ? 'Alto Nível' : r >= 60 ? 'Médio' : 'Modesto';

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Info do clube */}
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">{club.name}</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/[0.03] rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-[#2DFFA8]">{club.reputation}</div>
            <div className="text-xs text-[#8B97A3] mt-1">Reputação</div>
            <div className="text-xs text-[#E6EDF3] font-medium mt-0.5">{reputationLabel(club.reputation)}</div>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-[#38BDF8]">{fmt(club.balance)}</div>
            <div className="text-xs text-[#8B97A3] mt-1">Caixa</div>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-[#FBBF24]">{club.stadiumCapacity.toLocaleString()}</div>
            <div className="text-xs text-[#8B97A3] mt-1">Estádio</div>
          </div>
        </div>
      </div>

      {/* Estilo de jogo */}
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-[#8B97A3] uppercase tracking-wider mb-4">Estilo de Jogo</h3>
        <div className="flex flex-col gap-2">
          {STYLES.map(s => (
            <button key={s.value} onClick={() => setStyle(s.value)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer text-left
                ${style === s.value
                  ? 'border-[#2DFFA8] bg-[rgba(45,255,168,0.06)]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20'
                }`}>
              <div>
                <div className={`font-bold text-sm ${style === s.value ? 'text-[#2DFFA8]' : 'text-[#E6EDF3]'}`}>
                  {s.label}
                </div>
                <div className="text-xs text-[#8B97A3] mt-0.5">{s.desc}</div>
              </div>
              {style === s.value && <span className="text-[#2DFFA8] text-lg">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Formação */}
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-[#8B97A3] uppercase tracking-wider mb-4">Formação</h3>
        <div className="flex gap-2 flex-wrap">
          {FORMATIONS.map(f => (
            <button key={f} onClick={() => setFormation(f)}
              className={`px-5 py-2.5 rounded-xl border font-bold text-sm transition-all cursor-pointer
                ${formation === f
                  ? 'border-[#2DFFA8] bg-[rgba(45,255,168,0.06)] text-[#2DFFA8]'
                  : 'border-white/[0.06] bg-white/[0.02] text-[#8B97A3] hover:border-white/20 hover:text-[#E6EDF3]'
                }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Botão salvar */}
      <button onClick={handleSave}
        className="bg-[#2DFFA8] text-[#0B0F14] font-black py-3 rounded-full text-sm hover:brightness-110 transition-all cursor-pointer">
        {saved ? '✓ Salvo!' : 'Salvar Táticas'}
      </button>
    </div>
  );
};