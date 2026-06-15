interface Props {
  hasSave: boolean;
  savedClubName?: string;
  savedSeason?: number;
  savedPosition?: number;
  savedWins?: number;
  savedPoints?: number;
  seed: string;
  onNewGame: () => void;
  onContinue: () => void;
}

export const SplashScreen = ({
  hasSave, savedClubName, savedSeason, savedPosition,
  savedWins, savedPoints, seed, onNewGame, onContinue,
}: Props) => (
  <div style={{ minHeight: '100vh', background: '#F2EDE4', display: 'flex', flexDirection: 'column' }}>

    {/* Header */}
    <header style={{ borderBottom: '1px solid #1A1A1A', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>
          CORNER
        </h1>
        <p style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '4px' }}>
          Simulador de Carreira · Brasileirão 2025
        </p>
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#9E9890' }}>
        SEED #{seed}
      </span>
    </header>

    {/* Main */}
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', maxWidth: '900px', width: '100%', alignItems: 'center' }}>

        {/* Hero */}
        <div>
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#E8432D', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '16px' }}>
            Nova temporada
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1.05, marginBottom: '16px' }}>
            Assuma<br />o comando.
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: '13px', color: '#6B6560', lineHeight: 1.7, marginBottom: '32px' }}>
            Escolha seu clube, monte sua equipe<br />e leve o time ao título.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onNewGame} style={{
              background: '#E8432D', color: 'white', border: 'none',
              padding: '12px 28px', fontFamily: 'system-ui', fontSize: '11px',
              fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
              NOVA CARREIRA →
            </button>
            {hasSave && (
              <button onClick={onContinue} style={{
                background: 'transparent', color: '#1A1A1A',
                border: '1px solid #1A1A1A', padding: '12px 28px',
                fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}>
                CONTINUAR
              </button>
            )}
          </div>
        </div>

        {/* Card save */}
        {hasSave && savedClubName ? (
          <div style={{ background: 'white', border: '1px solid #D6CFC4', padding: '28px' }}>
            <p style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Última carreira
            </p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>
              {savedClubName}
            </h3>
            <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginTop: '4px', marginBottom: '24px' }}>
              Série A · Temporada {savedSeason}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { value: `${savedPosition}º`, label: 'Posição' },
                { value: savedWins,           label: 'Vitórias' },
                { value: savedPoints,         label: 'Pontos'   },
              ].map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, color: '#E8432D' }}>
                    {value}
                  </div>
                  <div style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px solid #D6CFC4', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '180px' }}>
            <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#9E9890', textAlign: 'center', lineHeight: 1.7 }}>
              Nenhuma carreira salva.<br />Inicie uma nova para começar.
            </p>
          </div>
        )}
      </div>
    </main>

    {/* Footer */}
    <footer style={{ borderTop: '1px solid #D6CFC4', padding: '12px 48px', display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Corner · Brasileirão 2025
      </span>
      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#9E9890' }}>v1.0</span>
    </footer>
  </div>
);