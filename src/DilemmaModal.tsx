import type { Dilemma, DilemmaChoice } from './dilemmas';
import type { Player } from './types';

interface Props {
  dilemma: Dilemma;
  players: Player[];
  onChoose: (choice: DilemmaChoice) => void;
}

export const DilemmaModal = ({ dilemma, players, onChoose }: Props) => {
  const subject = players.find(p => p.id === dilemma.subjectId);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-6 max-w-md w-full flex flex-col gap-5">

        {/* Cabeçalho */}
        <div>
          <div className="text-xs text-[#FBBF24] font-bold uppercase tracking-widest mb-2">
            ⚡ Dilema do Vestiário
          </div>
          <h2 className="text-lg font-black text-[#E6EDF3]">{dilemma.title}</h2>
          {subject && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-white/[0.06] text-[#8B97A3] px-2 py-0.5 rounded-md font-bold">
                OVR {subject.currentRating}
              </span>
              <span className="text-sm text-[#8B97A3]">{subject.name}</span>
            </div>
          )}
        </div>

        {/* Descrição */}
        <p className="text-sm text-[#8B97A3] leading-relaxed">
          {dilemma.body}
        </p>

        {/* Escolhas */}
        <div className="flex flex-col gap-2">
          {dilemma.choices.map((c, i) => (
            <button key={i} onClick={() => onChoose(c)}
              className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2DFFA8]/40 hover:bg-[rgba(45,255,168,0.04)] transition-all cursor-pointer text-left group">
              <span className="text-sm text-[#E6EDF3] font-medium group-hover:text-[#2DFFA8] transition-colors">
                {c.label}
              </span>
              <div className="flex gap-2 ml-3 shrink-0">
                {c.moraleEffect !== 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.moraleEffect > 0 ? 'bg-[rgba(45,255,168,0.1)] text-[#2DFFA8]' : 'bg-[rgba(251,92,107,0.1)] text-[#FB5C6B]'}`}>
                    {c.moraleEffect > 0 ? '+' : ''}{c.moraleEffect} moral
                  </span>
                )}
                {c.balanceEffect !== 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.balanceEffect > 0 ? 'bg-[rgba(56,189,248,0.1)] text-[#38BDF8]' : 'bg-[rgba(251,191,36,0.1)] text-[#FBBF24]'}`}>
                    {c.balanceEffect > 0 ? '+' : ''}R$ {Math.abs(c.balanceEffect / 1000).toFixed(0)}K
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};