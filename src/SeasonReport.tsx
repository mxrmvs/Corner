interface Props {
  news: string[];
  season: number;
  onClose: () => void;
}

export const SeasonReport = ({ news, season, onClose }: Props) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
    <div style={{ background: 'white', width: '100%', maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid #1A1A1A' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #D6CFC4' }}>
        <p style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#E8432D', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
          Fim de Temporada
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>
          Temporada {season} encerrada
        </h2>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '16px 24px' }}>
        <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
          Relatório do elenco
        </p>
        {news.map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #F2EDE4', alignItems: 'flex-start' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C', marginTop: '5px', flexShrink: 0 }} />
            <span style={{ fontFamily: 'system-ui', fontSize: '12px', color: '#1A1A1A', lineHeight: 1.5 }}>{n}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #D6CFC4' }}>
        <button onClick={onClose} style={{
          width: '100%', background: '#E8432D', color: 'white', border: 'none',
          padding: '13px', cursor: 'pointer', fontFamily: 'system-ui', fontSize: '11px',
          fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          INICIAR TEMPORADA {season + 1} →
        </button>
      </div>
    </div>
  </div>
);