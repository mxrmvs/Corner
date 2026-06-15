import type { Match } from './calendar';
import type { Club } from './clubs';

interface Props {
  matches: Match[];
  clubs: Club[];
  userClubId: string;
}

const clubName = (clubs: Club[], id: string) =>
  clubs.find(c => c.id === id)?.name ?? id;

const getResult = (m: Match, userClubId: string): 'V' | 'E' | 'D' => {
  const isHome = m.homeClubId === userClubId;
  const userGoals = isHome ? m.homeGoals! : m.awayGoals!;
  const oppGoals  = isHome ? m.awayGoals! : m.homeGoals!;
  if (userGoals > oppGoals) return 'V';
  if (userGoals < oppGoals) return 'D';
  return 'E';
};

const resultStyle: Record<string, string> = {
  V: 'bg-[rgba(45,255,168,0.15)] text-[#2DFFA8] ring-1 ring-[#2DFFA8]/30',
  E: 'bg-[rgba(251,191,36,0.15)] text-[#FBBF24] ring-1 ring-[#FBBF24]/30',
  D: 'bg-[rgba(251,92,107,0.15)] text-[#FB5C6B] ring-1 ring-[#FB5C6B]/30',
};

export const MatchHistory = ({ matches, clubs, userClubId }: Props) => {
  const played = matches
    .filter(m =>
      m.played &&
      (m.homeClubId === userClubId || m.awayClubId === userClubId)
    )
    .reverse();

  if (!played.length) {
    return (
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-8 text-center">
        <div className="text-3xl mb-3">📋</div>
        <p className="text-[#8B97A3] text-sm">Nenhuma partida disputada ainda.</p>
        <p className="text-[#8B97A3] text-xs mt-1">Simule rodadas na aba Tabela para ver o histórico.</p>
      </div>
    );
  }

  const wins   = played.filter(m => getResult(m, userClubId) === 'V').length;
  const draws  = played.filter(m => getResult(m, userClubId) === 'E').length;
  const losses = played.filter(m => getResult(m, userClubId) === 'D').length;
  const gf = played.reduce((s, m) => {
    const isHome = m.homeClubId === userClubId;
    return s + (isHome ? m.homeGoals! : m.awayGoals!);
  }, 0);
  const ga = played.reduce((s, m) => {
    const isHome = m.homeClubId === userClubId;
    return s + (isHome ? m.awayGoals! : m.homeGoals!);
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Histórico de Partidas</h2>

      {/* Resumo */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'Jogos', value: played.length, color: 'text-[#E6EDF3]' },
          { label: 'Vitórias', value: wins,   color: 'text-[#2DFFA8]' },
          { label: 'Empates', value: draws,   color: 'text-[#FBBF24]' },
          { label: 'Derrotas', value: losses, color: 'text-[#FB5C6B]' },
          { label: 'Saldo', value: gf - ga > 0 ? `+${gf - ga}` : gf - ga, color: gf >= ga ? 'text-[#2DFFA8]' : 'text-[#FB5C6B]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#131A22] border border-white/[0.08] rounded-xl p-3 text-center">
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-[#8B97A3] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_5rem_1fr_3rem] px-4 py-2.5 border-b border-white/[0.06] text-xs text-[#8B97A3] font-bold uppercase tracking-wider">
          <span className="text-center">Rod.</span>
          <span className="text-right pr-2">Casa</span>
          <span className="text-center">Placar</span>
          <span className="text-left pl-2">Fora</span>
          <span className="text-center">Res.</span>
        </div>

        {played.map(m => {
          const result = getResult(m, userClubId);
          const isHome = m.homeClubId === userClubId;
          return (
            <div key={m.id}
              className="grid grid-cols-[3rem_1fr_5rem_1fr_3rem] px-4 py-3 border-b border-white/[0.04] last:border-0 text-sm hover:bg-white/[0.02] transition-colors items-center">
              <span className="text-center text-xs text-[#8B97A3] tabular-nums">{m.round}</span>
              <span className={`text-right pr-2 truncate font-semibold text-sm
                ${isHome ? 'text-[#2DFFA8]' : 'text-[#E6EDF3]'}`}>
                {clubName(clubs, m.homeClubId)}
              </span>
              <span className="text-center font-black tabular-nums text-[#E6EDF3]">
                {m.homeGoals} — {m.awayGoals}
              </span>
              <span className={`text-left pl-2 truncate font-semibold text-sm
                ${!isHome ? 'text-[#2DFFA8]' : 'text-[#E6EDF3]'}`}>
                {clubName(clubs, m.awayClubId)}
              </span>
              <span className={`text-center text-xs font-black px-1.5 py-0.5 rounded-md ${resultStyle[result]}`}>
                {result}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};