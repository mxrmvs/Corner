import { useState, useEffect } from 'react';
import type { PositionFilter, Player, Division } from './types';
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

const NAV: { label: string; icon: string; value: Screen }[] = [
  { label: 'Elenco',    icon: '👥', value: 'squad'    },
  { label: 'Escalação', icon: '📋', value: 'lineup'   },
  { label: 'Partida',   icon: '⚽', value: 'match'    },
  { label: 'Tabela',    icon: '📊', value: 'table'    },
  { label: 'Histórico', icon: '📜', value: 'history'  },
  { label: 'Clube',     icon: '🏟️', value: 'club'     },
  { label: 'Mercado',   icon: '🛒', value: 'market'   },
  { label: 'Treino',    icon: '🏋️', value: 'training' },
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
  const [selectedDivision, setSelectedDivision] = useState<Division>('A');

  useEffect(() => {
    loadGame().then(data => {
      if (data) { setHasSave(true); setAppState('select'); }
      else setAppState('select');
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
    const newAch = checkAchievements(prevStanding, currStanding, updatedRounds.flat(), userClub.id);
    if (newAch.length) setAchievements(newAch);
    const d = rollDilemma(players);
    if (d) setDilemma(d);
    setShowResults(true);
  };

  const handleDilemmaChoice = (choice: DilemmaChoice) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === dilemma?.subjectId)
        return { ...p, condition: { ...p.condition, morale: Math.max(0, Math.min(100, p.condition.morale + choice.moraleEffect)) } };
      if (choice.squadEffect !== 0)
        return { ...p, condition: { ...p.condition, morale: Math.max(0, Math.min(100, p.condition.morale + choice.squadEffect)) } };
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
      <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-5xl font-black text-[#1A1A1A]">CORNER</h1>
          <p className="text-xs text-[#E8432D] tracking-widest uppercase mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  if (appState === 'select') {
    return (
      <ClubSelect
        clubs={CLUBS}
        hasSave={hasSave}
        selectedDivision={selectedDivision}
        onDivisionChange={setSelectedDivision}
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
    <div className="min-h-screen bg-[#F2EDE4] text-[#1A1A1A] font-body">
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
        <AchievementToast achievements={achievements} onDone={() => setAchievements([])} />
      )}

      {/* HEADER desktop */}
      <header className="hidden md:flex border-b border-[#1A1A1A] px-6 py-3 justify-between items-end bg-[#F2EDE4] sticky top-0 z-10">
        <div>
          <h1 className="font-display text-2xl font-black text-[#1A1A1A] leading-none">CORNER</h1>
          <p className="text-2xs text-[#6B6560] tracking-widest uppercase mt-0.5">
            Temporada {season} · {userClub.name} · Série {userClub.division}
            {saved && <span className="ml-2 text-[#E8432D]">✓ salvo</span>}
          </p>
        </div>
        <nav className="flex gap-1">
          {NAV.map(({ label, value }) => (
            <button key={value} onClick={() => setScreen(value)}
              className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase border cursor-pointer transition-colors
                ${screen === value
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-transparent text-[#6B6560] border-transparent hover:border-[#D6CFC4] hover:text-[#1A1A1A]'
                }`}>
              {label}
            </button>
          ))}
          <button onClick={() => { deleteGame(); window.location.reload(); }}
            className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase border border-transparent text-[#E8432D] hover:border-[#E8432D] cursor-pointer transition-colors">
            SAIR
          </button>
        </nav>
      </header>

      {/* HEADER mobile */}
      <header className="md:hidden flex border-b border-[#1A1A1A] px-4 py-3 justify-between items-center bg-[#F2EDE4] sticky top-0 z-10">
        <h1 className="font-display text-xl font-black">CORNER</h1>
        <p className="text-2xs text-[#6B6560] tracking-widest uppercase">
          T{season} · {userClub.name}
          {saved && <span className="ml-1 text-[#E8432D]">✓</span>}
        </p>
        <button onClick={() => { deleteGame(); window.location.reload(); }}
          className="text-xs font-bold text-[#E8432D] cursor-pointer">SAIR</button>
      </header>

      <main className="px-4 md:px-6 py-6 max-w-5xl mx-auto pb-24 md:pb-8">

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
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold tracking-widest uppercase text-[#1A1A1A]">
                  Elenco — {userClub.name}
                </h2>
                <span className="text-xs text-[#9E9890]">{visible.length} jogadores</span>
              </div>
              <SquadFilter active={filter} onChange={setFilter} counts={counts} />
              <div className="border border-[#D6CFC4] bg-white overflow-hidden">
                {visible.map((p, i) => (
                  <PlayerCard key={p.id} player={p} index={i + 1} />
                ))}
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
              <div className="border border-[#D6CFC4] bg-white p-8 text-center max-w-md mx-auto">
                <p className="text-4xl mb-4">📅</p>
                <h2 className="font-bold mb-2">Nenhuma partida agendada</h2>
                <p className="text-sm text-[#6B6560]">
                  Simule a rodada na aba <strong>Tabela</strong> para agendar sua próxima partida.
                </p>
              </div>
            )}
          </div>
        )}

        {screen === 'table' && calendar && (
          <div className="overflow-x-auto">
            <LeagueTable
              standings={standings}
              userClubId={userClub.id}
              currentRound={calendar.currentRound}
              totalRounds={calendar.rounds.length}
              onSimulateRound={simulateRound}
              onNewSeason={handleNewSeason}
              onShowResults={() => setShowResults(true)}
            />
          </div>
        )}

        {screen === 'history' && (
          <MatchHistory matches={allPlayedMatches} clubs={CLUBS} userClubId={userClub.id} />
        )}

        {screen === 'club' && (
          <ClubScreen club={userClub} onUpdate={setUserClub} />
        )}

        {screen === 'market' && (
          <TransferMarket allPlayers={players} userClub={userClub} onBuy={handleBuy} onSell={handleSell} />
        )}

        {screen === 'training' && (
          <TrainingScreen players={players} onApply={handleTraining} />
        )}

      </main>

      {/* TAB BAR mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#F2EDE4] border-t border-[#1A1A1A] z-10">
        <div className="grid grid-cols-4 gap-0">
          {NAV.slice(0, 4).map(({ icon, label, value }) => (
            <button key={value} onClick={() => setScreen(value)}
              className={`flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer
                ${screen === value ? 'text-[#E8432D]' : 'text-[#6B6560]'}`}>
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-0 border-t border-[#D6CFC4]">
          {NAV.slice(4).map(({ icon, label, value }) => (
            <button key={value} onClick={() => setScreen(value)}
              className={`flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer
                ${screen === value ? 'text-[#E8432D]' : 'text-[#6B6560]'}`}>
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;