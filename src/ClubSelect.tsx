import type { Club } from './clubs';

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$ ${(n / 1_000_000).toFixed(1)}M` : `R$ ${(n / 1_000).toFixed(0)}K`;

const repLabel = (r: number) =>
  r >= 80 ? '⭐⭐⭐ Elite' : r >= 70 ? '⭐⭐ Alto Nível' : r >= 60 ? '⭐ Médio' : '🔰 Modesto';

const repColor = (r: number) =>
  r >= 80 ? 'text-[#2DFFA8]' : r >= 70 ? 'text-[#38BDF8]' : r >= 60 ? 'text-[#FBBF24]' : 'text-[#8B97A3]';

interface Props {
  clubs: Club[];
  onSelect: (club: Club) => void;
}

export const ClubSelect = ({ clubs, onSelect }: Props) => {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] font-sans flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black tracking-[0.15em] text-[#E6EDF3]">CORNER</h1>
        <p className="text-[#8B97A3] mt-2 text-sm">Simulador de Carreira de Técnico</p>
        <div className="w-16 h-0.5 bg-[#2DFFA8] mx-auto mt-4" />
      </div>

      <h2 className="text-lg font-bold mb-6">Escolha seu clube</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
        {clubs.map(club => (
          <button key={club.id} onClick={() => onSelect(club)}
            className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-5 text-left hover:border-[#2DFFA8]/40 hover:bg-[rgba(45,255,168,0.03)] transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
              <span className="font-black text-base text-[#E6EDF3] group-hover:text-[#2DFFA8] transition-colors">
                {club.name}
              </span>
              <span className={`text-xs font-bold ${repColor(club.reputation)}`}>
                {club.reputation}
              </span>
            </div>
            <div className={`text-xs font-bold mb-3 ${repColor(club.reputation)}`}>
              {repLabel(club.reputation)}
            </div>
            <div className="flex flex-col gap-1 text-xs text-[#8B97A3]">
              <div className="flex justify-between">
                <span>Caixa</span>
                <span className="text-[#38BDF8] font-medium">{fmt(club.balance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estádio</span>
                <span className="font-medium">{club.stadiumCapacity.toLocaleString()} lugares</span>
              </div>
              <div className="flex justify-between">
                <span>Estilo</span>
                <span className="font-medium">
                  {club.tactical.style === 'TIKI_TAKA' ? 'Tiki-Taka'
                   : club.tactical.style === 'COUNTER' ? 'Contra-Ataque'
                   : 'Jogo Direto'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Formação</span>
                <span className="font-medium">{club.tactical.formation}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};