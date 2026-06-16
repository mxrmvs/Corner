import type { Club } from './clubs';

interface Props {
  club: Club;
  onUpdate: (club: Club) => void;
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$${(n / 1_000_000).toFixed(0)}M` : `R$${(n / 1_000).toFixed(0)}K`;

const FORMATIONS = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2'] as const;
const STYLE_LABEL: Record<string, string> = {
  TIKI_TAKA: 'Tiki-Taka', COUNTER: 'Contra-Ataque', DIRECT: 'Jogo Direto',
};

export const ClubScreen = ({ club, onUpdate }: Props) => (
  <div style={{ maxWidth: '680px' }}>
    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', marginBottom: '20px' }}>
      {club.name}
    </h2>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
      {/* Identidade */}
      <div style={{ background: 'white', border: '1px solid #D6CFC4', overflow: 'hidden' }}>
        <div style={{ background: '#1A1A1A', padding: '8px 16px' }}>
          <span style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>
            Identidade
          </span>
        </div>
        {[
          { label: 'Reputação',  value: club.reputation        },
          { label: 'Caixa',      value: fmt(club.balance)      },
          { label: 'Estádio',    value: `${(club.stadiumCapacity / 1000).toFixed(0)}k lugares` },
          { label: 'Divisão',    value: `Série ${club.division}` },
          { label: 'Estilo',     value: STYLE_LABEL[club.tactical.style] },
        ].map(({ label, value }, i) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 16px', borderBottom: '1px solid #E8E4DC',
            background: i % 2 === 0 ? 'white' : '#FAF8F5',
          }}>
            <span style={{ fontFamily: 'system-ui', fontSize: '12px', color: '#6B6560' }}>{label}</span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Formação */}
      <div style={{ background: 'white', border: '1px solid #D6CFC4', overflow: 'hidden' }}>
        <div style={{ background: '#1A1A1A', padding: '8px 16px' }}>
          <span style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>
            Formação
          </span>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginBottom: '12px' }}>
            Formação atual: <strong style={{ color: '#1A1A1A' }}>{club.tactical.formation}</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {FORMATIONS.map(f => (
              <button key={f} onClick={() => onUpdate({ ...club, tactical: { ...club.tactical, formation: f } })}
                style={{
                  padding: '10px 16px', border: '1px solid #D6CFC4', cursor: 'pointer', textAlign: 'left',
                  background: club.tactical.formation === f ? '#1A1A1A' : 'white',
                  color: club.tactical.formation === f ? 'white' : '#1A1A1A',
                  fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 700,
                }}>
                {f} {club.tactical.formation === f && '←'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);