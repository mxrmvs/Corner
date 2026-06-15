import { useState, useEffect } from 'react';
import type { PositionFilter } from './types';
import { PLAYERS } from './players';
import { PlayerCard } from './PlayerCard';
import { SquadFilter } from './SquadFilter';
import { MatchScreen } from './MatchScreen';
import { LeagueTable } from './LeagueTable';
import { generateCalendar } from './calendar';
import { simulateMatch } from './simulate';
import { computeStandings } from './standings';
import type { Calendar } from './calendar';
import type { ClubStanding } from './leagueTypes';

const counts = {
  ALL: PLAYERS.length,
  GK:  PLAYERS.filter(p => p.position === 'GK').length,
  DEF: PLAYERS.filter(p => p.position === 'DEF').length,
  MID: PLAYERS.filter(p => p.position === 'MID').length,
  ATT: PLAYERS.filter(p => p.position === 'ATT').length,
};

type Screen = 'squad' | 'match' | 'table';

const NAV: { label: string; value: Screen }[] = [
  { label: '👥 Elenco',  value: 'squad' },
  { label: '⚽ Partida', value: 'match'  },
  { label: '📊 Tabela',  value: 'table'  },
];

function App() {
  const [filter, setFilter]       = useState<PositionFilter>('ALL');
  const [screen, setScreen]       = useState<Screen>('squad');
  const [calendar, setCalendar]   = useState<Calendar | null>(null);
  const [standings, setStandings] = useState<ClubStanding[]>([]);

  useEffect(() => {
    const cal = generateCalendar();
    setCalendar(cal);
    setStandings(computeStandings([]));
  }, []);

  const simulateRound = () => {
    if (!calendar) return;
    const { rounds, currentRound } = calendar;
    if (currentRound > rounds.length) return;

    const updatedRound = rounds[currentRound - 1].map(simulateMatch);
    const updatedRounds = [...rounds];
    updatedRounds[currentRound - 1] = updatedRound;

    const newCal: Calendar = { rounds: updatedRounds, currentRound: currentRound + 1 };
    setCalendar(newCal);
    setStandings(computeStandings(updatedRounds.flat()));
  };

  const visible = filter === 'ALL'
    ? PLAYERS
    : PLAYERS.filter(p => p.position === filter);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] font-sans">
      <header className="border-b border-white/[0.06] px-6 py-4 flex justify-between items-center sticky top-0 bg-[#0B0F14]/90 backdrop-blur-sm z-10">
        <div>
          <h1 className="text-2xl font-black tracking-[0.15em]">CORNER</h1>
          <p className="text-xs text-[#8B97A3] mt-0.5">Simulador de Carreira de Técnico</p>
        </div>
        <nav className="flex gap-2">
          {NAV.map(({ label, value }) => (
            <button key={value} onClick={() => setScreen(value)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer
                ${screen === value
                  ? 'bg-[#2DFFA8] text-[#0B0F14]'
                  : 'bg-white/[0.06] text-[#8B97A3] hover:bg-white/10 hover:text-[#E6EDF3]'
                }`}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto">
        {screen === 'squad' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Elenco</h2>
              <span className="text-xs text-[#8B97A3]">{visible.length} jogadores</span>
            </div>
            <SquadFilter active={filter} onChange={setFilter} counts={counts} />
            <div className="flex gap-4 flex-wrap">
              {visible.map(p => (
                <PlayerCard key={p.id} player={p} />
              ))}
            </div>
          </div>
        )}

        {screen === 'match' && (
          <MatchScreen
            homePlayers={PLAYERS}
            awayPlayers={[...PLAYERS].sort(() => Math.random() - 0.5).slice(0, 11)}
            homeTeamName="Corner FC"
            awayTeamName="Rival FC"
            onBack={() => setScreen('squad')}
          />
        )}

        {screen === 'table' && calendar && (
          <LeagueTable
            standings={standings}
            userClubId="c1"
            currentRound={calendar.currentRound}
            totalRounds={calendar.rounds.length}
            onSimulateRound={simulateRound}
          />
        )}
      </main>
    </div>
  );
}

export default App;