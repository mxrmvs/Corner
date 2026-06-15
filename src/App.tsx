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
import { ClubSelect } from './ClubSelect';
import { TransferMarket } from './TransferMarket';
import { SeasonReport } from './SeasonReport';
import { DilemmaModal } from './DilemmaModal';
import { TrainingScreen } from './TrainingScreen';
import { RoundResults } from './RoundResults';
import { NextMatch } from './NextMatch';
import { MatchHistory } from './MatchHistory';
import { LineupScreen } from './LineupScreen';
import { AchievementToast } from './AchievementToast';
import { checkAchievements } from './achievements';
import type { Achievement } from './achievements';
import { generateCalendar } from './calendar';
import { simulateMatch } from './simulate';
import { computeStandings } from './standings';
import { evolveSquad } from './evolution';
import { rollDilemma } from './dilemmas';
import { applySquadTraining } from './training';
import type { TrainingFocus } from './training';
import type { DilemmaChoice, Dilemma } from './dilemmas';
import { saveGame, loadGame, deleteGame } from './db';
import type { Calendar } from './calendar';
import type { ClubStanding } from './leagueTypes';

type Screen = 'squad' | 'match' | 'lineup' | 'table' | 'club' | 'market' | 'training' | 'history';
type AppState = 'loading' | 'select' | 'playing';

const NAV: { label: string; value: Screen }[] = [
  { label: '👥 Elenco',    value: 'squad'    },
  { label: '📋 Escalação', value: 'lineup'   },
  { label: '⚽ Partida',   value: 'match'    },
  { label: '📊 Tabela',    value: 'table'    },
  { label: '📜 Histórico', value: 'history'  },
  { label: '🏟️ Clube',     value: 'club'     },
  { label: '🛒 Mercado',   value: 'market'   },
  { label: '🏋️ Treino',    value: 'training' },
];

function getOpponentId(calendar: Calendar | null, userClubId: string): string {
  if (!calendar) return '';
  const round = calendar.rounds[calendar.currentRound - 1]
    ?? calendar.rounds[calendar.currentRound - 2];
  if (!round) return '';
  const match = round.find(
    m => m.homeClubId === userClubId || m.awayClubId === userClubId
  );
  if (!match) return '';
  return match.homeClubId === userClubId ? match.awayClubId : match.homeClubId;
}

