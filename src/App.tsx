import { useState, useEffect } from 'react';
import type { PositionFilter, Player } from './types';
import { PLAYERS as INITIAL_PLAYERS } from './players';
import { CLUBS } from './clubs';
import type { Club } from './clubs';
import { PlayerCard } from './PlayerCard';
import { SquadFilter } from './SquadFilter';
import { MatchScreen } from './MatchScreen';
import { LeagueTable } from './LeagueTable';
import { ClubScreen } from './ClubScreen';
import { TransferMarket } from './TransferMarket';
import { SeasonReport } from './SeasonReport';
import { DilemmaModal } from './DilemmaModal';
import { generateCalendar } from './calendar';
import { simulateMatch } from './simulate';
import { computeStandings } from './standings';
import { evolveSquad } from './evolution';
import { rollDilemma } from './dilemmas';
import type { DilemmaChoice, Dilemma } from './dilemmas';
import { saveGame, loadGame } from './db';
import type { Calendar } from './calendar';
import type { ClubStanding } from './leagueTypes';

type Screen = 'squad' | 'match' | 'table' | 'club' | 'market';

const NAV: { label: string; value: Screen }[] = [
  { label: '👥 Elenco',  value: 'squad'  },
  { label: '⚽ Partida', value: 'match'  },
  { label: '📊 Tabela',  value: 'table'  },
  { label: '🏟️ Clube',   value: 'club'   },
  { label: '🛒 Mercado', value: 'market' },
];

function App() {
  const [screen, setScreen]       = useState<Screen>('squad');
  const [filter, setFilter]       = useState<PositionFilter>('ALL');
  const [calendar, setCalendar]   = useState<Calendar | null>(null);
  const [standings, setStandings] = useState<ClubStanding[]>([]);
  const [season, setSeason]       = useState(1);
  const [saved, setSaved]         = useState(false);
  const [players, setPlayers]     = useState<Player[]>(INITIAL_PLAYERS);
  const [userClub, setUserClub]   = useState<Club>(CLUBS[0]);
  const [report, setReport]       = useState<{ news: string[] } | null>(null);
  const [dilemma, setDilemma]     = useState<Dilemma | null>(null);

  useEffect(() => {
    loadGame().then(data => {
      if (data) {
        setCalendar(data.calendar);
        setStandings(data.standings);
        setSeason(data.season);
        if (data.players)  setPlayers(data.players);
        if (data.userClub) setUserClub(data.userClub);
      } else {
        setCalendar(generateCalendar());
        setStandings(computeStandings([]));
      }
    });
  }, []);

  useEffect(() => {
    if (!calendar) return;
    saveGame({ calendar, standings, season, players, userClub }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }, [calendar, standings, season, players, userClub]);

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
    const d = rollDilemma(players);
    if (d) setDilemma(d);
  };

  const handleDilemmaChoice = (choice: DilemmaChoice) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === dilemma?.subjectId) {
        return { ...p, morale: Math.max(0, Math.min(100, p.morale + choice.moraleEffect)) };
      }
      if (choice.squadEffect !== 0) {
        return { ...p, morale: Math.max(0, Math.min(100, p.morale + choice.squadEffect)) };
      }
      return p;
    }));
    if (choice.balanceEffect !== 0) {
      setUserClub(prev => ({ ...prev, balance: prev.balance + choice.balanceEffect }));
    }
    setDilemma(null);
  };

  const handleNewSeason = () => {
    const { players: evolved, news } = evolveSquad(players);
    setPlayers(evolved);
    setReport({ news });
  };

  const confirmNewSeason = () => {
    setCalendar(generateCalendar());
    setStandings(computeStandings([]));
    setSeason(s => s + 1);
    setReport(null);
  };

  const handleBuy = (p: Player) => {
    setPlayers(prev => prev.map(pl => pl.id === p.id ? { ...pl, clubId: userClub.id } : pl));
    setUserClub(prev => ({ ...prev, balance: prev.balance - p.marketValue }));
  };

  const handleSell = (p: Player) => {
    setPlayers(prev => prev.map(pl => pl.id === p.id ? { ...pl, clubId: '' } : pl));
    setUserClub(prev => ({ ...prev, balance: prev.balance + p.marketValue }));
  };

  const mySquadPlayers = players.filter(p => p.clubId === userClub.id);

  const counts = {
    ALL: mySquadPlayers.length,
    GK:  mySquadPlayers.filter(p => p.position === 'GK').length,
    DEF: mySquadPlayers.filter(p => p.position === 'DEF').length,
    MID: mySquadPlayers.filter(p => p.position === 'MID').length,
    ATT: mySquadPlayers.filter(p => p.position === 'ATT').length,
  };

  const visible = filter === 'ALL' ? mySquadPlayers : mySquadPlayers.filter(p => p.position === filter);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] font-sans">
      {report && <SeasonReport news={report.news} season={season} onClose={confirmNewSeason} />}
      {dilemma && !report && <DilemmaModal dilemma={dilemma} players={players} onChoose={handleDilemmaChoice} />}

      <header className="border-b border-white/[0.06] px-6 py-4 flex justify-between items-center sticky top-0 bg-[#0B0F14]/90 backdrop-blur-sm z-10">
        <div>
          <h1 className="text-2xl font-black tracking-[0.15em]">CORNER</h1>
          <p className="text-xs text-[#8B97A3] mt-0.5">
            Temporada {season} · {userClub.name}
            {saved && <span className="ml-2 text-[#2DFFA8]">✓ salvo</span>}
          </p>
        </div>
        <nav className="flex gap-2 flex-wrap justify-end">
          {NAV.map(({ label, value }) => (
            <button key={value} onClick={() => setScreen(value)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer
                ${screen === value ? 'bg-[#2DFFA8] text-[#0B0F14]' : 'bg-white/[0.06] text-[#8B97A3] hover:bg-white/10 hover:text-[#E6EDF3]'}`}>
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
              {visible.map(p => <PlayerCard key={p.id} player={p} />)}
            </div>
          </div>
        )}
        {screen === 'match' && (
          <MatchScreen
            homePlayers={mySquadPlayers}
            awayPlayers={players.filter(p => p.clubId === 'c2')}
            homeTeamName={userClub.name}
            awayTeamName="Rival FC"
            onBack={() => setScreen('squad')}
          />
        )}
        {screen === 'table' && calendar && (
          <LeagueTable
            standings={standings}
            userClubId={userClub.id}
            currentRound={calendar.currentRound}
            totalRounds={calendar.rounds.length}
            onSimulateRound={simulateRound}
            onNewSeason={handleNewSeason}
          />
        )}
        {screen === 'club' && <ClubScreen club={userClub} onUpdate={setUserClub} />}
        {screen === 'market' && (
          <TransferMarket
            allPlayers={players}
            userClub={userClub}
            onBuy={handleBuy}
            onSell={handleSell}
          />
        )}
      </main>
    </div>
  );
}

export default App;
