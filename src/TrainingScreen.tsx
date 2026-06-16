import { useState } from 'react';
import type { Player } from './types';
import type { TrainingFocus } from './training';

interface Props {
  players: Player[];
  onApply: (focusMap: Record<string, TrainingFocus>) => void;
}

const FOCUS_OPTIONS: { value: TrainingFocus; label: string; desc: string; risk: string }[] = [
  { value: 'REST',         label: 'Descanso',    desc: 'Recupera stamina, perde ritmo',         risk: 'Sem risco' },
  { value: 'TECHNICAL',   label: 'Técnico',     desc: 'Melhora ritmo e moral levemente',        risk: 'Baixo risco' },
  { value: 'PHYSICAL',    label: 'Físico',      desc: 'Melhora físico, gasta stamina',          risk: 'Médio risco' },
  { value: 'MOTIVATIONAL',label: 'Motivacional',desc: 'Aumenta moral bastante',                 risk: 'Baixo risco' },
  { value: 'INTENSITY',   label: 'Intensidade', desc: 'Máximo ganho de ritmo, alto desgaste',   risk: 'ALTO RISCO' },
];

const POS: Record<string, string> = { GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA' };

const Bar = ({ value, color }: { value: number; color: string }) => (
  <div style={{ height: '3px', background: '#E8E4DC', flex: 1 }}>
    <div style={{ height: '3px', width: `${value}%`, background: color }} />
  </div>
);

export const TrainingScreen = ({ players, onApply }: Props) => {
  const [globalFocus, setGlobalFocus] = useState<TrainingFocus>('TECHNICAL');

  const handleApply = () => {
    const focusMap: Record<string, TrainingFocus> = {};
    players.forEach(p => { focusMap[p.id] = globalFocus; });
    onApply(focusMap);
  };

  const selectedOption = FOCUS_OPTIONS.find(f => f.value === globalFocus)!;
  const isHighRisk = globalFocus === 'INTENSITY';

  return (
    <div style={{ maxWidth: '680px' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', marginBottom: '4px' }}>
        Central de Treino
      </h2>
      <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginBottom: '20px' }}>
        Defina o foco semanal para todo o elenco
      </p>

      {/* Seleção de foco */}
      <div style={{ background: 'white', border: '1px solid #D6CFC4', padding: '16px', marginBottom: '16px' }}>
        <p style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6560', marginBottom: '12px' }}>
          Foco da semana
        </p>
        <div style={{ display: 'flex', gap: '0', border: '1px solid #D6CFC4', overflow: 'hidden', marginBottom: '12px' }}>
          {FOCUS_OPTIONS.map(({ value, label }) => (
            <button key={value} onClick={() => setGlobalFocus(value)}
              style={{
                flex: 1, padding: '8px 4px', border: 'none', cursor: 'pointer',
                background: globalFocus === value ? '#1A1A1A' : 'white',
                color: globalFocus === value ? 'white' : '#6B6560',
                fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                borderRight: '1px solid #D6CFC4',
              }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560' }}>
            {selectedOption.desc}
          </p>
          <span style={{
            fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
            padding: '3px 10px',
            background: isHighRisk ? '#FCEBEB' : '#EAF3DE',
            color: isHighRisk ? '#A32D2D' : '#3B6D11',
          }}>
            {selectedOption.risk}
          </span>
        </div>
      </div>

      {/* Lista de jogadores */}
      <div style={{ background: 'white', border: '1px solid #D6CFC4', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ background: '#1A1A1A', padding: '8px 16px', display: 'grid', gridTemplateColumns: '32px 1fr 80px 120px' }}>
          {['OVR', 'Jogador', 'Pos', 'Condição'].map((h, i) => (
            <div key={h} style={{ fontFamily: 'system-ui', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890', textAlign: i > 1 ? 'center' : 'left' }}>{h}</div>
          ))}
        </div>
        {players.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 80px 120px',
            padding: '10px 16px', borderBottom: '1px solid #E8E4DC',
            background: i % 2 === 0 ? 'white' : '#FAF8F5', alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 900, color: p.currentRating >= 80 ? '#E8432D' : '#1A1A1A' }}>
              {p.currentRating}
            </span>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>{p.name}</div>
              <div style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890' }}>{p.age} anos</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#6B6560' }}>{POS[p.position]}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontFamily: 'system-ui', fontSize: '9px', color: '#9E9890', width: '24px' }}>STA</span>
                <Bar value={p.condition.stamina} color="#4A7C59" />
                <span style={{ fontFamily: 'system-ui', fontSize: '9px', color: '#6B6560', width: '20px', textAlign: 'right' }}>{p.condition.stamina}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontFamily: 'system-ui', fontSize: '9px', color: '#9E9890', width: '24px' }}>RIT</span>
                <Bar value={p.condition.matchFitness} color="#C9A84C" />
                <span style={{ fontFamily: 'system-ui', fontSize: '9px', color: '#6B6560', width: '20px', textAlign: 'right' }}>{p.condition.matchFitness}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontFamily: 'system-ui', fontSize: '9px', color: '#9E9890', width: '24px' }}>MOR</span>
                <Bar value={p.condition.morale} color="#E8432D" />
                <span style={{ fontFamily: 'system-ui', fontSize: '9px', color: '#6B6560', width: '20px', textAlign: 'right' }}>{p.condition.morale}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão aplicar */}
      <button onClick={handleApply} style={{
        width: '100%', padding: '14px',
        background: isHighRisk ? '#E8432D' : '#1A1A1A',
        color: 'white', border: 'none', cursor: 'pointer',
        fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        {isHighRisk ? '⚠ APLICAR TREINO INTENSIVO' : 'APLICAR TREINO →'}
      </button>
    </div>
  );
};