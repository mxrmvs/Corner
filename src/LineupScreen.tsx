import { useState } from 'react';
import type { Player } from './types';
import { effectiveRating } from './types';

const POS_LABEL: Record<string, string> = {
  GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA',
};

interface Props {
  players: Player[];
  onConfirm: (lineup: Player[]) => void;
  onBack: () => void;
}

export const LineupScreen = ({ players, onConfirm, onBack }: Props) => {
  const [selected, setSelected] = useState<string[]>(() =>
    players.slice(0, 11).map(p => p.id)
  );

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(x => x !== id));
    } else if (selected.length < 11) {
      setSelected(prev => [...prev, id]);
    }
  };

  const selectedPlayers = selected.map(id => players.find(p => p.id === id)!).filter(Boolean);
  const posCounts = {
    GK:  selectedPlayers.filter(p => p.position === 'GK').length,
    DEF: selectedPlayers.filter(p => p.position === 'DEF').length,
    MID: selectedPlayers.filter(p => p.position === 'MID').length,
    ATT: selectedPlayers.filter(p => p.position === 'ATT').length,
  };
  const isValid = posCounts.GK >= 1 && posCounts.DEF >= 3 && posCounts.MID >= 2 && posCounts.ATT >= 1 && selected.length === 11;
  const avgRating = selectedPlayers.length
    ? Math.round(selectedPlayers.reduce((s, p) => s + effectiveRating(p), 0) / selectedPlayers.length)
    : 0;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>

      {/* Título */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>
            Escalação
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginTop: '4px' }}>
            Selecione exatamente 11 jogadores
          </p>
        </div>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
          color: '#6B6560', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>← VOLTAR</button>
      </div>

      {/* Status */}
      <div style={{ background: 'white', border: '1px solid #D6CFC4', padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'system-ui', fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>
            {selected.length}/11 selecionados
          </span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 900, color: avgRating >= 80 ? '#E8432D' : '#1A1A1A' }}>
            OVR {avgRating}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['GK','DEF','MID','ATT'] as const).map(pos => (
            <div key={pos} style={{
              padding: '4px 10px',
              background: posCounts[pos] > 0 ? '#1A1A1A' : '#F2EDE4',
              color: posCounts[pos] > 0 ? 'white' : '#9E9890',
              fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.08em',
            }}>
              {POS_LABEL[pos]}: {posCounts[pos]}
            </div>
          ))}
        </div>
        {!isValid && selected.length === 11 && (
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#E8432D', marginTop: '8px' }}>
            Mínimo: 1 GOL · 3 ZAG · 2 MEI · 1 ATA
          </p>
        )}
      </div>

      {/* Lista por posição */}
      {(['GK','DEF','MID','ATT'] as const).map(pos => {
        const group = players.filter(p => p.position === pos);
        if (!group.length) return null;
        return (
          <div key={pos} style={{ marginBottom: '8px' }}>
            <div style={{ background: '#F2EDE4', padding: '6px 16px', borderBottom: '1px solid #D6CFC4' }}>
              <span style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6560' }}>
                {POS_LABEL[pos]}
              </span>
            </div>
            <div style={{ background: 'white', border: '1px solid #D6CFC4', borderTop: 'none' }}>
              {group.map((p, i) => {
                const isSel = selected.includes(p.id);
                const eff = effectiveRating(p);
                return (
                  <button key={p.id} onClick={() => toggle(p.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 16px', cursor: 'pointer', textAlign: 'left',
                      background: isSel ? '#FEF0ED' : i % 2 === 0 ? 'white' : '#FAF8F5',
                      border: 'none', borderBottom: '1px solid #E8E4DC',
                    }}>
                    {/* Checkbox */}
                    <div style={{
                      width: '18px', height: '18px', border: `2px solid ${isSel ? '#E8432D' : '#D6CFC4'}`,
                      background: isSel ? '#E8432D' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {isSel && <span style={{ color: 'white', fontSize: '10px', fontWeight: 900 }}>✓</span>}
                    </div>

                    {/* Rating */}
                    <span style={{
                      fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 900, width: '32px',
                      color: eff >= 85 ? '#E8432D' : '#1A1A1A',
                    }}>{eff}</span>

                    {/* Nome */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700,
                        color: isSel ? '#E8432D' : '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{p.name}</div>
                      <div style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', marginTop: '1px' }}>
                        {p.age} anos · {p.foot}
                      </div>
                    </div>

                    {/* Atributos */}
                    <div style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', flexShrink: 0 }}>
                      ATA {p.attributes.attack} · DEF {p.attributes.defense}
                    </div>

                    {/* Condition bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '36px', flexShrink: 0 }}>
                      {[
                        [p.condition.stamina,      '#4A7C59'],
                        [p.condition.matchFitness, '#C9A84C'],
                        [p.condition.morale,       '#E8432D'],
                      ].map(([val, color], idx) => (
                        <div key={idx} style={{ height: '2px', background: '#E8E4DC' }}>
                          <div style={{ height: '2px', width: `${val}%`, background: color as string }} />
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Botão confirmar */}
      <div style={{ marginTop: '16px' }}>
        <button
          onClick={() => isValid && onConfirm(selectedPlayers)}
          disabled={!isValid}
          style={{
            width: '100%', padding: '14px',
            background: isValid ? '#E8432D' : '#D6CFC4',
            color: isValid ? 'white' : '#9E9890',
            border: 'none', cursor: isValid ? 'pointer' : 'not-allowed',
            fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
          {isValid ? 'CONFIRMAR ESCALAÇÃO →' : `Selecione mais ${11 - selected.length} jogador(es)`}
        </button>
      </div>
    </div>
  );
};