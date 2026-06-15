import type { Player } from './types';
import { effectiveRating } from './types';

const POS: Record<string, string> = {
  GK: 'GK', DEF: 'CB', MID: 'CM', ATT: 'ST',
};

const ratingColor = (v: number) =>
  v >= 85 ? 'text-[#E8432D] font-black'
  : v >= 75 ? 'text-[#1A1A1A] font-black'
  : 'text-[#6B6560] font-bold';

const conditionBar = (value: number, color: string) => (
  <div className="w-full h-0.5 bg-[#D6CFC4] rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all ${color}`}
      style={{ width: `${value}%` }}
    />
  </div>
);

interface Props {
  player: Player;
  index?: number;
  selected?: boolean;
  onClick?: () => void;
}

export const PlayerCard = ({ player: p, index, selected, onClick }: Props) => {
  const eff = effectiveRating(p);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 border-b border-[#D6CFC4] cursor-pointer
        transition-colors hover:bg-[#EDE8DF] group
        ${selected ? 'bg-[#E8432D] hover:bg-[#E8432D]' : 'bg-white'}`}>

      {/* Número */}
      {index !== undefined && (
        <span className={`text-xs w-5 text-right shrink-0
          ${selected ? 'text-white/70' : 'text-[#9E9890]'}`}>
          #{index}
        </span>
      )}

      {/* Posição */}
      <span className={`text-2xs font-bold w-6 shrink-0
        ${selected ? 'text-white/80' : 'text-[#9E9890]'}`}>
        {POS[p.position]}
      </span>

      {/* Nome */}
      <span className={`flex-1 font-bold text-sm truncate
        ${selected ? 'text-white' : 'text-[#1A1A1A]'}`}>
        {p.name}
      </span>

      {/* Condition bars (stamina / fitness / morale) */}
      <div className="flex flex-col gap-0.5 w-12 shrink-0">
        {conditionBar(p.condition.stamina,      selected ? 'bg-white/70' : 'bg-[#4A7C59]')}
        {conditionBar(p.condition.matchFitness, selected ? 'bg-white/70' : 'bg-[#C9A84C]')}
        {conditionBar(p.condition.morale,       selected ? 'bg-white/70' : 'bg-[#E8432D]')}
      </div>

      {/* Rating efetivo */}
      <span className={`text-lg tabular-nums w-8 text-right shrink-0
        ${selected ? 'text-white font-black' : ratingColor(eff)}`}>
        {eff}
      </span>
    </div>
  );
};