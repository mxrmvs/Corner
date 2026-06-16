import type { ClubStanding } from './leagueTypes';

interface Props {
  standings: ClubStanding[];
  userClubId?: string;
  currentRound: number;
  totalRounds: number;
  onSimulateRound: () => void;
  onNewSeason: () => void;
  onShowResults: () => void;
}

export const LeagueTable = ({
  standings, userClubId = '', currentRound, totalRounds,
  onSimulateRound, onNewSeason, onShowResults,
}: Props) => {
  const finished = currentRound > totalRounds;
  const userPos = standings.findIndex(s => s.clubId === userClubId);

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>
            Brasileirão Série A
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginTop: '4px' }}>
            {finished ? 'Temporada encerrada' : `Rodada ${currentRound} de ${totalRounds}`}
            {userPos >= 0 && (
              <span style={{ marginLeft: '12px', color: '#E8432D', fontWeight: 700 }}>
                Você: {userPos + 1}º
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentRound > 1 && (
            <button onClick={onShowResults} style={{
              background: 'white', border: '1px solid #1A1A1A', padding: '8px 16px',
              fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', color: '#1A1A1A',
            }}>
              RODADA {currentRound - 1}
            </button>
          )}
          {!finished ? (
            <button onClick={onSimulateRound} style={{
              background: '#E8432D', border: 'none', padding: '8px 20px',
              fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', color: 'white',
            }}>
              ▶ SIMULAR RODADA {currentRound}
            </button>
          ) : (
            <button onClick={onNewSeason} style={{
              background: '#1A1A1A', border: 'none', padding: '8px 20px',
              fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', color: 'white',
            }}>
              NOVA TEMPORADA →
            </button>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {[
          { color: '#4A7C59', label: 'Libertadores (top 6)' },
          { color: '#E8432D', label: 'Rebaixamento (17-20)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
            <span style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#6B6560' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background: 'white', border: '1px solid #D6CFC4', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '32px 1fr 40px 36px 36px 36px 44px 44px 48px',
          padding: '8px 16px', background: '#1A1A1A',
        }}>
          {['#', 'Clube', 'PJ', 'V', 'E', 'D', 'SG', 'GP', 'PTS'].map((h, i) => (
            <div key={h} style={{
              fontFamily: 'system-ui', fontSize: '9px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890',
              textAlign: i > 1 ? 'center' : 'left',
            }}>{h}</div>
          ))}
        </div>

        {standings.map((s, i) => {
          const isUser = s.clubId === userClubId;
          const sg = s.goalsFor - s.goalsAgainst;
          const isLibertadores = i < 6;
          const isRebaixamento = i >= 16;
          const accentColor = isLibertadores ? '#4A7C59' : isRebaixamento ? '#E8432D' : '#9E9890';

          return (
            <div key={s.clubId} style={{
              display: 'grid', gridTemplateColumns: '32px 1fr 40px 36px 36px 36px 44px 44px 48px',
              padding: '10px 16px',
              background: isUser ? '#FEF0ED' : i % 2 === 0 ? 'white' : '#FAF8F5',
              borderBottom: '1px solid #E8E4DC',
              borderLeft: isUser ? '3px solid #E8432D' : '3px solid transparent',
            }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 900, color: accentColor }}>
                {i + 1}
              </span>
              <span style={{
                fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700,
                color: isUser ? '#E8432D' : '#1A1A1A',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {s.clubName}{isUser && ' ★'}
              </span>
              {[s.played, s.wins, s.draws, s.losses].map((n, idx) => (
                <span key={idx} style={{ fontFamily: 'system-ui', fontSize: '12px', color: '#6B6560', textAlign: 'center' }}>
                  {n}
                </span>
              ))}
              <span style={{
                fontFamily: 'system-ui', fontSize: '12px', fontWeight: 700, textAlign: 'center',
                color: sg > 0 ? '#4A7C59' : sg < 0 ? '#E8432D' : '#6B6560',
              }}>
                {sg > 0 ? `+${sg}` : sg}
              </span>
              <span style={{ fontFamily: 'system-ui', fontSize: '12px', color: '#6B6560', textAlign: 'center' }}>
                {s.goalsFor}
              </span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 900, color: '#1A1A1A', textAlign: 'center' }}>
                {s.points}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};