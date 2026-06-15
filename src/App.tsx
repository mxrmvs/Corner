import type { Player } from './types';
import { PlayerCard } from './PlayerCard';

const PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Bruno Guimarães',
    age: 27,
    position: 'MID',
    foot: 'Destro',
    currentRating: 85,
    attributes: { attack: 82, defense: 81, physical: 84 },
  },
  {
    id: '2',
    name: 'Endrick F.',
    age: 18,
    position: 'ATT',
    foot: 'Destro',
    currentRating: 76,
    attributes: { attack: 79, defense: 44, physical: 77 },
  },
  {
    id: '3',
    name: 'Alisson B.',
    age: 32,
    position: 'GK',
    foot: 'Destro',
    currentRating: 89,
    attributes: { attack: 30, defense: 91, physical: 85 },
  },
];

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0F14',
      color: '#E6EDF3',
      fontFamily: 'system-ui, sans-serif',
      padding: '40px 24px',
    }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '0.1em' }}>CORNER</h1>
        <p style={{ color: '#FFFFFF', fontWeight: 600, marginTop: '1.5rem', margin: '8px 0 0' }}>
          Manager Real Time Game
        </p>
      </div>

      {/* Cartões */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {PLAYERS.map((p) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}

export default App;