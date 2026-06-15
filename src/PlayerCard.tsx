import type { Player } from './types';

const POSITION_LABEL: Record<string, string> = {
  GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA',
};

const ratingColor = (v: number) => {
  if (v >= 85) return 'bg-[rgba(45,255,168,0.15)] text-[#2DFFA8] ring-1 ring-[rgba(45,255,168,0.3)]';
  if (v >= 75) return 'bg-[rgba(56,189,248,0.15)] text-[#38BDF8] ring-1 ring-[rgba(56,189,248,0.3)]';
  if (v >= 65) return 'bg-[rgba(251,191,36,0.15)] text-[#FBBF24] ring-1 ring-[rgba(251,191,36,0.3)]';
  return 'bg-white/5 text-[#8B97A3] ring-1 ring-white/10';
};

const ratingTextColor = (v: number) => {
  if (v >= 85) return 'text-[#2DFFA8]';
  if (v >= 75) return 'text-[#38BDF8]';
  if (v >= 65) return 'text-[#FBBF24]';
  return 'text-[#8B97A3]';
};

const Badge = ({ label, value }: { label: string; value: number }) => (
  <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold ${ratingColor(value)}`}>
    <span className="opacity-60 font-medium">{label}</span>
    {value}
  </span>
);

export const PlayerCard = ({ player: p }: { player: Player }) => (
  <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-5 w-64 flex flex-col gap-3 hover:border-white/20 hover:scale-[1.02] transition-all duration-200">
    <div className="flex justify-between items-center">
      <span className="bg-white/[0.06] text-[#8B97A3] rounded-lg px-2.5 py-0.5 text-xs font-bold tracking-wider">
        {POSITION_LABEL[p.position]}
      </span>
      <span className={`text-4xl font-black tabular-nums ${ratingTextColor(p.currentRating)}`}>
        {p.currentRating}
      </span>
    </div>
    <div>
      <div className="text-[#E6EDF3] font-bold text-base">{p.name}</div>
      <div className="text-[#8B97A3] text-xs mt-0.5">{p.age} anos · {p.foot}</div>
    </div>
    <div className="flex gap-1.5 flex-wrap justify-center">
      <Badge label="ATA" value={p.attributes.attack} />
      <Badge label="DEF" value={p.attributes.defense} />
      <Badge label="FÍS" value={p.attributes.physical} />
    </div>
  </div>
);