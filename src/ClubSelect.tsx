import type { Club } from './clubs';
import type { Division } from './types';

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$${(n / 1_000_000).toFixed(0)}M` : `R$${(n / 1_000).toFixed(0)}K`;

interface Props {
  clubs: Club[];
  hasSave: boolean;
  selectedDivision: Division;
  onDivisionChange: (d: Division) => void;
  onSelect: (club: Club) => void;
  onContinue: () => void;
  onNewGame: () => void;
}

const DIVISIONS: { value: Division; label: string }[] = [
  { value: 'A', label: 'Série A' },
  { value: 'B', label: 'Série B' },
  { value: 'C', label: 'Série C' },
];

export const ClubSelect = ({
  clubs, hasSave, selectedDivision,
  onDivisionChange, onSelect, onContinue, onNewGame,
}: Props) => {
  const filtered = clubs.filter(c => c.division === selectedDivision);

  return (
    <div className="min-h-screen bg-[#F2EDE4] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1A1A1A] px-8 py-4 flex justify-between items-end">
        <div>
          <h1 className="font-display text-4xl font-black text-[#1A1A1A] leading-none">
            CORNER
          </h1>
          <p className="text-xs text-[#6B6560] tracking-widest uppercase mt-1">
            Simulador de Carreira · Brasileirão
          </p>
        </div>
        {hasSave && (
          <div className="flex gap-2">
            <button onClick={onContinue}
              className="bg-[#E8432D] text-white font-bold text-xs px-5 py-2.5 tracking-widest uppercase cursor-pointer hover:bg-[#D63520] transition-colors">
              CONTINUAR →
            </button>
            <button onClick={onNewGame}
              className="border border-[#1A1A1A] text-[#1A1A1A] font-bold text-xs px-4 py-2.5 tracking-widest uppercase cursor-pointer hover:bg-[#EDE8DF] transition-colors">
              NOVO JOGO
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 px-8 py-8 max-w-4xl mx-auto w-full">
        {/* Título */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-black text-[#1A1A1A]">
            Escolha seu clube
          </h2>
          <p className="text-sm text-[#6B6560] mt-1">
            Selecione a divisão e o time que você vai comandar
          </p>
        </div>

        {/* Seletor de divisão */}
        <div className="flex gap-0 border border-[#1A1A1A] w-fit mb-6 overflow-hidden">
          {DIVISIONS.map(({ value, label }) => (
            <button key={value} onClick={() => onDivisionChange(value)}
              className={`px-6 py-2 text-xs font-bold tracking-widest uppercase
                border-r border-[#1A1A1A] last:border-0 cursor-pointer transition-colors
                ${selectedDivision === value
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white text-[#1A1A1A] hover:bg-[#EDE8DF]'
                }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Grid de clubes */}
        <div className="border border-[#D6CFC4] bg-white overflow-hidden">
          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-[1fr_5rem_6rem_6rem] px-4 py-2 bg-[#1A1A1A] text-white text-2xs font-bold tracking-widest uppercase">
            <span>Clube</span>
            <span className="text-center">Rep.</span>
            <span className="text-center">Caixa</span>
            <span className="text-center">Estádio</span>
          </div>

          {filtered.map((club, i) => (
            <button key={club.id} onClick={() => onSelect(club)}
              className={`w-full grid grid-cols-[1fr_5rem_6rem_6rem] px-4 py-3
                border-b border-[#D6CFC4] last:border-0 text-left
                cursor-pointer transition-colors hover:bg-[#F2EDE4] group
                ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}`}>
              <span className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#E8432D] transition-colors">
                {club.name}
              </span>
              <span className="text-center text-sm font-bold text-[#1A1A1A]">
                {club.reputation}
              </span>
              <span className="text-center text-sm text-[#6B6560]">
                {fmt(club.balance)}
              </span>
              <span className="text-center text-sm text-[#6B6560]">
                {(club.stadiumCapacity / 1000).toFixed(0)}k
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D6CFC4] px-8 py-3 flex justify-between items-center">
        <span className="text-2xs text-[#9E9890] tracking-widest uppercase">
          Corner · Brasileirão 2025
        </span>
        <span className="text-2xs text-[#9E9890]">
          {clubs.length} clubes · {selectedDivision === 'A' ? '20' : selectedDivision === 'B' ? '20' : '20'} na Série {selectedDivision}
        </span>
      </footer>
    </div>
  );
};