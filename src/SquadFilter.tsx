import type { PositionFilter } from '../types';

const FILTERS: { label: string; value: PositionFilter }[] = [
  { label: 'ALL',  value: 'ALL' },
  { label: 'GK',   value: 'GK'  },
  { label: 'DEF',  value: 'DEF' },
  { label: 'MID',  value: 'MID' },
  { label: 'ATT',  value: 'ATT' },
];

interface Props {
  active: PositionFilter;
  onChange: (f: PositionFilter) => void;
  counts: Record<PositionFilter, number>;
}

export const SquadFilter = ({ active, onChange, counts }: Props) => (
  <div className="flex gap-0 border border-[#D6CFC4] rounded overflow-hidden w-fit mb-3">
    {FILTERS.map(({ label, value }) => (
      <button key={value} onClick={() => onChange(value)}
        className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase
          border-r border-[#D6CFC4] last:border-0 transition-colors cursor-pointer
          ${active === value
            ? 'bg-[#1A1A1A] text-white'
            : 'bg-white text-[#6B6560] hover:bg-[#EDE8DF]'
          }`}>
        {label}
        <span className="ml-1 opacity-50 font-normal">{counts[value]}</span>
      </button>
    ))}
  </div>
);