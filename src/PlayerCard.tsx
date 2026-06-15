import type { Player } from './types';

const POSITION_LABEL: Record<string, string> = {
  GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA',
};

const ratingColor = (v: number) => {
  if (v >= 85) return { bg: 'rgba(45,255,168,0.15)', color: '#2DFFA8', ring: '1px solid rgba(45,255,168,0.3)' };
  if (v >= 75) return { bg: 'rgba(56,189,248,0.15)', color: '#38BDF8', ring: '1px solid rgba(56,189,248,0.3)' };
  if (v >= 65) return { bg: 'rgba(251,191,36,0.15)', color: '#FBBF24', ring: '1px solid rgba(251,191,36,0.3)' };
  return { bg: 'rgba(255,255,255,0.05)', color: '#8B97A3', ring: '1px solid rgba(255,255,255,0.1)' };
};

const Badge = ({ label, value }: { label: string; value: number }) => {
  const c = ratingColor(value);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 999,
      background: c.bg, color: c.color, outline: c.ring,
      fontSize: 12, fontWeight: 700,
    }}>
      <span style={{ opacity: 0.7, fontWeight: 500 }}>{label}</span>
      {value}
    </span>
  );
};

export const PlayerCard = ({ player: p }: { player: Player }) => (
  <div style={{
    background: 'rgba(19,26,34,0.95)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, padding: '20px 24px',
    width: 280, display: 'flex', flexDirection: 'column', gap: 12,
  }}>
    {/* Topo: posição + rating */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{
        background: 'rgba(255,255,255,0.06)', color: '#8B97A3',
        borderRadius: 8, padding: '2px 10px', fontSize: 12, fontWeight: 700,
      }}>
        {POSITION_LABEL[p.position]}
      </span>
      <span style={{ fontSize: 36, fontWeight: 800, color: ratingColor(p.currentRating).color }}>
        {p.currentRating}
      </span>
    </div>

    {/* Nome e info */}
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#E6EDF3' }}>{p.name}</div>
      <div style={{ fontSize: 12, color: '#8B97A3', marginTop: 2 }}>
        {p.age} anos · {p.foot}
      </div>
    </div>

    {/* Badges de atributos */}
<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Badge label="ATA" value={p.attributes.attack} />
      <Badge label="DEF" value={p.attributes.defense} />
      <Badge label="FÍS" value={p.attributes.physical} />
    </div>
  </div>
);