import type { Match } from './calendar';
import type { Club } from './clubs';

interface Props {
  matches: Match[];
  clubs: Club[];
  userClubId: string;
}

const clubName = (clubs: Club[], id: string) => clubs.find(c => c.id === id)?.name ?? id;

const getResult = (m: Match, uid: string): 'V' | 'E' | 'D' => {
  const isHome = m.homeClubId === uid;
  const ug = isHome ? m.homeGoals! : m.awayGoals!;
  const og = isHome ? m.awayGoals! : m.homeGoals!;
  return ug > og ? 'V' : ug < og ? 'D' : 'E';
};

const RESULT_STYLE: Record<string, { bg: string; color: string }> = {
  V: { bg: '#EAF3DE', color: '#3B6D11' },
  E: { bg: '#FAEEDA', color: '#854F0B' },
  D: { bg: '#FCEBEB', color: '#A32D2D' },
};

export const MatchHistory = ({ matches, clubs, userClubId }: Props) => {
  const played = matches
    .filter(m => m.played && (m.homeClubId === userClubId || m.awayClubId === userClubId))
    .reverse();

  const wins   = played.filter(m => getResult(m, userClubId) === 'V').length;
  const draws  = played.filter(m => getResult(m, userClubId) === 'E').length;
  const losses = played.filter(m => getResult(m, userClubId) === 'D').length;
  const gf = played.reduce((s, m) => s + (m.homeClubId === userClubId ? m.homeGoals! : m.awayGoals!), 0);
  const ga = played.reduce((s, m) => s + (m.homeClubId === userClubId ? m.awayGoals! : m.homeGoals!), 0);

  return (
    <div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', marginBottom: '16px' }}>
        Histórico de Partidas
      </h2>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {[
          { label: 'Jogos',   value: played.length, color: '#1A1A1A' },
          { label: 'Vitórias', value: wins,   color: '#3B6D11' },
          { label: 'Empates',  value: draws,  color: '#854F0B' },
          { label: 'Derrotas', value: losses, color: '#A32D2D' },
          { label: 'Saldo',    value: gf - ga > 0 ? `+${gf - ga}` : gf - ga, color: gf >= ga ? '#3B6D11' : '#A32D2D' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'white', border: '1px solid #D6CFC4', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 900, color }}>{value}</div>
            <div style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {played.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #D6CFC4', padding: '48px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'system-ui', fontSize: '13px', color: '#9E9890' }}>
            Nenhuma partida disputada ainda.<br />Simule rodadas na aba Tabela.
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid #D6CFC4', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 1fr 48px', padding: '8px 16px', background: '#1A1A1A' }}>
            {['Rod.', 'Casa', 'Placar', 'Fora', 'Res.'].map((h, i) => (
              <div key={h} style={{ fontFamily: 'system-ui', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890', textAlign: i === 2 || i === 4 ? 'center' : i === 3 ? 'left' : 'left' }}>{h}</div>
            ))}
          </div>
          {played.map((m, i) => {
            const result = getResult(m, userClubId);
            const rs = RESULT_STYLE[result];
            const isHome = m.homeClubId === userClubId;
            return (
              <div key={m.id} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 80px 1fr 48px',
                padding: '10px 16px', borderBottom: '1px solid #E8E4DC',
                background: i % 2 === 0 ? 'white' : '#FAF8F5',
                alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#9E9890' }}>{m.round}</span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: isHome ? '#E8432D' : '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {clubName(clubs, m.homeClubId)}
                </span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 900, color: '#1A1A1A', textAlign: 'center' }}>
                  {m.homeGoals} — {m.awayGoals}
                </span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: !isHome ? '#E8432D' : '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {clubName(clubs, m.awayClubId)}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700, padding: '3px 8px', background: rs.bg, color: rs.color }}>
                    {result}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};