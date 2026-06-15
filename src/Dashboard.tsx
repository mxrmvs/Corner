import type { Club } from './clubs';
import type { Player } from './types';
import type { Calendar } from './calendar';
import type { ClubStanding } from './leagueTypes';
import { effectiveRating } from './types';

type Screen = 'squad' | 'lineup' | 'table' | 'history' | 'market' | 'training' | 'club';

const NAV: { label: string; value: Screen }[] = [
  { label: 'ELENCO',    value: 'squad'    },
  { label: 'ESCALAÇÃO', value: 'lineup'   },
  { label: 'TABELA',    value: 'table'    },
  { label: 'HISTÓRICO', value: 'history'  },
  { label: 'MERCADO',   value: 'market'   },
  { label: 'TREINO',    value: 'training' },
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

const POS: Record<string, string> = { GK: 'GK', DEF: 'CB', MID: 'CM', ATT: 'ST' };

const newsColor = (type: NewsItem['type']) => ({
  win:   { dot: '#4A7C59', text: '#1A1A1A' },
  loss:  { dot: '#E8432D', text: '#1A1A1A' },
  draw:  { dot: '#C9A84C', text: '#1A1A1A' },
  info:  { dot: '#6B6560', text: '#6B6560' },
  alert: { dot: '#E8432D', text: '#E8432D' },
}[type]);

export const Dashboard = ({
  screen, onScreenChange, userClub, players, standings,
  season, seed, saved, news, oppClub, oppOvr, myOvr,
  isHome, currentRound, totalRounds,
  onSimulateRound, onNewSeason, onExit, children,
}: Props) => {
  const myPlayers = players
    .filter(p => p.clubId === userClub.id)
    .sort((a, b) => effectiveRating(b) - effectiveRating(a))
    .slice(0, 11);

  const userStanding = standings.find(s => s.clubId === userClub.id);
  const topStandings = standings.slice(0, 6);
  const finished = currentRound > totalRounds;

  return (
    <div className="min-h-screen bg-[#F2EDE4] flex flex-col font-sans">

      {/* HEADER */}
      <header className="flex justify-between items-center px-5 py-2.5 bg-[#1A1A1A]"
        style={{ borderBottom: '1px solid #333' }}>
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: 'Georgia, serif' }}
            className="text-lg font-black text-white tracking-tight">CORNER</span>
          <span className="text-[10px] text-[#6B6560] tracking-[0.08em] uppercase">
            {userClub.name} · Série {userClub.division} · T{season}
            {saved && <span className="ml-2 text-[#4A7C59]">✓ salvo</span>}
          </span>
          <span className="font-mono text-[10px] text-[#E8432D]">#{seed}</span>
        </div>
        <div className="flex items-center gap-1">
          {NAV.map(({ label, value }) => (
            <button key={value} onClick={() => onScreenChange(value)}
              className="px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] cursor-pointer transition-colors"
              style={{
                background: screen === value ? '#E8432D' : 'transparent',
                color: screen === value ? 'white' : '#6B6560',
                border: 'none',
              }}>
              {label}
            </button>
          ))}
          <button onClick={onExit}
            className="ml-2 px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] text-[#E8432D] cursor-pointer"
            style={{ background: 'transparent', border: 'none' }}>
            SAIR
          </button>
        </div>
      </header>

      {/* CORPO: 3 colunas no dashboard, full-width nas outras telas */}
      {screen === 'squad' ? (
        <div className="flex-1 grid overflow-hidden"
          style={{ gridTemplateColumns: '260px 1fr 200px' }}>

          {/* COL 1 — Elenco */}
          <div className="overflow-y-auto bg-white" style={{ borderRight: '1px solid #D6CFC4' }}>
            <div className="px-3 py-2 sticky top-0 bg-white z-10"
              style={{ borderBottom: '1px solid #D6CFC4' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A]">
                  Elenco
                </span>
                <span className="text-[10px] text-[#9E9890]">{myPlayers.length} jogadores</span>
              </div>
              {/* Legenda condição */}
              <div className="flex gap-3">
                {[['#4A7C59','STA'],['#C9A84C','RIT'],['#E8432D','MOR']].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1">
                    <div className="w-4 h-1.5 rounded-full" style={{ background: c }} />
                    <span className="text-[9px] text-[#9E9890]">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {myPlayers.map((p, i) => {
              const eff = effectiveRating(p);
              return (
                <div key={p.id} className="flex items-center gap-2 px-3 py-2"
                  style={{
                    borderBottom: '1px solid #F5F2EE',
                    background: i % 2 === 0 ? 'white' : '#FAF8F5',
                  }}>
                  <span className="text-[9px] text-[#9E9890] w-5 text-right">{i + 1}</span>
                  <span className="text-[10px] text-[#9E9890] w-6">{POS[p.position]}</span>
                  <span style={{ fontFamily: 'Georgia, serif' }}
                    className="flex-1 text-[12px] font-bold text-[#1A1A1A] truncate">{p.name}</span>
                  <div className="flex flex-col gap-0.5 w-10">
                    {[
                      [p.condition.stamina, '#4A7C59'],
                      [p.condition.matchFitness, '#C9A84C'],
                      [p.condition.morale, '#E8432D'],
                    ].map(([val, color], idx) => (
                      <div key={idx} className="w-full rounded-full overflow-hidden"
                        style={{ height: '2px', background: '#E8E4DC' }}>
                        <div style={{ width: `${val}%`, height: '2px', background: color as string }} />
                      </div>
                    ))}
                  </div>
                  <span style={{ fontFamily: 'Georgia, serif' }}
                    className={`text-base font-black w-7 text-right ${eff >= 85 ? 'text-[#E8432D]' : 'text-[#1A1A1A]'}`}>
                    {eff}
                  </span>
                </div>
              );
            })}
          </div>

          {/* COL 2 — Centro */}
          <div className="overflow-y-auto p-5 bg-[#F2EDE4]">
            {/* Próxima partida */}
            <p className="text-[10px] text-[#9E9890] tracking-[0.12em] uppercase mb-3">
              {finished ? 'Temporada encerrada' : `Próxima Partida · Rodada ${currentRound} de ${totalRounds}`}
            </p>

            {!finished && oppClub && (
              <div className="bg-white p-5 mb-4" style={{ border: '1px solid #D6CFC4' }}>
                <div className="grid gap-3 mb-4 items-center"
                  style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif' }}
                      className="text-xl font-black text-[#E8432D]">{userClub.name}</div>
                    <div className="text-[10px] text-[#9E9890] font-sans mt-1">
                      OVR {myOvr} · {isHome ? 'Casa' : 'Fora'}
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <div style={{ fontFamily: 'Georgia, serif' }}
                      className="text-2xl font-black text-[#1A1A1A]">VS</div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.08em] mt-1"
                      style={{ color: myOvr > oppOvr ? '#4A7C59' : myOvr < oppOvr ? '#E8432D' : '#C9A84C' }}>
                      {myOvr > oppOvr ? 'Favorito' : myOvr < oppOvr ? 'Azarão' : 'Equilibrado'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontFamily: 'Georgia, serif' }}
                      className="text-xl font-black text-[#1A1A1A]">{oppClub.name}</div>
                    <div className="text-[10px] text-[#9E9890] font-sans mt-1">
                      OVR {oppOvr} · {!isHome ? 'Casa' : 'Fora'}
                    </div>
                  </div>
                </div>
                <button onClick={onSimulateRound}
                  className="w-full bg-[#1A1A1A] text-white font-bold text-[11px] tracking-[0.12em] uppercase py-3 cursor-pointer hover:bg-[#333] transition-colors">
                  ▶ SIMULAR RODADA COMPLETA
                </button>
              </div>
            )}

            {finished && (
              <div className="bg-white p-5 mb-4 text-center" style={{ border: '1px solid #D6CFC4' }}>
                <div style={{ fontFamily: 'Georgia, serif' }}
                  className="text-2xl font-black text-[#1A1A1A] mb-2">Temporada encerrada</div>
                <button onClick={onNewSeason}
                  className="bg-[#E8432D] text-white font-bold text-[11px] tracking-[0.12em] uppercase px-6 py-3 cursor-pointer hover:bg-[#D63520] transition-colors">
                  INICIAR NOVA TEMPORADA →
                </button>
              </div>
            )}

            {/* Mini tabela */}
            <p className="text-[10px] text-[#9E9890] tracking-[0.12em] uppercase mb-2">
              Classificação · Top 6
            </p>
            <div className="bg-white mb-4" style={{ border: '1px solid #D6CFC4' }}>
              <div className="grid px-3 py-1.5 bg-[#1A1A1A]"
                style={{ gridTemplateColumns: '20px 1fr 28px 28px 28px 36px' }}>
                {['#', 'Clube', 'PJ', 'V', 'D', 'PTS'].map((h, i) => (
                  <div key={h} className="text-[9px] font-bold tracking-[0.08em] text-[#9E9890]"
                    style={{ textAlign: i > 0 ? 'center' : 'left' }}>{h}</div>
                ))}
              </div>
              {topStandings.map((s, i) => {
                const isUser = s.clubId === userClub.id;
                return (
                  <div key={s.clubId} className="grid px-3 py-2"
                    style={{
                      gridTemplateColumns: '20px 1fr 28px 28px 28px 36px',
                      borderBottom: '1px solid #F5F2EE',
                      background: isUser ? '#FEF0ED' : i % 2 === 0 ? 'white' : '#FAF8F5',
                    }}>
                    <div className="text-[11px] font-bold text-[#E8432D] text-center">{i + 1}</div>
                    <div style={{ fontFamily: 'Georgia, serif' }}
                      className={`text-[12px] font-bold truncate ${isUser ? 'text-[#E8432D]' : 'text-[#1A1A1A]'}`}>
                      {s.clubName}
                    </div>
                    {[s.played, s.wins, s.losses, s.points].map((n, idx) => (
                      <div key={idx} className="text-[11px] text-[#6B6560] text-center">{n}</div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Feed de notícias */}
            <p className="text-[10px] text-[#9E9890] tracking-[0.12em] uppercase mb-2">
              Feed · Temporada {season}
            </p>
            <div className="bg-white" style={{ border: '1px solid #D6CFC4' }}>
              {news.length === 0 ? (
                <div className="px-4 py-6 text-center text-[11px] text-[#9E9890]">
                  Nenhuma notícia ainda. Simule rodadas para ver eventos.
                </div>
              ) : (
                news.slice(0, 12).map((n) => {
                  const c = newsColor(n.type);
                  return (
                    <div key={n.id} className="flex items-start gap-3 px-3 py-2.5"
                      style={{ borderBottom: '1px solid #F5F2EE' }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ background: c.dot }} />
                      <span className="text-[11px] leading-relaxed" style={{ color: c.text }}>
                        {n.text}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COL 3 — Info do clube */}
          <div className="bg-white overflow-y-auto p-4" style={{ borderLeft: '1px solid #D6CFC4' }}>
            <p className="text-[10px] text-[#9E9890] tracking-[0.1em] uppercase mb-2">Seu clube</p>
            <div style={{ fontFamily: 'Georgia, serif' }}
              className="text-2xl font-black text-[#1A1A1A] leading-none mb-1">{userClub.name}</div>
            <p className="text-[11px] text-[#6B6560] mb-4">
              Série {userClub.division} · Temporada {season}
            </p>

            <div className="flex flex-col gap-0" style={{ border: '1px solid #D6CFC4' }}>
              {[
                { label: 'Caixa', value: fmt(userClub.balance) },
                { label: 'Reputação', value: userClub.reputation },
                { label: 'Formação', value: userClub.tactical.formation },
                { label: 'Estádio', value: `${(userClub.stadiumCapacity / 1000).toFixed(0)}k` },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex justify-between items-center px-3 py-2.5"
                  style={{ borderBottom: i < 3 ? '1px solid #F5F2EE' : 'none' }}>
                  <span className="text-[11px] text-[#6B6560]">{label}</span>
                  <span style={{ fontFamily: 'Georgia, serif' }}
                    className="text-[13px] font-bold text-[#1A1A1A]">{value}</span>
                </div>
              ))}
            </div>

            {userStanding && (
              <div className="mt-4" style={{ border: '1px solid #D6CFC4' }}>
                <div className="px-3 py-2 bg-[#1A1A1A]">
                  <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#9E9890]">
                    Campeonato
                  </span>
                </div>
                {[
                  { label: 'Posição', value: `${standings.findIndex(s => s.clubId === userClub.id) + 1}º` },
                  { label: 'Pontos', value: userStanding.points },
                  { label: 'Vitórias', value: userStanding.wins },
                  { label: 'Saldo', value: userStanding.goalsFor - userStanding.goalsAgainst },
                ].map(({ label, value }, i) => (
                  <div key={label} className="flex justify-between items-center px-3 py-2"
                    style={{ borderBottom: i < 3 ? '1px solid #F5F2EE' : 'none' }}>
                    <span className="text-[11px] text-[#6B6560]">{label}</span>
                    <span style={{ fontFamily: 'Georgia, serif' }}
                      className="text-[13px] font-bold text-[#1A1A1A]">{value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3" style={{ borderTop: '1px solid #D6CFC4' }}>
              <div className="flex gap-3 mb-2">
                {[['#4A7C59','Stamina'],['#C9A84C','Ritmo'],['#E8432D','Moral']].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1">
                    <div className="w-4 h-1.5 rounded-full" style={{ background: c }} />
                    <span className="text-[9px] text-[#9E9890]">{l}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-[#9E9890] leading-relaxed">
                As barras mostram a condição atual de cada jogador. Jogadores cansados rendem menos em campo.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Telas secundárias — full width */
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-6">
            {children}
          </div>
        </div>
      )}

      {/* TAB BAR mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#F2EDE4] z-10"
        style={{ borderTop: '1px solid #1A1A1A' }}>
        <div className="grid grid-cols-4">
          {NAV.slice(0, 4).map(({ label, value }) => (
            <button key={value} onClick={() => onScreenChange(value)}
              className="flex flex-col items-center py-2.5 gap-0.5 text-[9px] font-bold uppercase tracking-widest cursor-pointer"
              style={{ color: screen === value ? '#E8432D' : '#6B6560', background: 'none', border: 'none' }}>
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3" style={{ borderTop: '1px solid #D6CFC4' }}>
          {NAV.slice(4).map(({ label, value }) => (
            <button key={value} onClick={() => onScreenChange(value)}
              className="flex flex-col items-center py-2 gap-0.5 text-[9px] font-bold uppercase tracking-widest cursor-pointer"
              style={{ color: screen === value ? '#E8432D' : '#6B6560', background: 'none', border: 'none' }}>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};