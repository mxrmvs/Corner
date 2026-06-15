import { useState } from 'react';
import type { Club } from './clubs';
import type { Division } from './types';

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$${(n / 1_000_000).toFixed(0)}M` : `R$${(n / 1_000).toFixed(0)}K`;

const STYLE_LABEL: Record<string, string> = {
  TIKI_TAKA: 'Tiki-Taka',
  COUNTER:   'Contra-Ataque',
  DIRECT:    'Jogo Direto',
};

const DIVISIONS: { value: Division; label: string }[] = [
  { value: 'A', label: 'Série A' },
  { value: 'B', label: 'Série B' },
  { value: 'C', label: 'Série C' },
];

interface Props {
  clubs: Club[];
  selectedDivision: Division;
  onDivisionChange: (d: Division) => void;
  onSelect: (club: Club) => void;
  onBack: () => void;
}

export const ClubSelect = ({ clubs, selectedDivision, onDivisionChange, onSelect, onBack }: Props) => {
  const [selected, setSelected] = useState<Club | null>(null);
  const filtered = clubs.filter(c => c.division === selectedDivision);

  return (
    <div style={{ minHeight: '100vh', background: '#F2EDE4', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1A1A1A', padding: '10px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1A1A1A' }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', color: '#9E9890',
          fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
        }}>← VOLTAR</button>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 900, color: 'white', margin: 0 }}>
          CORNER
        </h1>

        {/* Divisões */}
        <div style={{ display: 'flex', border: '1px solid #444', overflow: 'hidden' }}>
          {DIVISIONS.map(({ value, label }) => (
            <button key={value} onClick={() => { onDivisionChange(value); setSelected(null); }}
              style={{
                background: selectedDivision === value ? '#E8432D' : 'transparent',
                color: selectedDivision === value ? 'white' : '#9E9890',
                border: 'none',
                borderLeft: value !== 'A' ? '1px solid #444' : 'none',
                padding: '8px 20px',
                fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}>
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', overflow: 'hidden' }}>

        {/* Lista */}
        <div style={{ overflowY: 'auto', borderRight: '1px solid #D6CFC4' }}>
          {/* Cabeçalho */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px 100px',
            padding: '8px 20px', background: '#1A1A1A', position: 'sticky', top: 0, zIndex: 10,
          }}>
            {['Clube', 'Rep.', 'Caixa', 'Estádio', 'Estilo'].map((h, i) => (
              <div key={h} style={{
                fontFamily: 'system-ui', fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890',
                textAlign: i > 0 ? 'center' : 'left',
              }}>{h}</div>
            ))}
          </div>

          {filtered.map((club, i) => {
            const isSel = selected?.id === club.id;
            return (
              <button key={club.id} onClick={() => setSelected(club)}
                style={{
                  width: '100%', display: 'grid',
                  gridTemplateColumns: '1fr 60px 80px 80px 100px',
                  padding: '11px 20px', cursor: 'pointer', textAlign: 'left',
                  background: isSel ? '#FEF0ED' : i % 2 === 0 ? 'white' : '#FAF8F5',
                  borderBottom: '1px solid #E8E4DC', border: 'none',
                  borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: '#E8E4DC',
                }}>
                <span style={{
                  fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '13px',
                  color: isSel ? '#E8432D' : '#1A1A1A',
                }}>{club.name}</span>
                <span style={{ fontFamily: 'system-ui', fontSize: '13px', fontWeight: 700, color: '#1A1A1A', textAlign: 'center' }}>{club.reputation}</span>
                <span style={{ fontFamily: 'system-ui', fontSize: '12px', color: '#6B6560', textAlign: 'center' }}>{fmt(club.balance)}</span>
                <span style={{ fontFamily: 'system-ui', fontSize: '12px', color: '#6B6560', textAlign: 'center' }}>{(club.stadiumCapacity / 1000).toFixed(0)}k</span>
                <span style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', textAlign: 'center' }}>{STYLE_LABEL[club.tactical.style]}</span>
              </button>
            );
          })}
        </div>

        {/* Preview */}
        <div style={{ background: 'white', padding: '24px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #D6CFC4' }}>
          {selected ? (
            <>
              <p style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Clube selecionado
              </p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1, margin: 0 }}>
                {selected.name}
              </h2>
              <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginTop: '4px', marginBottom: '20px' }}>
                Série {selected.division} · {STYLE_LABEL[selected.tactical.style]}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {[
                  { label: 'Reputação', value: selected.reputation,                               red: true  },
                  { label: 'Caixa',     value: fmt(selected.balance),                             red: false },
                  { label: 'Formação',  value: selected.tactical.formation,                       red: false },
                  { label: 'Estádio',   value: `${(selected.stadiumCapacity / 1000).toFixed(0)}k`, red: false },
                ].map(({ label, value, red }) => (
                  <div key={label} style={{ background: '#F2EDE4', padding: '12px' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 900, color: red ? '#E8432D' : '#1A1A1A' }}>
                      {value}
                    </div>
                    <div style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => onSelect(selected)} style={{
                  width: '100%', background: '#E8432D', color: 'white', border: 'none',
                  padding: '14px', fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                }}>
                  INICIAR CARREIRA →
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#9E9890', textAlign: 'center', lineHeight: 1.7 }}>
                Selecione um clube<br />para ver os detalhes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #D6CFC4', padding: '10px 32px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {filtered.length} clubes na Série {selectedDivision}
        </span>
      </footer>
    </div>
  );
};