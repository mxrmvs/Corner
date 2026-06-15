import type { Match } from './calendar';
import type { Club } from './clubs';

interface Props {
  matches: Match[];
  clubs: Club[];
  userClubId: string;
  round: number;
  onClose: () => void;
}

export const RoundResults = ({ matches, clubs, userClubId, round, onClose }: Props) => {
  const clubName = (id: string) => clubs.find(c => c.id === id)?.name ?? id;

  const isUserMatch = (m: Match) =>
    m.homeClubId === userClubId || m.awayClubId === userClubId;

  const resultColor = (m: Match) => {
    if (!m.played) return '';
    const isHome = m.homeClubId === userClubId;
    const userGoals = isHome ? m.homeGoals! : m.awayGoals!;
    const oppGoals  = isHome ? m.awayGoals! : m.homeGoals!;
    if (userGoals > oppGoals) return 'border-[#2DFFA8] bg-[rgba(45,255,168,0.05)]';
    if (userGoals < oppGoals) return 'border-[#FB5C6B] bg-[rgba(251,92,107,0.05)]';
    return 'border-[#FBBF24] bg-[rgba(251,191,36,0.05)]';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black">Rodada {round}</h2>
            <p className="text-xs text-[#8B97A3] mt-0.5">Resultados de todos os jogos</p>
          </div>
          <button onClick={onClose}
            className="text-[#8B97A3] hover:text-[#E6EDF3] text-xl cursor-pointer transition-colors">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {matches.map(m => (
            <div key={m.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                ${isUserMatch(m) ? resultColor(m) : 'border-white/[0.06] bg-white/[0.02]'}`}>
              {/* Time da casa */}
              <span className={`flex-1 text-right text-sm font-semibold truncate
                ${m.homeClubId === userClubId ? 'text-[#2DFFA8]' : 'text-[#E6EDF3]'}`}>
                {clubName(m.homeClubId)}
              </span>

              {/* Placar */}
              <span className="tabular-nums font-black text-base text-[#E6EDF3] w-16 text-center shrink-0">
                {m.played ? `${m.homeGoals} — ${m.awayGoals}` : 'vs'}
              </span>

              {/* Time visitante */}
              <span className={`flex-1 text-left text-sm font-semibold truncate
                ${m.awayClubId === userClubId ? 'text-[#2DFFA8]' : 'text-[#E6EDF3]'}`}>
                {clubName(m.awayClubId)}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="bg-[#2DFFA8] text-[#0B0F14] font-black py-3 rounded-full text-sm hover:brightness-110 transition-all cursor-pointer">
          Fechar
        </button>
      </div>
    </div>
  );
};