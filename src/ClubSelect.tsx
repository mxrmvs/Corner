import { useState } from 'react';
import type { Club } from './clubs';
import type { Division } from './types';

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$${(n / 1_000_000).toFixed(0)}M` : `R$${(n / 1_000).toFixed(0)}K`;

interface Props {
  clubs: Club[];
  selectedDivision: Division;
  onDivisionChange: (d: Division) => void;
  onSelect: (club: Club) => void;
  onBack: () => void;
}

const DIVISIONS: { value: Division; label: string }[] = [
  { value: 'A', label: 'Série A' },
  { value: 'B', label: 'Série B' },
  { value: 'C', label: 'Série C' },
];

const STYLE_LABEL: Record<string, string> = {
  TIKI_TAKA: 'Tiki-Taka',
  COUNTER:   'Contra-Ataque',
  DIRECT:    'Jogo Direto',
};

export const ClubSelect = ({
  clubs, selectedDivision, onDivisionChange, onSelect, onBack,
}: Props) => {
  const [selected, setSelected] = useState<Club | null>(null);
  const filtered = clubs.filter(c => c.division === selectedDivision);

  return (
    <div className="min-h-screen bg-[#F2EDE4] flex flex-col">
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1A1A1A' }}
        className="px-8 py-3 flex justify-between items-center">
        <button onClick={onBack}
          className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#6B6560] cursor-pointer hover:text-[#1A1A1A] transition-colors">
          ← VOLTAR
        </button>
        <h1 style={{ fontFamily: 'Georgia, serif' }}
          className="text-xl font-black text-[#1A1A1A]">CORNER</h1>
        {/* Seletor de divisão */}
        <div className="flex overflow-hidden" style={{ border: '1px solid #1A1A1A' }}>
          {DIVISIONS.map(({ value, label }) => (
            <button key={value} onClick={() => { onDivisionChange(value); setSelected(null); }}
              className="font-sans font-bold text-[10px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-colors"
              style={{
                background: selectedDivision === value ? '#1A1A1A' : 'white',
                color: selectedDivision === value ? 'white' : '#1A1A1A',
                borderLeft: value !== 'A' ? '1px solid #1A1A1A' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: '1fr 300px' }}>
        {/* Lista de clubes */}
        <div className="overflow-y-auto" style={{ borderRight: '1px solid #D6CFC4' }}>
          {/* Cabeçalho da tabela */}
          <div className="grid sticky top-0 z-10 px-4 py-2"
            style={{
              gridTemplateColumns: '1fr 60px 80px 80px 90px',
              background: '#1A1A1A',
            }}>
            {['Clube', 'Rep.', 'Caixa', 'Estádio', 'Estilo'].map((h, i) => (
              <div key={h} className="font-sans font-bold text-[9px] tracking-[0.1em] uppercase text-[#9E9890]"
                style={{ textAlign: i > 0 ? 'center' : 'left' }}>
                {h}
              </div>
            ))}
          </div>

          {filtered.map((club, i) => {
            const isSel = selected?.id === club.id;
            return (
              <button key={club.id} onClick={() => setSelected(club)}
                className="w-full grid px-4 py-3 cursor-pointer transition-colors text-left"
                style={{
                  gridTemplateColumns: '1fr 60px 80px 80px 90px',
                  background: isSel ? '#FEF0ED' : i % 2 === 0 ? 'white' : '#FAF8F5',
                  borderBottom: '1px solid #D6CFC4',
                }}>
                <span style={{ fontFamily: 'Georgia, serif' }}
                  className={`font-bold text-sm ${isSel ? 'text-[#E8432D]' : 'text-[#1A1A1A]'}`}>
                  {club.name}
                </span>
                <span className="font-sans font-bold text-sm text-[#1A1A1A] text-center">{club.reputation}</span>
                <span className="font-sans text-sm text-[#6B6560] text-center">{fmt(club.balance)}</span>
                <span className="font-sans text-sm text-[#6B6560] text-center">
                  {(club.stadiumCapacity / 1000).toFixed(0)}k
                </span>
                <span className="font-sans text-[11px] text-[#6B6560] text-center">
                  {STYLE_LABEL[club.tactical.style]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Preview */}
        <div className="bg-white p-6 flex flex-col" style={{ borderLeft: '1px solid #D6CFC4' }}>
          {selected ? (
            <>
              <p className="font-sans text-[10px] text-[#9E9890] tracking-[0.1em] uppercase mb-2">
                Clube selecionado
              </p>
              <h2 style={{ fontFamily: 'Georgia, serif' }}
                className="text-3xl font-black text-[#1A1A1A] leading-none">{selected.name}</h2>
              <p className="font-sans text-[11px] text-[#6B6560] mt-1 mb-6">
                Série {selected.division} · {STYLE_LABEL[selected.tactical.style]}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { label: 'Reputação', value: selected.reputation, red: true },
                  { label: 'Caixa', value: fmt(selected.balance), red: false },
                  { label: 'Formação', value: selected.tactical.formation, red: false },
                  { label: 'Estádio', value: `${(selected.stadiumCapacity / 1000).toFixed(0)}k`, red: false },
                ].map(({ label, value, red }) => (
                  <div key={label} className="p-3 bg-[#F2EDE4]">
                    <div style={{ fontFamily: 'Georgia, serif' }}
                      className={`text-xl font-black ${red ? 'text-[#E8432D]' : 'text-[#1A1A1A]'}`}>
                      {value}
                    </div>
                    <div className="font-sans text-[10px] text-[#9E9890] uppercase tracking-[0.08em] mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <button onClick={() => onSelect(selected)}
                  className="w-full bg-[#E8432D] text-white font-sans font-bold text-[11px] tracking-[0.12em] uppercase py-3 cursor-pointer hover:bg-[#D63520] transition-colors">
                  INICIAR CARREIRA →
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="font-sans text-[11px] text-[#9E9890] text-center leading-relaxed">
                Selecione um clube<br />para ver os detalhes
              </p>
            </div>
          )}
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #D6CFC4' }}
        className="px-8 py-3 flex justify-between items-center">
        <span className="font-sans text-[10px] text-[#9E9890] tracking-[0.1em] uppercase">
          {filtered.length} clubes na Série {selectedDivision}
        </span>
      </footer>
    </div>
  );
};