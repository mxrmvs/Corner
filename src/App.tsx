import { useState, useEffect, useRef } from 'react';
import type { PositionFilter, Player, Division } from './types';
import { effectiveRating } from './types';
import { PLAYERS as INITIAL_PLAYERS } from './players';
import { CLUBS } from './clubs';
import type { Club } from './clubs';
import { PlayerCard } from './PlayerCard';
import { SquadFilter } from './SquadFilter';
import { MatchScreen } from './MatchScreen';
import { LeagueTable } from './LeagueTable';
import { ClubScreen } from './ClubScreen';
import { ClubSelect } from './ClubSelect';
import { SplashScreen } from './SplashScreen';
import { Dashboard } from './Dashboard';
import { TransferMarket } from './TransferMarket';
import { SeasonReport } from './SeasonReport';
import { DilemmaModal } from './DilemmaModal';
import { TrainingScreen } from './TrainingScreen';
import { RoundResults } from './RoundResults';
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

type Screen = 'squad' | 'lineup' | 'table' | 'history' | 'market' | 'training' | 'club';
type AppState = 'loading' | 'splash' | 'select' | 'playing';

interface NewsItem { id: string; text: string; type: 'win' | 'loss' | 'draw' | 'info' | 'alert'; }

function generateSeed(): string {
  return Math.random().toString(16).slice(2, 8).toUpperCase();
}

function teamOvr(clubId: string, players: Player[]): number {
  const xi = players.filter(p => p.clubId === clubId)
    .sort((a, b) => effectiveRating(b) - effectiveRating(a)).slice(0, 11);
  return xi.length ? Math.round(xi.reduce((s, p) => s + effectiveRating(p), 0) / xi.length) : 60;
}

function getOpponentId(calendar: Calendar | null, userClubId: string): string {
  if (!calendar) return '';
  const round = calendar.rounds[calendar.currentRound - 1]
    ?? calendar.rounds[calendar.currentRound - 2];
  if (!round) return '';
  const match = round.find(m => m.homeClubId === userClubId || m.awayClubId === userClubId);
  if (!match) return '';
  return match.homeClubId === userClubId ? match.awayClubId : match.homeClubId;
}

function isHomeGame(calendar: Calendar | null, userClubId: string): boolean {
  if (!calendar) return true;
  const round = calendar.rounds[calendar.currentRound - 1];
  if (!round) return true;
  const match = round.find(m => m.homeClubId === userClubId || m.awayClubId === userClubId);
  return match?.homeClubId === userClubId ?? true;
}

