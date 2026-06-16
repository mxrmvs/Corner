import type { Player } from './types';
import { effectiveRating } from './types';

const FORMATION_POSITIONS: Record<string, { x: number; y: number; pos: string }[]> = {
  '4-3-3': [
    { x: 50, y: 88, pos: 'GK' },
    { x: 15, y: 68, pos: 'DEF' }, { x: 38, y: 72, pos: 'DEF' }, { x: 62, y: 72, pos: 'DEF' }, { x: 85, y: 68, pos: 'DEF' },
    { x: 25, y: 48, pos: 'MID' }, { x: 50, y: 44, pos: 'MID' }, { x: 75, y: 48, pos: 'MID' },
    { x: 20, y: 18, pos: 'ATT' }, { x: 50, y: 14, pos: 'ATT' }, { x: 80, y: 18, pos: 'ATT' },
  ],
  '4-4-2': [
    { x: 50, y: 88, pos: 'GK' },
    { x: 15, y: 68, pos: 'DEF' }, { x: 38, y: 72, pos: 'DEF' }, { x: 62, y: 72, pos: 'DEF' }, { x: 85, y: 68, pos: 'DEF' },
    { x: 15, y: 46, pos: 'MID' }, { x: 38, y: 48, pos: 'MID' }, { x: 62, y: 48, pos: 'MID' }, { x: 85, y: 46, pos: 'MID' },
    { x: 35, y: 18, pos: 'ATT' }, { x: 65, y: 18, pos: 'ATT' },
  ],
  '4-2-3-1': [
    { x: 50, y: 88, pos: 'GK' },
    { x: 15, y: 70, pos: 'DEF' }, { x: 38, y: 74, pos: 'DEF' }, { x: 62, y: 74, pos: 'DEF' }, { x: 85, y: 70, pos: 'DEF' },
    { x: 33, y: 54, pos: 'MID' }, { x: 67, y: 54, pos: 'MID' },
    { x: 15, y: 32, pos: 'MID' }, { x: 50, y: 30, pos: 'MID' }, { x: 85, y: 32, pos: 'MID' },
    { x: 50, y: 12, pos: 'ATT' },
  ],
  '3-5-2': [
    { x: 50, y: 88, pos: 'GK' },
    { x: 25, y: 72, pos: 'DEF' }, { x: 50, y: 74, pos: 'DEF' }, { x: 75, y: 72, pos: 'DEF' },
    { x: 10, y: 50, pos: 'MID' }, { x: 30, y: 48, pos: 'MID' }, { x: 50, y: 46, pos: 'MID' }, { x: 70, y: 48, pos: 'MID' }, { x: 90, y: 50, pos: 'MID' },
    { x: 33, y: 18, pos: 'ATT' }, { x: 67, y: 18, pos: 'ATT' },
  ],
  '5-3-2': [
    { x: 50, y: 88, pos: 'GK' },
    { x: 10, y: 68, pos: 'DEF' }, { x: 28, y: 72, pos: 'DEF' }, { x: 50, y: 74, pos: 'DEF' }, { x: 72, y: 72, pos: 'DEF' }, { x: 90, y: 68, pos: 'DEF' },
    { x: 25, y: 46, pos: 'MID' }, { x: 50, y: 44, pos: 'MID' }, { x: 75, y: 46, pos: 'MID' },
    { x: 33, y: 18, pos: 'ATT' }, { x: 67, y: 18, pos: 'ATT' },
  ],
};

const POS_LABEL: Record<string, string> = { GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA' };

interface Props {
  players: Player[];
  formation: string;
  onPlayerClick?: (p: Player) => void;
  selectedIds?: string[];
}

export const FieldView = ({ players, formation, onPlayerClick, selectedIds = [] }: Props) => {
  const positions = FORMATION_POSITIONS[formation] ?? FORMATION_POSITIONS['4-4-2'];

  // Distribui jogadores nas posições por posição exata
  const assigned: (Player | null)[] = positions.map((slot, i) => {
    const posMap: Record<string, string> = { GK: 'GK', DEF: 'DEF', MID: 'MID', ATT: 'ATT' };
    const posPlayers = players.filter(p => p.position === posMap[slot.pos]);
    const alreadyUsed = positions.slice(0, i)
      .filter((s, j) => s.pos === slot.pos)
      .map((_, j) => {
        const pp = players.filter(p => p.position === posMap[slot.pos]);
        return pp[j]?.id;
      })
      .filter(Boolean);
    const available = posPlayers.filter(p => !alreadyUsed.includes(p.id));
    return available[0] ?? null;
  });

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '140%', background: '#2D6A4F', border: '1px solid #1A1A1A', overflow: 'hidden' }}>
      {/* Linhas do campo */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 140" preserveAspectRatio="none">
        {/* Borda */}
        <rect x="2" y="2" width="96" height="136" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        {/* Linha do meio */}
        <line x1="2" y1="70" x2="98" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        {/* Círculo central */}
        <circle cx="50" cy="70" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <circle cx="50" cy="70" r="0.8" fill="rgba(255,255,255,0.3)" />
        {/* Área grande (ataque — topo) */}
        <rect x="18" y="2" width="64" height="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        {/* Área pequena (ataque) */}
        <rect x="32" y="2" width="36" height="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        {/* Área grande (defesa — base) */}
        <rect x="18" y="116" width="64" height="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        {/* Área pequena (defesa) */}
        <rect x="32" y="128" width="36" height="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        {/* Listras do campo */}
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x="2" y={2 + i * 20} width="96" height="10" fill={i % 2 === 0 ? 'rgba(0,0,0,0.05)' : 'transparent'} />
        ))}
      </svg>

      {/* Jogadores */}
      {positions.map((slot, i) => {
        const player = assigned[i];
        const eff    = player ? effectiveRating(player) : 0;
        const isSel  = player ? selectedIds.includes(player.id) : false;

        return (
          <div key={i}
            onClick={() => player && onPlayerClick?.(player)}
            style={{
              position: 'absolute',
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              cursor: onPlayerClick ? 'pointer' : 'default',
              zIndex: 2,
            }}>
            {/* Círculo do jogador */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: player ? (isSel ? '#E8432D' : 'white') : 'rgba(255,255,255,0.15)',
              border: `2px solid ${player ? (isSel ? '#E8432D' : 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.2)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: player ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
            }}>
              {player ? (
                <>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: isSel ? 'white' : '#1A1A1A', lineHeight: 1 }}>{eff}</span>
                  <span style={{ fontSize: '7px', color: isSel ? 'rgba(255,255,255,0.8)' : '#6B6560', lineHeight: 1 }}>{POS_LABEL[player.position]}</span>
                </>
              ) : (
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{POS_LABEL[slot.pos]}</span>
              )}
            </div>
            {/* Nome */}
            {player && (
              <div style={{
                background: 'rgba(0,0,0,0.65)', padding: '1px 5px', borderRadius: '2px',
                maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: '8px', color: 'white', fontWeight: 700 }}>
                  {player.name.split(' ').slice(-1)[0]}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};