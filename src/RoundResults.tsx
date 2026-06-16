import type { Match } from './calendar';
import type { Club } from './clubs';

interface Props {
  matches: Match[];
  clubs: Club[];
  userClubId: string;
  round: number;
  onClose: () => void;
}

const clubName = (clubs: Club[], id: string) => clubs.find(c => c.id === id)?.name ?? id;

export const RoundResults = ({ matches, clubs, userClubId, round, onClose }: Props) => {
  const getResultStyle = (m: Match) => {
    if (!m.played) return {};
    const isHome = m.homeClubId === userClubId;
    const ug = isHome ? m.homeGoals! : m.awayGoals!;
    const og = isHome ? m.awayGoals! : m.homeGoals!;
    if (ug > og) return { borderLeft: '3px solid #4A7C59', background: '#F6FAF3' };
    if (ug < og) return { borderLeft: '3px solid #E8432D', background: '#FEF5F5' };
    return { borderLeft: '3px solid #C9A84C', background: '#FDFAF3' };
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid #1A1A1A' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #D6CFC4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>
              Rodada {round}
            </h2>
            <p style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', marginTop: '2px' }}>
              Resultados de todos os jogos
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui', fontSize: '18px', color: '#6B6560' }}>✕</button>
        </div>

        {/* Lista */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {matches.map(m => {
            const isUserMatch = m.homeClubId === userClubId || m.awayClubId === userClubId;
            const rs = isUserMatch ? getResultStyle(m) : {};
            return (
              <div key={m.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 1fr',
                padding: '10px 20px', borderBottom: '1px solid #E8E4DC',
                alignItems: 'center', ...rs,
              }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: m.homeClubId === userClubId ? '#E8432D' : '#1A1A1A', textAlign: 'right', paddingRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {clubName(clubs, m.homeClubId)}
                </span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 900, color: '#1A1A1A', textAlign: 'center' }}>
                  {m.played ? `${m.homeGoals} — ${m.awayGoals}` : 'vs'}
                </span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: m.awayClubId === userClubId ? '#E8432D' : '#1A1A1A', textAlign: 'left', paddingLeft: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {clubName(clubs, m.awayClubId)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #D6CFC4' }}>
          <button onClick={onClose} style={{
            width: '100%', background: '#1A1A1A', color: 'white', border: 'none',
            padding: '12px', cursor: 'pointer', fontFamily: 'system-ui', fontSize: '11px',
            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};