function App() {
  const [appState, setAppState]           = useState<AppState>('loading');
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
  const [news, setNews]                   = useState<NewsItem[]>([]);
  const [hasSave, setHasSave]             = useState(false);
  const [savedInfo, setSavedInfo]         = useState<{ club: string; season: number; pos: number; wins: number; pts: number } | null>(null);
  const seedRef                           = useRef<string>(generateSeed());

  useEffect(() => {
    loadGame().then(data => {
      if (data) {
        setHasSave(true);
        // calcula posição salva para mostrar na splash
        const pos = data.standings.findIndex(s => s.clubId === data.userClub?.id) + 1;
        const standing = data.standings.find(s => s.clubId === data.userClub?.id);
        setSavedInfo({
          club: data.userClub?.name ?? '',
          season: data.season,
          pos,
          wins: standing?.wins ?? 0,
          pts: standing?.points ?? 0,
        });
      }
      setAppState('splash');
    });
  }, []);

  useEffect(() => {
    if (!calendar || appState !== 'playing') return;
    saveGame({ calendar, standings, season, players, userClub }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }, [calendar, standings, season, players, userClub]);

  const addNews = (items: NewsItem[]) => setNews(prev => [...items, ...prev].slice(0, 50));

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
      setNews([]);
      seedRef.current = generateSeed();
      setAppState('select');
    });
  };

  const handleSelectClub = (club: Club) => {
    setUserClub(club);
    setCalendar(generateCalendar());
    setStandings(computeStandings([]));
    addNews([{ id: 'start', text: `Carreira iniciada com ${club.name} na Série ${club.division}.`, type: 'info' }]);
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

    // gera notícia do resultado do userClub
    const userMatch = updatedRound.find(m => m.homeClubId === userClub.id || m.awayClubId === userClub.id);
    if (userMatch) {
      const isHome = userMatch.homeClubId === userClub.id;
      const myGoals = isHome ? userMatch.homeGoals! : userMatch.awayGoals!;
      const oppGoals = isHome ? userMatch.awayGoals! : userMatch.homeGoals!;
      const oppName = CLUBS.find(c => c.id === (isHome ? userMatch.awayClubId : userMatch.homeClubId))?.name ?? 'Adversário';
      const result = myGoals > oppGoals ? 'win' : myGoals < oppGoals ? 'loss' : 'draw';
      const prefix = result === 'win' ? 'Vitória' : result === 'loss' ? 'Derrota' : 'Empate';
      addNews([{
        id: `r${currentRound}`,
        text: `Rod. ${currentRound} · ${prefix} ${myGoals}x${oppGoals} vs ${oppName}`,
        type: result,
      }]);
    }

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
    const { players: evolved, news: evolveNews } = evolveSquad(players);
    setPlayers(evolved);
    setReport({ news: evolveNews });
  };

  const confirmNewSeason = () => {
    setCalendar(generateCalendar());
    setStandings(computeStandings([]));
    setSeason(s => s + 1);
    setReport(null);
    addNews([{ id: `season${season + 1}`, text: `Temporada ${season + 1} iniciada.`, type: 'info' }]);
  };

  const handleBuy = (p: Player) => {
    setPlayers(prev => prev.map(pl => pl.id === p.id ? { ...pl, clubId: userClub.id } : pl));
    setUserClub(prev => ({ ...prev, balance: prev.balance - p.marketValue }));
    addNews([{ id: `buy${p.id}`, text: `Contratado: ${p.name} (OVR ${p.currentRating})`, type: 'info' }]);
  };

  const handleSell = (p: Player) => {
    setPlayers(prev => prev.map(pl => pl.id === p.id ? { ...pl, clubId: '' } : pl));
    setUserClub(prev => ({ ...prev, balance: prev.balance + p.marketValue }));
    addNews([{ id: `sell${p.id}`, text: `Vendido: ${p.name}`, type: 'info' }]);
  };

  const handleTraining = (focusMap: Record<string, TrainingFocus>) => {
    const { players: trained, injuries } = applySquadTraining(players, focusMap);
    setPlayers(trained);
    if (injuries.length > 0) {
      setReport({ news: injuries });
      injuries.forEach((n, i) => addNews([{ id: `inj${i}`, text: n, type: 'alert' }]));
    }
  };

  const handleConfirmLineup = (confirmed: Player[]) => {
    setLineup(confirmed);
    setScreen('squad');
  };

  // ── Loading ──
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center">
        <div className="text-center">
          <h1 style={{ fontFamily: 'Georgia, serif', letterSpacing: '-1px' }}
            className="text-5xl font-black text-[#1A1A1A]">CORNER</h1>
          <p className="text-[10px] text-[#E8432D] tracking-[0.15em] uppercase mt-2 font-sans">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  // ── Splash ──
  if (appState === 'splash') {
    return (
      <SplashScreen
        hasSave={hasSave}
        savedClubName={savedInfo?.club}
        savedSeason={savedInfo?.season}
        savedPosition={savedInfo?.pos}
        savedWins={savedInfo?.wins}
        savedPoints={savedInfo?.pts}
        seed={seedRef.current}
        onNewGame={handleNewGame}
        onContinue={handleContinue}
      />
    );
  }

  // ── Seleção de clube ──
  if (appState === 'select') {
    return (
      <ClubSelect
        clubs={CLUBS}
        selectedDivision={selectedDivision}
        onDivisionChange={setSelectedDivision}
        onSelect={handleSelectClub}
        onBack={() => setAppState('splash')}
      />
    );
  }

  // ── Jogo ──
  const mySquadPlayers   = players.filter(p => p.clubId === userClub.id);
  const activePlayers    = lineup.length === 11 ? lineup : mySquadPlayers;
  const oppId            = getOpponentId(calendar, userClub.id);
  const oppPlayers       = players.filter(p => p.clubId === oppId);
  const oppClub          = CLUBS.find(c => c.id === oppId);
  const lastRound        = calendar && calendar.currentRound > 1
    ? calendar.rounds[calendar.currentRound - 2] : null;
  const allPlayedMatches = calendar ? calendar.rounds.flat().filter(m => m.played) : [];
  const myOvr            = teamOvr(userClub.id, players);
  const oppOvr           = teamOvr(oppId, players);
  const isHome           = isHomeGame(calendar, userClub.id);

  const counts = {
    ALL: mySquadPlayers.length,
    GK:  mySquadPlayers.filter(p => p.position === 'GK').length,
    DEF: mySquadPlayers.filter(p => p.position === 'DEF').length,
    MID: mySquadPlayers.filter(p => p.position === 'MID').length,
    ATT: mySquadPlayers.filter(p => p.position === 'ATT').length,
  };
  const visible = filter === 'ALL' ? mySquadPlayers : mySquadPlayers.filter(p => p.position === filter);

  return (
    <>
      {report && <SeasonReport news={report.news} season={season} onClose={confirmNewSeason} />}
      {dilemma && !report && <DilemmaModal dilemma={dilemma} players={players} onChoose={handleDilemmaChoice} />}
      {showResults && lastRound && (
        <RoundResults matches={lastRound} clubs={CLUBS} userClubId={userClub.id}
          round={calendar!.currentRound - 1} onClose={() => setShowResults(false)} />
      )}
      {achievements.length > 0 && (
        <AchievementToast achievements={achievements} onDone={() => setAchievements([])} />
      )}

      <Dashboard
        screen={screen}
        onScreenChange={setScreen}
        userClub={userClub}
        players={players}
        calendar={calendar}
        standings={standings}
        season={season}
        seed={seedRef.current}
        saved={saved}
        news={news}
        oppClub={oppClub}
        oppOvr={oppOvr}
        myOvr={myOvr}
        isHome={isHome}
        currentRound={calendar?.currentRound ?? 1}
        totalRounds={calendar?.rounds.length ?? 38}
        onSimulateRound={simulateRound}
        onNewSeason={handleNewSeason}
        onExit={() => { deleteGame(); window.location.reload(); }}
      >
        {screen === 'lineup' && (
          <LineupScreen players={mySquadPlayers} onConfirm={handleConfirmLineup} onBack={() => setScreen('squad')} />
        )}
        {screen === 'table' && calendar && (
          <div className="overflow-x-auto">
            <LeagueTable standings={standings} userClubId={userClub.id}
              currentRound={calendar.currentRound} totalRounds={calendar.rounds.length}
              onSimulateRound={simulateRound} onNewSeason={handleNewSeason}
              onShowResults={() => setShowResults(true)} />
          </div>
        )}
        {screen === 'history' && (
          <MatchHistory matches={allPlayedMatches} clubs={CLUBS} userClubId={userClub.id} />
        )}
        {screen === 'club' && <ClubScreen club={userClub} onUpdate={setUserClub} />}
        {screen === 'market' && (
          <TransferMarket allPlayers={players} userClub={userClub} onBuy={handleBuy} onSell={handleSell} />
        )}
        {screen === 'training' && <TrainingScreen players={players} onApply={handleTraining} />}
      </Dashboard>
    </>
  );
}

export default App;