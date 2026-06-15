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
  <div className="flex gap-2 flex-wrap mb-6">
    {FILTERS.map(({ label, value }) => {
      const isActive = active === value;
      return (
        <button key={value} onClick={() => onChange(value)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer
            ${isActive
              ? 'bg-[#2DFFA8] text-[#0B0F14]'
              : 'bg-white/[0.06] text-[#8B97A3] hover:bg-white/10 hover:text-[#E6EDF3]'
            }`}>
          {label}
          <span className="ml-1.5 opacity-60">{counts[value]}</span>
        </button>
      );
    })}
  </div>
);