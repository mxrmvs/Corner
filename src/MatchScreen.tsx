import { useState } from 'react';
import type { Player } from './types';
import { simulateMatch } from './engine';
import type { MatchEvent } from './engine';

interface Props {
  homePlayers: Player[];
  awayPlayers: Player[];
  homeTeamName: string;
  awayTeamName: string;
  onBack: () => void;
}

export const MatchScreen = ({ homePlayers, awayPlayers, homeTeamName, awayTeamName, onBack }: Props) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const startMatch = () => {
    setRunning(true);
    setDone(false);
    setEvents([]);
    setHomeGoals(0);
    setAwayGoals(0);

    const result = simulateMatch(homePlayers, awayPlayers, homeTeamName, awayTeamName);
    let i = 0;

    const interval = setInterval(() => {
      if (i >= result.events.length) {
        clearInterval(interval);
        setHomeGoals(result.homeGoals);
        setAwayGoals(result.awayGoals);
        setRunning(false);
        setDone(true);
        return;
      }
      const ev = result.events[i];
      setEvents(prev => [...prev, ev]);
      if (ev.text.startsWith('⚽')) {
        const h = (ev.text.match(new RegExp(`${homeTeamName} (\\d+)`)) || [])[1];
        const a = (ev.text.match(new RegExp(`(\\d+) ${awayTeamName}`)) || [])[1];
        if (h) setHomeGoals(Number(h));
        if (a) setAwayGoals(Number(a));
      }
      i++;
    }, 800);
  };

  return (
    <div style={{
      background: 'rgba(19,26,34,0.95)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: 24, maxWidth: 600,
    }}>
      {/* Placar */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#8B97A3', marginBottom: 8 }}>⚽ Partida</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#E6EDF3' }}>{homeTeamName}</span>
          <span style={{ fontSize: 48, fontWeight: 800, color: '#2DFFA8', minWidth: 100, textAlign: 'center' }}>
            {homeGoals} x {awayGoals}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#E6EDF3' }}>{awayTeamName}</span>
        </div>
      </div>

      {/* Botão */}
      {!running && !done && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button onClick={startMatch} style={{
            background: '#2DFFA8', color: '#0B0F14',
            border: 'none', borderRadius: 999,
            padding: '10px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer',
          }}>
            ▶ Iniciar Partida
          </button>
        </div>
      )}

      {running && (
        <div style={{ textAlign: 'center', marginBottom: 16, color: '#2DFFA8', fontSize: 13 }}>
          🔴 Ao vivo...
        </div>
      )}

      {/* Feed de eventos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
        {events.map((ev, i) => (
          <div key={i} style={{
            padding: '8px 12px', borderRadius: 8,
            background: ev.text.startsWith('⚽') ? 'rgba(45,255,168,0.08)' : 'rgba(255,255,255,0.03)',
            color: ev.text.startsWith('⚽') ? '#2DFFA8' : '#8B97A3',
            fontSize: 13,
          }}>
            {ev.text}
          </div>
        ))}
      </div>

      {/* Botões pós-jogo */}
      {done && (
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center' }}>
          <button onClick={startMatch} style={{
            background: 'rgba(255,255,255,0.06)', color: '#E6EDF3',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
            padding: '8px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            🔄 Repetir
          </button>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.06)', color: '#E6EDF3',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
            padding: '8px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            ← Voltar
          </button>
        </div>
      )}
    </div>
  );
};
