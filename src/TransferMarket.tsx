import type { Player } from './types';
import type { Club } from './clubs';
import { effectiveRating } from './types';

interface Props {
  allPlayers: Player[];
  userClub: Club;
  onBuy: (p: Player) => void;
  onSell: (p: Player) => void;
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$${(n / 1_000_000).toFixed(1)}M` : `R$${(n / 1_000).toFixed(0)}K`;

const POS: Record<string, string> = { GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA' };

export const TransferMarket = ({ allPlayers, userClub, onBuy, onSell }: Props) => {
  const available = allPlayers.filter(p => p.clubId === '');
  const mySquad   = allPlayers.filter(p => p.clubId === userClub.id);

  const PlayerRow = ({ p, action, label, disabled, color }: {
    p: Player; action: () => void; label: string; disabled: boolean; color: string;
  }) => {
    const eff = effectiveRating(p);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: '1px solid #E8E4DC' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 900, width: '32px', color: eff >= 80 ? '#E8432D' : '#1A1A1A' }}>{eff}</span>
        <span style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', width: '28px' }}>{POS[p.position]}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
          <div style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#9E9890', marginTop: '1px' }}>{p.age} anos · {fmt(p.marketValue)}</div>
        </div>
        <button onClick={action} disabled={disabled} style={{
          background: disabled ? '#F2EDE4' : color, color: disabled ? '#9E9890' : 'white',
          border: 'none', padding: '6px 14px', cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
        }}>{label}</button>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>
            Mercado de Transferências
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginTop: '4px' }}>
            Caixa disponível: <strong style={{ color: '#1A1A1A' }}>{fmt(userClub.balance)}</strong>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Disponíveis */}
        <div>
          <div style={{ background: '#1A1A1A', padding: '8px 16px', marginBottom: '0' }}>
            <span style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>
              Disponíveis ({available.length})
            </span>
          </div>
          <div style={{ background: 'white', border: '1px solid #D6CFC4', borderTop: 'none' }}>
            {available.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'system-ui', fontSize: '12px', color: '#9E9890' }}>Nenhum jogador disponível</p>
              </div>
            ) : (
              available.map(p => (
                <PlayerRow key={p.id} p={p} label="CONTRATAR"
                  action={() => onBuy(p)}
                  disabled={userClub.balance < p.marketValue}
                  color="#4A7C59" />
              ))
            )}
          </div>
        </div>

        {/* Seu elenco */}
        <div>
          <div style={{ background: '#1A1A1A', padding: '8px 16px' }}>
            <span style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>
              Seu elenco ({mySquad.length})
            </span>
          </div>
          <div style={{ background: 'white', border: '1px solid #D6CFC4', borderTop: 'none' }}>
            {mySquad.map(p => (
              <PlayerRow key={p.id} p={p} label="VENDER"
                action={() => onSell(p)}
                disabled={false}
                color="#E8432D" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};