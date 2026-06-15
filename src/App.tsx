import { useState } from 'react';
import type { PositionFilter } from './types';
import { PLAYERS } from './players';
import { PlayerCard } from './PlayerCard';
import { SquadFilter } from './SquadFilter';

const counts = {
  ALL: PLAYERS.length,
  GK:  PLAYERS.filter(p => p.position === 'GK').length,
  DEF: PLAYERS.filter(p => p.position === 'DEF').length,
  MID: PLAYERS.filter(p => p.position === 'MID').length,
  ATT: PLAYERS.filter(p => p.position === 'ATT').length,
};

function App() {
  const [filter, setFilter] = useState<PositionFilter>('ALL');

  const visible = filter === 'ALL'
    ? PLAYERS
    : PLAYERS.filter(p => p.position === filter);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0F14',
      color: '#E6EDF3',
      fontFamily: 'system-ui, sans-serif',
      padding: '40px 24px',
    }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '0.1em' }}>CORNER</h1>
        <p style={{ color: '#FFFFFF', fontWeight: 600, margin: '8px 0 0' }}>
          Simulador de Carreira de Técnico
        </p>
      </div>

      {/* Elenco */}
      <div style={{
        background: 'rgba(19,26,34,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Elenco</h2>
          <span style={{ color: '#8B97A3', fontSize: 13 }}>{visible.length} jogadores</span>
        </div>

        <SquadFilter active={filter} onChange={setFilter} counts={counts} />

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {visible.map(p => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
