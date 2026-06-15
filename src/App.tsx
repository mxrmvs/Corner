import { useState } from 'react';
import type { PositionFilter } from './types';
import { PLAYERS } from './players';
import { PlayerCard } from './PlayerCard';
import { SquadFilter } from './SquadFilter';
import { MatchScreen } from './MatchScreen';

const counts = {
  ALL: PLAYERS.length,
  GK:  PLAYERS.filter(p => p.position === 'GK').length,
  DEF: PLAYERS.filter(p => p.position === 'DEF').length,
  MID: PLAYERS.filter(p => p.position === 'MID').length,
  ATT: PLAYERS.filter(p => p.position === 'ATT').length,
};

type Screen = 'squad' | 'match';

function App() {
  const [filter, setFilter] = useState<PositionFilter>('ALL');
  const [screen, setScreen] = useState<Screen>('squad');

  const visible = filter === 'ALL'
    ? PLAYERS
    : PLAYERS.filter(p => p.position === filter);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] font-sans">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex justify-between items-center sticky top-0 bg-[#0B0F14]/90 backdrop-blur-sm z-10">
        <div>
          <h1 className="text-2xl font-black tracking-[0.15em] text-[#E6EDF3]">CORNER</h1>
          <p className="text-xs text-[#8B97A3] mt-0.5">Simulador de Carreira de Técnico</p>
        </div>
        <button
          onClick={() => setScreen(screen === 'squad' ? 'match' : 'squad')}
          className="bg-[#2DFFA8] text-[#0B0F14] font-black px-5 py-2 rounded-full text-sm hover:brightness-110 transition-all cursor-pointer">
          {screen === 'squad' ? '⚽ Simular Partida' : '← Elenco'}
        </button>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Tela de Elenco */}
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

        {/* Tela de Partida */}
        {screen === 'match' && (
          <MatchScreen
            homePlayers={PLAYERS}
            awayPlayers={[...PLAYERS].sort(() => Math.random() - 0.5).slice(0, 11)}
            homeTeamName="Corner FC"
            awayTeamName="Rival FC"
            onBack={() => setScreen('squad')}
          />
        )}
      </main>
    </div>
  );
}

export default App;