function App() {
  const [appState, setAppState]           = useState<AppState>('loading');
  const [hasSave, setHasSave]             = useState(false);
  const [screen, setScreen]               = useState<Screen>('squad');
  const [filter, setFilter]               = useState<PositionFilter>('ALL');
  const [calendar, setCalendar]           = useState<Calendar | null>(null);
  const [standings, setStandings]         = useState<ClubStanding[]>([]);
  const [season, setSeason]               = useState(1);
  const [saved, setSaved]                 = useState(false);
  const [players, setPlayers]             = useState<Player[]>(INITIAL_PLAYERS);
  const [userClub, setUserClub]           = useState<Club>(CLUBS[0]);
  const [report, setReport]               = useState<{ news: string[] } | null>(null);
  const [dilemma, setDilemma]             = useState<Dilemma | null>(null);
  const [showResults, setShowResults]     = useState(false);
  const [lineup, setLineup]               = useState<Player[]>([]);
  const [achievements, setAchievements]   = useState<Achievement[]>([]);

  useEffect(() => {
    loadGame().then(data => {
      if (data) {
        setHasSave(true);
        setAppState('select');
      } else {
        setAppState('select');
      }
    });
  }, []);

  useEffect(() => {
    if (!calendar || appState !== 'playing') return;
    saveGame({ calendar, standings, season, players, userClub }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }, [calendar, standings, season, players, userClub]);

  const handleContinue = () => {
    loadGame().then(data => {
      if (!data) return;
      setCalendar(data.calendar);
      setStandings(data.standings);
      setSeason(data.season);
      if (data.players)  setPlayers(data.players);
      if (data.userClub) setUserClub(data.userClub);
      setAppState('playing');
    });
  };

  const handleNewGame = () => {
    deleteGame().then(() => {
      setHasSave(false);
      setPlayers(INITIAL_PLAYERS);
      setCalendar(null);
      setStandings([]);
      setSeason(1);
    });
  };

  const handleSelectClub = (club: Club) => {
    setUserClub(club);
    setCalendar(generateCalendar());
    setStandings(computeStandings([]));
    setAppState('playing');
  };

  const simulateRound = () => {
    if (!calendar) return;
    const { rounds, currentRound } = calendar;
    if (currentRound > rounds.length) return;

    const prevStanding = standings.find(s => s.clubId === userClub.id);

    const updatedRound = rounds[currentRound - 1].map(simulateMatch);
    const updatedRounds = [...rounds];
    updatedRounds[currentRound - 1] = updatedRound;
    const newCal: Calendar = { rounds: updatedRounds, currentRound: currentRound + 1 };
    const newStandings = computeStandings(updatedRounds.flat());

    setCalendar(newCal);
    setStandings(newStandings);

    const currStanding = newStandings.find(s => s.clubId === userClub.id);
    const allMatches = updatedRounds.flat();
    const newAchievements = checkAchievements(prevStanding, currStanding, allMatches, userClub.id);
    if (newAchievements.length) setAchievements(newAchievements);

    const d = rollDilemma(players);
    if (d) setDilemma(d);
    setShowResults(true);
  };

  const handleDilemmaChoice = (choice: DilemmaChoice) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === dilemma?.subjectId)
        return { ...p, morale: Math.max(0, Math.min(100, p.morale + choice.moraleEffect)) };
      if (choice.squadEffect !== 0)
        return { ...p, morale: Math.max(0, Math.min(100, p.morale + choice.squadEffect)) };
      return p;
    }));
    if (choice.balanceEffect !== 0)
      setUserClub(prev => ({ ...prev, balance: prev.balance + choice.balanceEffect }));
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

  const handleTraining = (focusMap: Record<string, TrainingFocus>) => {
    const { players: trained, injuries } = applySquadTraining(players, focusMap);
    setPlayers(trained);
    if (injuries.length > 0) setReport({ news: injuries });
  };

  const handleConfirmLineup = (confirmed: Player[]) => {
    setLineup(confirmed);
    setScreen('match');
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-[0.15em] text-[#E6EDF3]">CORNER</h1>
          <p className="text-[#2DFFA8] text-xs mt-2 animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  if (appState === 'select') {
    return (
      <ClubSelect
        clubs={CLUBS}
        hasSave={hasSave}
        onSelect={handleSelectClub}
        onContinue={handleContinue}
        onNewGame={handleNewGame}
      />
    );
  }

  const mySquadPlayers   = players.filter(p => p.clubId === userClub.id);
  const activePlayers    = lineup.length === 11 ? lineup : mySquadPlayers;
  const oppId            = getOpponentId(calendar, userClub.id);
  const oppPlayers       = players.filter(p => p.clubId === oppId);
  const oppClub          = CLUBS.find(c => c.id === oppId);
  const lastRound        = calendar && calendar.currentRound > 1
    ? calendar.rounds[calendar.currentRound - 2] : null;
  const allPlayedMatches = calendar
    ? calendar.rounds.flat().filter(m => m.played) : [];

  const counts = {
    ALL: mySquadPlayers.length,
    GK:  mySquadPlayers.filter(p => p.position === 'GK').length,
    DEF: mySquadPlayers.filter(p => p.position === 'DEF').length,
    MID: mySquadPlayers.filter(p => p.position === 'MID').length,
    ATT: mySquadPlayers.filter(p => p.position === 'ATT').length,
  };
  const visible = filter === 'ALL'
    ? mySquadPlayers : mySquadPlayers.filter(p => p.position === filter);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] font-sans">
      {report && <SeasonReport news={report.news} season={season} onClose={confirmNewSeason} />}
      {dilemma && !report && (
        <DilemmaModal dilemma={dilemma} players={players} onChoose={handleDilemmaChoice} />
      )}
      {showResults && lastRound && (
        <RoundResults
          matches={lastRound}
          clubs={CLUBS}
          userClubId={userClub.id}
          round={calendar!.currentRound - 1}
          onClose={() => setShowResults(false)}
        />
      )}
      {achievements.length > 0 && (
        <AchievementToast
          achievements={achievements}
          onDone={() => setAchievements([])}
        />
      )}

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
                ${screen === value
                  ? 'bg-[#2DFFA8] text-[#0B0F14]'
                  : 'bg-white/[0.06] text-[#8B97A3] hover:bg-white/10 hover:text-[#E6EDF3]'
                }`}>
              {label}
            </button>
          ))}
          <button onClick={() => { deleteGame(); window.location.reload(); }}
            className="px-4 py-2 rounded-full text-xs font-bold bg-white/[0.06] text-[#FB5C6B] hover:bg-[rgba(251,92,107,0.1)] transition-all cursor-pointer">
            ⏹ Sair
          </button>
        </nav>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto">

        {screen === 'squad' && (
          <div className="flex flex-col gap-6">
            {calendar && (
              <NextMatch
                calendar={calendar}
                userClub={userClub}
                clubs={CLUBS}
                players={players}
                onGoToMatch={() => setScreen('lineup')}
              />
            )}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Elenco — {userClub.name}</h2>
                <span className="text-xs text-[#8B97A3]">{visible.length} jogadores</span>
              </div>
              <SquadFilter active={filter} onChange={setFilter} counts={counts} />
              <div className="flex gap-4 flex-wrap">
                {visible.map(p => <PlayerCard key={p.id} player={p} />)}
              </div>
            </div>
          </div>
        )}

        {screen === 'lineup' && (
          <LineupScreen
            players={mySquadPlayers}
            onConfirm={handleConfirmLineup}
            onBack={() => setScreen('squad')}
          />
        )}

        {screen === 'match' && (
          <div>
            {oppId && oppPlayers.length > 0 ? (
              <MatchScreen
                homePlayers={activePlayers}
                awayPlayers={oppPlayers}
                homeTeamName={userClub.name}
                awayTeamName={oppClub?.name ?? 'Adversário'}
                onBack={() => setScreen('squad')}
              />
            ) : (
              <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-8 text-center max-w-md mx-auto">
                <div className="text-4xl mb-4">📅</div>
                <h2 className="text-lg font-bold mb-2">Nenhuma partida agendada</h2>
                <p className="text-[#8B97A3] text-sm">
                  Simule a rodada na aba{' '}
                  <strong className="text-[#E6EDF3]">Tabela</strong>{' '}
                  para agendar sua próxima partida.
                </p>
              </div>
            )}
          </div>
        )}

        {screen === 'table' && calendar && (
          <LeagueTable
            standings={standings}
            userClubId={userClub.id}
            currentRound={calendar.currentRound}
            totalRounds={calendar.rounds.length}
            onSimulateRound={simulateRound}
            onNewSeason={handleNewSeason}
            onShowResults={() => setShowResults(true)}
          />
        )}

        {screen === 'history' && (
          <MatchHistory
            matches={allPlayedMatches}
            clubs={CLUBS}
            userClubId={userClub.id}
          />
        )}

        {screen === 'club' && (
          <ClubScreen club={userClub} onUpdate={setUserClub} />
        )}

        {screen === 'market' && (
          <TransferMarket
            allPlayers={players}
            userClub={userClub}
            onBuy={handleBuy}
            onSell={handleSell}
          />
        )}

        {screen === 'training' && (
          <TrainingScreen players={players} onApply={handleTraining} />
        )}

      </main>
    </div>
  );
}

export default App;