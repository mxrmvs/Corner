import { useState, useEffect } from 'react';
import type { ClubStanding } from './leagueTypes';
import { CLUBS } from './clubs';

const generateStandings = (): ClubStanding[] => {
  return CLUBS.map((club) => {
    const w = Math.floor(Math.random() * 10);
    const d = Math.floor(Math.random() * 5);
    const l = Math.floor(Math.random() * 8);
    const gf = w * 2 + Math.floor(Math.random() * 10);
    const ga = l * 2 + Math.floor(Math.random() * 8);
    return {
      clubId: club.id,
      clubName: club.name,
      played: w + d + l,
      wins: w,
      draws: d,
      losses: l,
      goalsFor: gf,
      goalsAgainst: ga,
      points: w * 3 + d,
    };
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const sgA = a.goalsFor - a.goalsAgainst;
    const sgB = b.goalsFor - b.goalsAgainst;
    return sgB - sgA;
  });
};

const rowBg = (i: number, isUser: boolean) => {
  if (isUser) return 'bg-[rgba(45,255,168,0.06)] border-l-2 border-[#2DFFA8]';
  if (i < 4)  return 'bg-white/[0.01]';
  if (i >= 10) return 'bg-[rgba(251,100,107,0.04)]';
  return '';
};

export const LeagueTable = ({ userClubId = 'c1' }: { userClubId?: string }) => {
  const [standings, setStandings] = useState<ClubStanding[]>([]);

  useEffect(() => {
    setStandings(generateStandings());
  }, []);

  const userPos = standings.findIndex(s => s.clubId === userClubId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Tabela da Liga</h2>
        {userPos >= 0 && (
          <span className="text-xs text-[#8B97A3]">
            Você está em <span className="text-[#2DFFA8] font-bold">{userPos + 1}º lugar</span>
          </span>
        )}
      </div>

      {/* Legenda */}
      <div className="flex gap-4 mb-4 text-xs text-[#8B97A3]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2DFFA8]" /> Libertadores
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FB5C6B]" /> Rebaixamento
        </span>
      </div>

      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="grid grid-cols-[2rem_1fr_repeat(7,3rem)] gap-0 px-4 py-2.5 border-b border-white/[0.06] text-xs text-[#8B97A3] font-bold uppercase tracking-wider">
          <span>#</span>
          <span>Clube</span>
          <span className="text-center">PJ</span>
          <span className="text-center">V</span>
          <span className="text-center">E</span>
          <span className="text-center">D</span>
          <span className="text-center">SG</span>
          <span className="text-center">GP</span>
          <span className="text-center font-black text-[#E6EDF3]">PTS</span>
        </div>

        {/* Linhas */}
        {standings.map((s, i) => {
          const isUser = s.clubId === userClubId;
          const sg = s.goalsFor - s.goalsAgainst;
          return (
            <div key={s.clubId}
              className={`grid grid-cols-[2rem_1fr_repeat(7,3rem)] gap-0 px-4 py-3 border-b border-white/[0.04] last:border-0 text-sm transition-colors hover:bg-white/[0.03] ${rowBg(i, isUser)}`}>
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