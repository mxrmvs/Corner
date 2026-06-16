import { useState } from 'react';
import type { Club } from './clubs';
import type { Player } from './types';
import { effectiveRating } from './types';
import { FieldView } from './FieldView';
import type { TrainingFocus } from './training';

interface Props {
  club: Club;
  players: Player[];
  onUpdate: (club: Club) => void;
  onApplyTraining: (focusMap: Record<string, TrainingFocus>) => void;
}

type SubScreen = 'escalacao' | 'treino' | 'config';

const FORMATIONS = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2'] as const;

const FOCUS_OPTIONS: { value: TrainingFocus; label: string; desc: string; risk: string; riskColor: string }[] = [
  { value: 'REST',         label: 'Descanso',     desc: 'Recupera stamina',          risk: 'Sem risco',  riskColor: '#3B6D11' },
  { value: 'TECHNICAL',   label: 'Técnico',      desc: 'Melhora ritmo e moral',     risk: 'Baixo',      riskColor: '#3B6D11' },
  { value: 'PHYSICAL',    label: 'Físico',       desc: 'Físico, gasta stamina',      risk: 'Médio',      riskColor: '#854F0B' },
  { value: 'MOTIVACIONAL',label: 'Motivacional', desc: 'Aumenta moral bastante',    risk: 'Baixo',      riskColor: '#3B6D11' },
  { value: 'INTENSITY',   label: 'Intensidade',  desc: 'Máximo ritmo, alto risco',   risk: 'ALTO',       riskColor: '#A32D2D' },
] as { value: TrainingFocus; label: string; desc: string; risk: string; riskColor: string }[];

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$${(n / 1_000_000).toFixed(0)}M` : `R$${(n / 1_000).toFixed(0)}K`;

const Bar = ({ value, color }: { value: number; color: string }) => (
  <div style={{ height: '3px', background: '#E8E4DC', flex: 1 }}>
    <div style={{ height: '3px', width: `${value}%`, background: color }} />
  </div>
);

export const ClubSelect = ({ club, players, onUpdate, onApplyTraining }: Props) => {
  const [sub, setSub]             = useState<SubScreen>('escalacao');
  const [globalFocus, setGlobal]  = useState<TrainingFocus>('TECHNICAL');
  const [individual, setIndividual] = useState(false);
  const [playerFocus, setPlayerFocus] = useState<Record<string, TrainingFocus>>({});

  const myPlayers = players
    .filter(p => p.clubId === club.id)
    .sort((a, b) => effectiveRating(b) - effectiveRating(a));

  const handleApplyTraining = () => {
    if (individual) {
      onApplyTraining(playerFocus);
    } else {
      const focusMap: Record<string, TrainingFocus> = {};
      myPlayers.forEach(p => { focusMap[p.id] = globalFocus; });
      onApplyTraining(focusMap);
    }
  };

  return (
    <div>
      {/* Sub-nav */}
      <div style={{ display: 'flex', borderBottom: '1px solid #D6CFC4', marginBottom: '20px', background: 'white', gap: 0 }}>
        {([
          { value: 'escalacao', label: 'Escalação' },
          { value: 'treino',    label: 'Treino'    },
          { value: 'config',    label: 'Configurações' },
        ] as { value: SubScreen; label: string }[]).map(({ value, label }) => (
          <button key={value} onClick={() => setSub(value)}
            style={{
              padding: '10px 20px', border: 'none', borderBottom: sub === value ? '2px solid #E8432D' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer', marginBottom: '-1px',
              fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: sub === value ? '#E8432D' : '#6B6560',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── ESCALAÇÃO ── */}
      {sub === 'escalacao' && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
          {/* Campo */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6560', marginBottom: '8px' }}>
              {club.tactical.formation} · {club.name}
            </p>
            <FieldView
              players={myPlayers}
              formation={club.tactical.formation}
            />
          </div>

          {/* Lista de jogadores por posição */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6560', marginBottom: '8px' }}>
              Elenco por posição
            </p>
            {(['GK','DEF','MID','ATT'] as const).map(pos => {
              const group = myPlayers.filter(p => p.position === pos);
              const labels: Record<string, string> = { GK: 'Goleiros', DEF: 'Defensores', MID: 'Meias', ATT: 'Atacantes' };
              return (
                <div key={pos} style={{ marginBottom: '12px' }}>
                  <div style={{ background: '#F2EDE4', padding: '5px 12px', borderBottom: '1px solid #D6CFC4' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6560' }}>{labels[pos]}</span>
                  </div>
                  <div style={{ background: 'white', border: '1px solid #D6CFC4', borderTop: 'none' }}>
                    {group.map((p, i) => {
                      const eff = effectiveRating(p);
                      return (
                        <div key={p.id} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px 12px', borderBottom: i < group.length - 1 ? '1px solid #F0EDE8' : 'none',
                          background: i % 2 === 0 ? 'white' : '#FAFAF8',
                        }}>
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 900, color: eff >= 85 ? '#E8432D' : '#1A1A1A', width: '28px' }}>{eff}</span>
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A', flex: 1 }}>{p.name}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '48px' }}>
                            {[[p.condition.stamina,'#4A7C59'],[p.condition.matchFitness,'#C9A84C'],[p.condition.morale,'#E8432D']].map(([v, c], idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <span style={{ fontSize: '8px', color: '#9E9890', width: '12px' }}>{['S','R','M'][idx]}</span>
                                <Bar value={v as number} color={c as string} />
                                <span style={{ fontSize: '8px', color: '#9E9890', width: '16px', textAlign: 'right' }}>{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TREINO ── */}
      {sub === 'treino' && (
        <div>
          {/* Toggle individual/global */}
          <div style={{ display: 'flex', gap: '0', border: '1px solid #D6CFC4', overflow: 'hidden', width: 'fit-content', marginBottom: '16px' }}>
            {[
              { value: false, label: 'Foco da Semana' },
              { value: true,  label: 'Individual'     },
            ].map(({ value, label }) => (
              <button key={String(value)} onClick={() => setIndividual(value)}
                style={{
                  padding: '8px 20px', border: 'none', cursor: 'pointer',
                  background: individual === value ? '#1A1A1A' : 'white',
                  color: individual === value ? 'white' : '#6B6560',
                  fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  borderRight: '1px solid #D6CFC4',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Foco global */}
          {!individual && (
            <div style={{ background: 'white', border: '1px solid #D6CFC4', padding: '16px', marginBottom: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6560', marginBottom: '12px' }}>
                Foco para todo o elenco
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {FOCUS_OPTIONS.map(({ value, label, desc, risk, riskColor }) => (
                  <button key={value} onClick={() => setGlobal(value)}
                    style={{
                      padding: '10px 8px', border: `1px solid ${globalFocus === value ? '#1A1A1A' : '#D6CFC4'}`,
                      background: globalFocus === value ? '#1A1A1A' : 'white',
                      cursor: 'pointer', textAlign: 'center',
                    }}>
                    <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700, color: globalFocus === value ? 'white' : '#1A1A1A', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '9px', color: globalFocus === value ? 'rgba(255,255,255,0.6)' : '#9E9890', marginBottom: '4px' }}>{desc}</div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: globalFocus === value ? 'white' : riskColor }}>{risk}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cards de jogadores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', marginBottom: '16px' }}>
            {myPlayers.map(p => {
              const eff   = effectiveRating(p);
              const focus = individual ? (playerFocus[p.id] ?? 'TECHNICAL') : globalFocus;
              const focusOpt = FOCUS_OPTIONS.find(f => f.value === focus);
              return (
                <div key={p.id} style={{ background: 'white', border: '1px solid #D6CFC4', padding: '12px' }}>
                  {/* Header card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: '9px', color: '#9E9890', marginTop: '1px' }}>{p.age} anos</div>
                    </div>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 900, color: eff >= 85 ? '#E8432D' : '#1A1A1A', marginLeft: '6px' }}>{eff}</span>
                  </div>

                  {/* Barras condição */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '10px' }}>
                    {[['STA', p.condition.stamina,'#4A7C59'],['RIT', p.condition.matchFitness,'#C9A84C'],['MOR', p.condition.morale,'#E8432D']].map(([l, v, c]) => (
                      <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '8px', color: '#9E9890', width: '20px' }}>{l}</span>
                        <div style={{ flex: 1, height: '3px', background: '#E8E4DC' }}>
                          <div style={{ height: '3px', width: `${v}%`, background: c as string }} />
                        </div>
                        <span style={{ fontSize: '8px', color: '#6B6560', width: '18px', textAlign: 'right' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Seletor individual (só no modo individual) */}
                  {individual && (
                    <select
                      value={playerFocus[p.id] ?? 'TECHNICAL'}
                      onChange={e => setPlayerFocus(prev => ({ ...prev, [p.id]: e.target.value as TrainingFocus }))}
                      style={{
                        width: '100%', padding: '4px 6px', border: '1px solid #D6CFC4',
                        fontFamily: 'system-ui', fontSize: '10px', color: '#1A1A1A',
                        background: 'white', cursor: 'pointer',
                      }}>
                      {FOCUS_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  )}

                  {/* Foco atual (modo global) */}
                  {!individual && focusOpt && (
                    <div style={{ background: '#F2EDE4', padding: '4px 6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#1A1A1A' }}>{focusOpt.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botão aplicar */}
          <button onClick={handleApplyTraining} style={{
            width: '100%', background: globalFocus === 'INTENSITY' && !individual ? '#E8432D' : '#1A1A1A',
            color: 'white', border: 'none', padding: '13px', cursor: 'pointer',
            fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {globalFocus === 'INTENSITY' && !individual ? '⚠ APLICAR TREINO INTENSIVO' : 'APLICAR TREINO →'}
          </button>
        </div>
      )}

      {/* ── CONFIG ── */}
      {sub === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '600px' }}>
          {/* Identidade */}
          <div style={{ background: 'white', border: '1px solid #D6CFC4', overflow: 'hidden' }}>
            <div style={{ background: '#1A1A1A', padding: '8px 16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>Identidade</span>
            </div>
            {[
              { label: 'Reputação', value: club.reputation                                    },
              { label: 'Caixa',     value: fmt(club.balance)                                  },
              { label: 'Estádio',   value: `${(club.stadiumCapacity/1000).toFixed(0)}k lugares` },
              { label: 'Divisão',   value: `Série ${club.division}`                           },
            ].map(({ label, value }, i) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', padding: '9px 16px',
                borderBottom: '1px solid #F0EDE8', background: i % 2 === 0 ? 'white' : '#FAFAF8',
              }}>
                <span style={{ fontSize: '12px', color: '#6B6560' }}>{label}</span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Formação */}
          <div style={{ background: 'white', border: '1px solid #D6CFC4', overflow: 'hidden' }}>
            <div style={{ background: '#1A1A1A', padding: '8px 16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>Formação</span>
            </div>
            <div style={{ padding: '12px' }}>
              <p style={{ fontSize: '11px', color: '#6B6560', marginBottom: '8px' }}>
                Atual: <strong style={{ color: '#1A1A1A' }}>{club.tactical.formation}</strong>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {FORMATIONS.map(f => (
                  <button key={f} onClick={() => onUpdate({ ...club, tactical: { ...club.tactical, formation: f } })}
                    style={{
                      padding: '9px 14px', border: '1px solid #D6CFC4', cursor: 'pointer', textAlign: 'left',
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
      )}
    </div>
  );
};