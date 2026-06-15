import type { PositionFilter } from './types';

const FILTERS: { label: string; value: PositionFilter }[] = [
  { label: 'Todos', value: 'ALL' },
  { label: 'GOL',   value: 'GK'  },
  { label: 'ZAG',   value: 'DEF' },
  { label: 'MEI',   value: 'MID' },
  { label: 'ATA',   value: 'ATT' },
];

interface Props {
  active: PositionFilter;
  onChange: (f: PositionFilter) => void;
  counts: Record<PositionFilter, number>;
}

export const SquadFilter = ({ active, onChange, counts }: Props) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
    {FILTERS.map(({ label, value }) => {
      const isActive = active === value;
      return (
        <button key={value} onClick={() => onChange(value)} style={{
          padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
          fontWeight: 700, fontSize: 13,
          background: isActive ? '#2DFFA8' : 'rgba(255,255,255,0.06)',
          color: isActive ? '#0B0F14' : '#8B97A3',
          transition: 'all 0.15s',
        }}>
          {label}
          <span style={{
            marginLeft: 6, fontSize: 11,
            opacity: 0.7,
          }}>
            {counts[value]}
          </span>
        </button>
      );
    })}
  </div>
);