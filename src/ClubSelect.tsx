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
  const [hovered, setHovered] = useState<Club | null>(null);
  const filtered = clubs.filter(c => c.division === selectedDivision);
  const preview  = hovered ?? filtered[0] ?? null;

  return (
    <div style={{ minHeight: '100vh', background: '#F2EDE4', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui' }}>
      <header style={{ borderBottom: '1px solid #1A1A1A', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>CORNER</h1>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>Escolha seu clube</span>
            <span style={{ fontSize: '11px', color: '#9E9890', marginLeft: '8px' }}>Brasileirão 2025</span>
          </div>
        </div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: '#6B6560', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ← VOLTAR
        </button>
      </header>

      <div style={{ borderBottom: '1px solid #D6CFC4', padding: '0 32px', background: 'white', display: 'flex' }}>
        {DIVISIONS.map(({ value, label }) => (
          <button key={value} onClick={() => { onDivisionChange(value); setHovered(null); }}
            style={{
              padding: '10px 20px', border: 'none',
              borderBottom: selectedDivision === value ? '2px solid #E8432D' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer', marginBottom: '-1px',
              fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: selectedDivision === value ? '#E8432D' : '#6B6560',
            }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 260px', overflow: 'hidden' }}>
        <div style={{ overflowY: 'auto', background: 'white', borderRight: '1px solid #D6CFC4' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 52px 72px 80px 100px', padding: '6px 20px', background: '#F2EDE4', borderBottom: '1px solid #D6CFC4', position: 'sticky', top: 0 }}>
            {['#', 'Clube', 'Rep.', 'Caixa', 'Estádio', 'Estilo'].map((h, i) => (
              <span key={h} style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890', textAlign: i > 1 ? 'center' : 'left' }}>{h}</span>
            ))}
          </div>
          {filtered.map((club, i) => {
            const isHov = hovered?.id === club.id;
            return (
              <div key={club.id}
                onClick={() => onSelect(club)}
                onMouseEnter={() => setHovered(club)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr 52px 72px 80px 100px',
                  padding: '9px 20px', cursor: 'pointer',
                  background: isHov ? '#FEF0ED' : i % 2 === 0 ? 'white' : '#FAFAF8',
                  borderBottom: '1px solid #F0EDE8',
                  borderLeft: isHov ? '3px solid #E8432D' : '3px solid transparent',
                }}>
                <span style={{ fontSize: '11px', color: '#9E9890', fontWeight: 600 }}>{i + 1}</span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: isHov ? '#E8432D' : '#1A1A1A' }}>{club.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', textAlign: 'center' }}>{club.reputation}</span>
                <span style={{ fontSize: '12px', color: '#6B6560', textAlign: 'center' }}>{fmt(club.balance)}</span>
                <span style={{ fontSize: '12px', color: '#6B6560', textAlign: 'center' }}>{(club.stadiumCapacity / 1000).toFixed(0)}k</span>
                <span style={{ fontSize: '11px', color: '#6B6560', textAlign: 'center' }}>{STYLE_LABEL[club.tactical.style]}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#F2EDE4', padding: '24px 20px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #D6CFC4' }}>
          {preview && (
            <>
              <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9E9890', marginBottom: '8px' }}>
                {hovered ? 'Clique para jogar' : 'Primeiro da lista'}
              </p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1.1, marginBottom: '4px' }}>{preview.name}</h2>
              <p style={{ fontSize: '11px', color: '#6B6560', marginBottom: '20px' }}>Série {preview.division} · {STYLE_LABEL[preview.tactical.style]}</p>
              <div style={{ background: 'white', border: '1px solid #D6CFC4', marginBottom: '16px' }}>
                {[
                  { label: 'Reputação', value: preview.reputation,                                    red: true  },
                  { label: 'Caixa',     value: fmt(preview.balance),                                  red: false },
                  { label: 'Formação',  value: preview.tactical.formation,                            red: false },
                  { label: 'Estádio',   value: `${(preview.stadiumCapacity / 1000).toFixed(0)}k lug.`, red: false },
                  { label: 'Estilo',    value: STYLE_LABEL[preview.tactical.style],                   red: false },
                ].map(({ label, value, red }, i) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: i < 4 ? '1px solid #F0EDE8' : 'none', background: i % 2 === 0 ? 'white' : '#FAFAF8' }}>
                    <span style={{ fontSize: '11px', color: '#6B6560' }}>{label}</span>
                    <span style={{ fontFamily: red ? 'Georgia, serif' : 'system-ui', fontSize: red ? '16px' : '12px', fontWeight: 700, color: red ? '#E8432D' : '#1A1A1A' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button onClick={() => onSelect(preview)} style={{ width: '100%', background: '#E8432D', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
                  INICIAR CARREIRA →
                </button>
                <p style={{ fontSize: '10px', color: '#9E9890', textAlign: 'center', marginTop: '8px' }}>ou clique em qualquer clube da lista</p>
              </div>
            </>
          )}
        </div>
      </div>

      <footer style={{ borderTop: '1px solid #D6CFC4', padding: '8px 32px', display: 'flex', justifyContent: 'space-between', background: 'white' }}>
        <span style={{ fontSize: '10px', color: '#9E9890', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{filtered.length} clubes · Série {selectedDivision}</span>
        <span style={{ fontSize: '10px', color: '#9E9890' }}>Séries B e C em breve</span>
      </footer>
    </div>
  );
};
