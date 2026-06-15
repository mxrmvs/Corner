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
  const [events, setEvents]       = useState<MatchEvent[]>([]);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [running, setRunning]     = useState(false);
  const [done, setDone]           = useState(false);

  const startMatch = (lineup: Player[]) => {
    setRunning(true);
    setDone(false);
    setEvents([]);
    setHomeGoals(0);
    setAwayGoals(0);

    const result = simulateMatch(lineup, awayPlayers, homeTeamName, awayTeamName);
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
    }, 700);
  };

  return (
    <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-6 max-w-xl mx-auto">
      {/* Placar */}
      <div className="text-center mb-6">
        <div className="text-xs text-[#8B97A3] mb-3 tracking-widest uppercase">⚽ Partida ao Vivo</div>
        <div className="flex justify-center items-center gap-6">
          <span className="text-base font-bold text-[#E6EDF3] w-28 text-right">{homeTeamName}</span>
          <span className="text-5xl font-black text-[#2DFFA8] tabular-nums w-24 text-center">
            {homeGoals} — {awayGoals}
          </span>
          <span className="text-base font-bold text-[#E6EDF3] w-28 text-left">{awayTeamName}</span>
        </div>
        {running && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#FB5C6B] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB5C6B] animate-pulse inline-block" />
            AO VIVO
          </div>
        )}
      </div>

      {/* Botão iniciar */}
      {!running && !done && (
        <div className="text-center mb-6">
          <button onClick={() => startMatch(homePlayers)}
            className="bg-[#2DFFA8] text-[#0B0F14] font-black px-8 py-2.5 rounded-full text-sm hover:brightness-110 transition-all cursor-pointer">
            ▶ Iniciar Partida
          </button>
        </div>
      )}

      {/* Feed de eventos */}
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
        {events.map((ev, i) => (
          <div key={i} className={`px-3 py-2 rounded-lg text-xs transition-all
            ${ev.text.startsWith('⚽') ? 'bg-[rgba(45,255,168,0.08)] text-[#2DFFA8] font-semibold'
            : ev.text.startsWith('🧱') ? 'bg-[rgba(251,191,36,0.06)] text-[#FBBF24]'
            : ev.text.startsWith('⚠️') ? 'bg-[rgba(56,189,248,0.06)] text-[#38BDF8]'
            : 'bg-white/[0.02] text-[#8B97A3]'}`}>
            {ev.text}
          </div>
        ))}
      </div>

      {/* Botões pós-jogo */}
      {done && (
        <div className="flex gap-3 mt-5 justify-center">
          <button onClick={() => startMatch(homePlayers)}
            className="bg-white/[0.06] text-[#E6EDF3] border border-white/10 rounded-full px-6 py-2 text-xs font-bold hover:bg-white/10 transition-all cursor-pointer">
            🔄 Repetir
          </button>
          <button onClick={onBack}
            className="bg-white/[0.06] text-[#E6EDF3] border border-white/10 rounded-full px-6 py-2 text-xs font-bold hover:bg-white/10 transition-all cursor-pointer">
            ← Elenco
          </button>
        </div>
      )}
    </div>
  );
};