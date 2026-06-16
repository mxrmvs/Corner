import type { Club } from './clubs';
import type { Player } from './types';
import type { Calendar } from './calendar';
import type { ClubStanding } from './leagueTypes';
import { effectiveRating } from './types';
import { FieldView } from './FieldView';

type Screen = 'central' | 'lineup' | 'table' | 'history' | 'market' | 'club';

const NAV: { label: string; value: Screen }[] = [
  { label: 'CENTRAL',   value: 'central'  },
  { label: 'ESCALAÇÃO', value: 'lineup'   },
  { label: 'TABELA',    value: 'table'    },
  { label: 'HISTÓRICO', value: 'history'  },
  { label: 'MERCADO',   value: 'market'   },
  { label: 'CLUBE',     value: 'club'     },
];

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$${(n / 1_000_000).toFixed(0)}M` : `R$${(n / 1_000).toFixed(0)}K`;

interface NewsItem {
  id: string;
  text: string;
  type: 'win' | 'loss' | 'draw' | 'info' | 'alert';
}

interface Props {
  screen: Screen;
  onScreenChange: (s: Screen) => void;
  userClub: Club;
  players: Player[];
  calendar: Calendar | null;
  standings: ClubStanding[];
  season: number;
  seed: string;
  saved: boolean;
  news: NewsItem[];
  oppClub: Club | undefined;
  oppOvr: number;
  myOvr: number;
  isHome: boolean;
  currentRound: number;
  totalRounds: number;
  onSimulateRound: () => void;
  onNewSeason: () => void;
  onExit: () => void;
  children: React.ReactNode;
}

const DOT: Record<string, string> = {
  win: '#3B6D11', loss: '#A32D2D', draw: '#854F0B', info: '#9E9890', alert: '#A32D2D',
};

export const Dashboard = ({
  screen, onScreenChange, userClub, players, standings,
  season, seed, saved, news, oppClub, oppOvr, myOvr,
  isHome, currentRound, totalRounds,
  onSimulateRound, onNewSeason, onExit, children,
}: Props) => {
  const myPlayers    = players.filter(p => p.clubId === userClub.id).sort((a, b) => effectiveRating(b) - effectiveRating(a));
  const userStanding = standings.find(s => s.clubId === userClub.id);
  const userPos      = standings.findIndex(s => s.clubId === userClub.id) + 1;
  const topStandings = standings.slice(0, 8);
  const finished     = currentRound > totalRounds;

  // Resumo de condição do elenco
  const lowStamina = myPlayers.filter(p => p.condition.stamina < 40).length;
  const lowMorale  = myPlayers.filter(p => p.condition.morale  < 40).length;
  const lowFitness = myPlayers.filter(p => p.condition.matchFitness < 40).length;

  return (
    <div style={{ minHeight: '100vh', background: '#F2EDE4', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui' }}>

      {/* BARRA DE CONTEXTO */}
      <div style={{ background: '#1A1A1A', padding: '6px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 900, color: 'white' }}>CORNER</span>
          <span style={{ fontSize: '10px', color: '#6B6560', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {userClub.name} · Série {userClub.division} · T{season}
            {saved && <span style={{ color: '#4A7C59', marginLeft: '8px' }}>✓</span>}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {userStanding && (
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { l: 'POS', v: `${userPos}º`        },
                { l: 'PTS', v: userStanding.points   },
                { l: 'V',   v: userStanding.wins     },
                { l: 'R$',  v: fmt(userClub.balance) },
              ].map(({ l, v }) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#6B6560', letterSpacing: '0.06em' }}>{l}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{v}</div>
                </div>
              ))}
            </div>
          )}
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#E8432D' }}>#{seed}</span>
        </div>
      </div>

      {/* NAV */}
      <div style={{ background: 'white', borderBottom: '1px solid #D6CFC4', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex' }}>
          {NAV.map(({ label, value }) => (
            <button key={value} onClick={() => onScreenChange(value)}
              style={{
                padding: '10px 14px', border: 'none',
                borderBottom: screen === value ? '2px solid #E8432D' : '2px solid transparent',
                background: 'transparent', cursor: 'pointer', marginBottom: '-1px',
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                color: screen === value ? '#E8432D' : '#6B6560',
              }}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={onExit} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 700, color: '#9E9890', letterSpacing: '0.1em' }}>
          SAIR
        </button>
      </div>

      {/* CENTRAL */}
      {screen === 'central' ? (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr 260px', overflow: 'hidden' }}>

          {/* COL 1 — CAMPO */}
          <div style={{ background: 'white', borderRight: '1px solid #D6CFC4', display: 'flex', flexDirection: 'column', padding: '12px' }}>
            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890', marginBottom: '6px' }}>
              {userClub.name} · {userClub.tactical.formation}
            </p>
            <FieldView players={myPlayers} formation={userClub.tactical.formation} />

            {/* Resumo condição */}
            <div style={{ marginTop: '10px', background: '#F2EDE4', padding: '10px', border: '1px solid #D6CFC4' }}>
              <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890', marginBottom: '6px' }}>
                Condição do elenco
              </p>
              {lowStamina === 0 && lowMorale === 0 && lowFitness === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B6D11' }} />
                  <span style={{ fontSize: '10px', color: '#3B6D11', fontWeight: 700 }}>Elenco em boa forma</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {lowStamina > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8432D' }} />
                      <span style={{ fontSize: '10px', color: '#A32D2D' }}>{lowStamina} cansado{lowStamina > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {lowMorale > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C' }} />
                      <span style={{ fontSize: '10px', color: '#854F0B' }}>{lowMorale} com moral baixo</span>
                    </div>
                  )}
                  {lowFitness > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6B6560' }} />
                      <span style={{ fontSize: '10px', color: '#6B6560' }}>{lowFitness} sem ritmo</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* COL 2 — CENTRO */}
          <div style={{ overflowY: 'auto', padding: '16px 20px', background: '#F2EDE4' }}>

            {/* Próxima partida */}
            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9E9890', marginBottom: '8px' }}>
              {finished ? 'Temporada encerrada' : `Próxima Partida · Rodada ${currentRound} de ${totalRounds}`}
            </p>

            {!finished && oppClub ? (
              <div style={{ background: 'white', border: '1px solid #D6CFC4', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 1fr', padding: '14px 16px', alignItems: 'center', borderBottom: '1px solid #D6CFC4' }}>
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 900, color: '#E8432D', lineHeight: 1 }}>{userClub.name}</div>
                    <div style={{ fontSize: '10px', color: '#9E9890', marginTop: '2px' }}>OVR {myOvr} · {isHome ? 'Casa' : 'Fora'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 900, color: '#1A1A1A' }}>VS</div>
                    <div style={{ fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px',
                      color: myOvr > oppOvr ? '#3B6D11' : myOvr < oppOvr ? '#A32D2D' : '#854F0B' }}>
                      {myOvr > oppOvr ? 'Favorito' : myOvr < oppOvr ? 'Azarão' : 'Igual'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1 }}>{oppClub.name}</div>
                    <div style={{ fontSize: '10px', color: '#9E9890', marginTop: '2px' }}>OVR {oppOvr} · {!isHome ? 'Casa' : 'Fora'}</div>
                  </div>
                </div>
                <button onClick={onSimulateRound}
                  style={{ width: '100%', background: '#1A1A1A', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  ▶ SIMULAR RODADA COMPLETA
                </button>
              </div>
            ) : finished ? (
              <div style={{ background: 'white', border: '1px solid #D6CFC4', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 900, color: '#1A1A1A', marginBottom: '10px' }}>Temporada {season} encerrada</div>
                <button onClick={onNewSeason}
                  style={{ background: '#E8432D', color: 'white', border: 'none', padding: '9px 20px', cursor: 'pointer', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  NOVA TEMPORADA →
                </button>
              </div>
            ) : null}

            {/* Tabela compacta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9E9890', margin: 0 }}>Classificação</p>
              <button onClick={() => onScreenChange('table')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '9px', fontWeight: 700, color: '#E8432D', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                VER COMPLETA →
              </button>
            </div>
            <div style={{ background: 'white', border: '1px solid #D6CFC4', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 32px 32px 32px 40px', padding: '5px 10px', background: '#1A1A1A' }}>
                {['#','Clube','PJ','V','D','PTS'].map((h, i) => (
                  <span key={h} style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', color: '#9E9890', textAlign: i > 0 ? 'center' : 'left' }}>{h}</span>
                ))}
              </div>
              {topStandings.map((st, i) => {
                const isUser = st.clubId === userClub.id;
                return (
                  <div key={st.clubId} style={{
                    display: 'grid', gridTemplateColumns: '20px 1fr 32px 32px 32px 40px',
                    padding: '6px 10px', borderBottom: i < 7 ? '1px solid #F0EDE8' : 'none',
                    background: isUser ? '#FEF0ED' : i % 2 === 0 ? 'white' : '#FAFAF8',
                    borderLeft: isUser ? '2px solid #E8432D' : '2px solid transparent',
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: i < 6 ? '#3B6D11' : '#9E9890', textAlign: 'center' }}>{i+1}</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '11px', fontWeight: 700, color: isUser ? '#E8432D' : '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {st.clubName}
                    </span>
                    {[st.played, st.wins, st.losses, st.points].map((n, idx) => (
                      <span key={idx} style={{ fontSize: '10px', color: '#6B6560', textAlign: 'center' }}>{n}</span>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Feed */}
            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9E9890', marginBottom: '6px' }}>
              Eventos · T{season}
            </p>
            <div style={{ background: 'white', border: '1px solid #D6CFC4' }}>
              {news.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#9E9890' }}>Simule rodadas para ver eventos.</p>
                </div>
              ) : (
                news.slice(0, 20).map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: '8px', padding: '7px 12px', borderBottom: '1px solid #F5F2EE', alignItems: 'flex-start' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: DOT[n.type], marginTop: '5px', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: '#1A1A1A', lineHeight: 1.5 }}>{n.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COL 3 — INFO CLUBE */}
          <div style={{ background: 'white', borderLeft: '1px solid #D6CFC4', overflowY: 'auto', padding: '16px' }}>
            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890', marginBottom: '8px' }}>Seu clube</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1.1, marginBottom: '2px' }}>{userClub.name}</h2>
            <p style={{ fontSize: '11px', color: '#6B6560', marginBottom: '14px' }}>Série {userClub.division} · T{season}</p>

            <div style={{ border: '1px solid #D6CFC4', marginBottom: '12px' }}>
              {[
                { label: 'Caixa',     value: fmt(userClub.balance)                          },
                { label: 'Reputação', value: userClub.reputation                            },
                { label: 'Formação',  value: userClub.tactical.formation                   },
                { label: 'Estádio',   value: `${(userClub.stadiumCapacity/1000).toFixed(0)}k` },
              ].map(({ label, value }, i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderBottom: i < 3 ? '1px solid #F0EDE8' : 'none', background: i % 2 === 0 ? 'white' : '#FAFAF8' }}>
                  <span style={{ fontSize: '11px', color: '#6B6560' }}>{label}</span>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>{value}</span>
                </div>
              ))}
            </div>

            {userStanding && (
              <div style={{ border: '1px solid #D6CFC4', marginBottom: '12px' }}>
                <div style={{ background: '#1A1A1A', padding: '5px 12px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>Campeonato</span>
                </div>
                {[
                  { label: 'Posição', value: `${userPos}º`, green: userPos <= 6 },
                  { label: 'Pontos',  value: userStanding.points, green: false },
                  { label: 'Vitórias',value: userStanding.wins, green: false },
                  { label: 'Saldo',   value: userStanding.goalsFor - userStanding.goalsAgainst, green: false },
                ].map(({ label, value, green }, i) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderBottom: i < 3 ? '1px solid #F0EDE8' : 'none', background: i % 2 === 0 ? 'white' : '#FAFAF8' }}>
                    <span style={{ fontSize: '11px', color: '#6B6560' }}>{label}</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: 700, color: green ? '#3B6D11' : '#1A1A1A' }}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Ações rápidas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button onClick={() => onScreenChange('lineup')} style={{ padding: '8px', border: '1px solid #D6CFC4', background: 'white', cursor: 'pointer', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A1A1A' }}>
                ESCALAÇÃO →
              </button>
              <button onClick={() => onScreenChange('club')} style={{ padding: '8px', border: '1px solid #D6CFC4', background: 'white', cursor: 'pointer', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A1A1A' }}>
                TREINO →
              </button>
              <button onClick={() => onScreenChange('market')} style={{ padding: '8px', border: '1px solid #D6CFC4', background: 'white', cursor: 'pointer', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A1A1A' }}>
                MERCADO →
              </button>
            </div>
          </div>
        </div>

      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#F2EDE4' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};