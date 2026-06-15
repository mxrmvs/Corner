import type { Calendar } from './calendar';
import type { Club } from './clubs';
import type { Player } from './types';

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$ ${(n / 1_000_000).toFixed(0)}M` : `R$ ${(n / 1_000).toFixed(0)}K`;

const teamRating = (clubId: string, players: Player[]) => {
  const xi = players
    .filter(p => p.clubId === clubId)
    .sort((a, b) => b.currentRating - a.currentRating)
    .slice(0, 11);
  return xi.length ? Math.round(xi.reduce((s, p) => s + p.currentRating, 0) / xi.length) : 0;
};

const ratingColor = (r: number) =>
  r >= 82 ? 'text-[#FB5C6B]' : r >= 78 ? 'text-[#FBBF24]' : 'text-[#2DFFA8]';

const diffLabel = (r: number) =>
  r >= 82 ? '🔴 Favorito deles' : r >= 78 ? '🟡 Equilibrado' : '🟢 Favorito seu';

interface Props {
  calendar: Calendar;
  userClub: Club;
  clubs: Club[];
  players: Player[];
  onGoToMatch: () => void;
}

export const NextMatch = ({ calendar, userClub, clubs, players, onGoToMatch }: Props) => {
  const { rounds, currentRound } = calendar;
  if (currentRound > rounds.length) return null;

  const round = rounds[currentRound - 1];
  const match = round?.find(
    m => m.homeClubId === userClub.id || m.awayClubId === userClub.id
  );
  if (!match) return null;

  const isHome = match.homeClubId === userClub.id;
  const oppId = isHome ? match.awayClubId : match.homeClubId;
  const opp = clubs.find(c => c.id === oppId);
  if (!opp) return null;

  const oppRating = teamRating(oppId, players);
  const myRating  = teamRating(userClub.id, players);

  return (
    <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-[#8B97A3] uppercase tracking-widest font-bold">Próxima Partida</p>
          <p className="text-xs text-[#8B97A3] mt-0.5">Rodada {currentRound} de {rounds.length}</p>
        </div>
        <span className="text-xs bg-white/[0.06] text-[#8B97A3] px-3 py-1 rounded-full font-bold">
          {isHome ? '🏠 Casa' : '✈️ Fora'}
        </span>
      </div>

      {/* Times */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 text-center">
          <p className="font-black text-base text-[#2DFFA8] truncate">{userClub.name}</p>
          <p className="text-2xl font-black text-[#2DFFA8] mt-1">{myRating}</p>
          <p className="text-xs text-[#8B97A3]">OVR médio</p>
        </div>

        <div className="text-center">
          <p className="text-2xl font-black text-[#8B97A3]">VS</p>
          <p className={`text-xs font-bold mt-1 ${ratingColor(oppRating)}`}>
            {diffLabel(oppRating)}
          </p>
        </div>

        <div className="flex-1 text-center">
          <p className="font-black text-base text-[#E6EDF3] truncate">{opp.name}</p>
          <p className={`text-2xl font-black mt-1 ${ratingColor(oppRating)}`}>{oppRating}</p>
          <p className="text-xs text-[#8B97A3]">OVR médio</p>
        </div>
      </div>

      {/* Info adversário */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/[0.03] rounded-xl py-2">
          <p className="text-xs text-[#8B97A3]">Reputação</p>
          <p className="font-bold text-sm text-[#E6EDF3] mt-0.5">{opp.reputation}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl py-2">
          <p className="text-xs text-[#8B97A3]">Estádio</p>
          <p className="font-bold text-sm text-[#E6EDF3] mt-0.5">{opp.stadiumCapacity.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl py-2">
          <p className="text-xs text-[#8B97A3]">Caixa</p>
          <p className="font-bold text-sm text-[#38BDF8] mt-0.5">{fmt(opp.balance)}</p>
        </div>
      </div>

      <button onClick={onGoToMatch}
        className="bg-[#2DFFA8] text-[#0B0F14] font-black py-2.5 rounded-full text-sm hover:brightness-110 transition-all cursor-pointer">
        ▶ Jogar Partida
      </button>
    </div>
  );
};