import type { ClubStanding } from './leagueTypes';

const rowBg = (i: number, isUser: boolean) => {
  if (isUser) return 'bg-[rgba(45,255,168,0.06)] border-l-2 border-[#2DFFA8]';
  if (i < 4)  return 'bg-white/[0.01]';
  if (i >= 10) return 'bg-[rgba(251,100,107,0.04)]';
  return '';
};

interface Props {
  standings: ClubStanding[];
  userClubId?: string;
  currentRound: number;
  totalRounds: number;
  onSimulateRound: () => void;
}

export const LeagueTable = ({ standings, userClubId = 'c1', currentRound, totalRounds, onSimulateRound }: Props) => {
  const userPos = standings.findIndex(s => s.clubId === userClubId);
  const finished = currentRound > totalRounds;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold">Tabela da Liga</h2>
          <p className="text-xs text-[#8B97A3] mt-0.5">
            {finished ? 'Temporada encerrada' : `Rodada ${currentRound} de ${totalRounds}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {userPos >= 0 && (
            <span className="text-xs text-[#8B97A3]">
              Você: <span className="text-[#2DFFA8] font-bold">{userPos + 1}º</span>
            </span>
          )}
          {!finished && (
            <button onClick={onSimulateRound}
              className="bg-[#2DFFA8] text-[#0B0F14] font-black px-5 py-2 rounded-full text-xs hover:brightness-110 transition-all cursor-pointer">
              ▶ Simular Rodada {currentRound}
            </button>
          )}
          {finished && (
            <span className="text-xs text-[#FBBF24] font-bold">🏆 Fim de temporada</span>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-4 text-xs text-[#8B97A3]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2DFFA8]" /> Libertadores
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FB5C6B]" /> Rebaixamento
        </span>
      </div>

      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2rem_1fr_repeat(7,3rem)] px-4 py-2.5 border-b border-white/[0.06] text-xs text-[#8B97A3] font-bold uppercase tracking-wider">
          <span>#</span>
          <span>Clube</span>
          <span className="text-center">PJ</span>
          <span className="text-center">V</span>
          <span className="text-center">E</span>
          <span className="text-center">D</span>
          <span className="text-center">SG</span>
          <span className="text-center">GP</span>
          <span className="text-center text-[#E6EDF3]">PTS</span>
        </div>

        {standings.map((s, i) => {
          const isUser = s.clubId === userClubId;
          const sg = s.goalsFor - s.goalsAgainst;
          return (
            <div key={s.clubId}
              className={`grid grid-cols-[2rem_1fr_repeat(7,3rem)] px-4 py-3 border-b border-white/[0.04] last:border-0 text-sm hover:bg-white/[0.03] transition-colors ${rowBg(i, isUser)}`}>
              <span className={`font-bold tabular-nums ${i < 4 ? 'text-[#2DFFA8]' : i >= 10 ? 'text-[#FB5C6B]' : 'text-[#8B97A3]'}`}>
                {i + 1}
              </span>
              <span className={`font-semibold truncate ${isUser ? 'text-[#2DFFA8]' : 'text-[#E6EDF3]'}`}>
                {s.clubName} {isUser && '⭐'}
              </span>
              <span className="text-center text-[#8B97A3] tabular-nums">{s.played}</span>
              <span className="text-center text-[#E6EDF3] tabular-nums font-medium">{s.wins}</span>
              <span className="text-center text-[#8B97A3] tabular-nums">{s.draws}</span>
              <span className="text-center text-[#8B97A3] tabular-nums">{s.losses}</span>
              <span className={`text-center tabular-nums font-medium ${sg > 0 ? 'text-[#2DFFA8]' : sg < 0 ? 'text-[#FB5C6B]' : 'text-[#8B97A3]'}`}>
                {sg > 0 ? `+${sg}` : sg}
              </span>
              <span className="text-center text-[#8B97A3] tabular-nums">{s.goalsFor}</span>
              <span className="text-center font-black tabular-nums text-[#E6EDF3]">{s.points}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};