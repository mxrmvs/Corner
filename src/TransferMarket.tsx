import type { Player } from './types';
import type { Club } from './clubs';
import { effectiveRating } from './types';

interface Props {
  allPlayers: Player[];
  allClubs: Club[];
  userClub: Club;
  onBuy: (p: Player) => void;
  onSell: (p: Player) => void;
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `R$${(n / 1_000_000).toFixed(1)}M` : `R$${(n / 1_000).toFixed(0)}K`;

const POS: Record<string, string> = { GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA' };

export const TransferMarket = ({ allPlayers, allClubs, userClub, onBuy, onSell }: Props) => {
  const available = allPlayers.filter(p => p.clubId === '' || (p.clubId !== userClub.id && allClubs.find(c => c.id === p.clubId)));
  const mySquad   = allPlayers.filter(p => p.clubId === userClub.id);

  const getClubName = (clubId: string) => {
    if (!clubId) return 'Livre no mercado';
    const club = allClubs.find(c => c.id === clubId);
    return club ? club.name : 'Livre no mercado';
  };

  const PlayerRow = ({ p, action, label, disabled, color }: {
    p: Player; action: () => void; label: string; disabled: boolean; color: string;
  }) => {
    const eff = effectiveRating(p);
    const clubName = getClubName(p.clubId);
    const isFree   = !p.clubId;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 16px', borderBottom: '1px solid #F0EDE8' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 900, width: '28px', color: eff >= 80 ? '#E8432D' : '#1A1A1A', flexShrink: 0 }}>{eff}</span>
        <span style={{ fontSize: '9px', color: '#9E9890', width: '24px', flexShrink: 0 }}>{POS[p.position]}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '1px', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', color: '#9E9890' }}>{p.age}a</span>
            <span style={{ fontSize: '9px', color: isFree ? '#3B6D11' : '#6B6560', fontWeight: isFree ? 700 : 400 }}>
              {isFree ? '✓ Livre' : clubName}
            </span>
            <span style={{ fontSize: '9px', color: '#9E9890' }}>· {fmt(p.marketValue)}</span>
          </div>
        </div>
        <button onClick={action} disabled={disabled} style={{
          background: disabled ? '#F2EDE4' : color, color: disabled ? '#9E9890' : 'white',
          border: 'none', padding: '5px 10px', cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'system-ui', fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>{label}</button>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>Mercado</h2>
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginTop: '3px' }}>
            Caixa: <strong style={{ color: '#1A1A1A' }}>{fmt(userClub.balance)}</strong>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Disponíveis */}
        <div>
          <div style={{ background: '#1A1A1A', padding: '7px 16px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>
              Disponíveis ({available.length})
            </span>
          </div>
          <div style={{ background: 'white', border: '1px solid #D6CFC4', borderTop: 'none', maxHeight: '500px', overflowY: 'auto' }}>
            {available.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#9E9890' }}>Nenhum jogador disponível</p>
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
          <div style={{ background: '#1A1A1A', padding: '7px 16px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9E9890' }}>
              Seu elenco ({mySquad.length})
            </span>
          </div>
          <div style={{ background: 'white', border: '1px solid #D6CFC4', borderTop: 'none', maxHeight: '500px', overflowY: 'auto' }}>
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