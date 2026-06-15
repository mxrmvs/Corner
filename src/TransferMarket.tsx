import { useState } from 'react';
import type { Player } from './types';
import type { Club } from './clubs';

const fmt = (n: number) =>
  n >= 1_000_000
    ? `R$ ${(n / 1_000_000).toFixed(1)}M`
    : `R$ ${(n / 1_000).toFixed(0)}K`;

const POSITION_LABEL: Record<string, string> = {
  GK: 'GOL', DEF: 'ZAG', MID: 'MEI', ATT: 'ATA',
};

const ratingColor = (v: number) => {
  if (v >= 85) return 'text-[#2DFFA8]';
  if (v >= 75) return 'text-[#38BDF8]';
  if (v >= 65) return 'text-[#FBBF24]';
  return 'text-[#8B97A3]';
};

interface Props {
  allPlayers: Player[];
  userClub: Club;
  onBuy: (player: Player) => void;
  onSell: (player: Player) => void;
}

export const TransferMarket = ({ allPlayers, userClub, onBuy, onSell }: Props) => {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [msg, setMsg] = useState('');

  const available = allPlayers.filter(p => p.clubId === '');
  const mySquad   = allPlayers.filter(p => p.clubId === userClub.id);

  const handleBuy = (p: Player) => {
    if (userClub.balance < p.marketValue) {
      setMsg(`❌ Saldo insuficiente. Faltam ${fmt(p.marketValue - userClub.balance)}.`);
      return;
    }
    onBuy(p);
    setMsg(`✅ ${p.name} contratado por ${fmt(p.marketValue)}!`);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSell = (p: Player) => {
    onSell(p);
    setMsg(`✅ ${p.name} vendido por ${fmt(p.marketValue)}!`);
    setTimeout(() => setMsg(''), 3000);
  };

  const list = tab === 'buy' ? available : mySquad;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Mercado de Transferências</h2>
          <p className="text-xs text-[#8B97A3] mt-0.5">
            Caixa disponível: <span className="text-[#2DFFA8] font-bold">{fmt(userClub.balance)}</span>
          </p>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-[rgba(45,255,168,0.1)] text-[#2DFFA8]' : 'bg-[rgba(251,92,107,0.1)] text-[#FB5C6B]'}`}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(['buy', 'sell'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer
              ${tab === t
                ? 'bg-[#2DFFA8] text-[#0B0F14]'
                : 'bg-white/[0.06] text-[#8B97A3] hover:bg-white/10'
              }`}>
            {t === 'buy' ? `🛒 Contratar (${available.length})` : `💰 Vender (${mySquad.length})`}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl overflow-hidden">
        {list.length === 0 && (
          <div className="px-4 py-8 text-center text-[#8B97A3] text-sm">
            Nenhum jogador disponível.
          </div>
        )}
        {list.map((p, i) => (
          <div key={p.id}
            className={`flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors ${i === 0 ? '' : ''}`}>
            {/* Rating */}
            <div className={`text-2xl font-black tabular-nums w-10 text-center ${ratingColor(p.currentRating)}`}>
              {p.currentRating}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#E6EDF3] truncate">{p.name}</span>
                <span className="text-xs bg-white/[0.06] text-[#8B97A3] px-2 py-0.5 rounded-md font-bold">
                  {POSITION_LABEL[p.position]}
                </span>
              </div>
              <div className="text-xs text-[#8B97A3] mt-0.5">
                {p.age} anos · {fmt(p.salary)}/sem · Valor: {fmt(p.marketValue)}
              </div>
            </div>

            {/* Botão */}
            {tab === 'buy' ? (
              <button onClick={() => handleBuy(p)}
                className="bg-[#2DFFA8] text-[#0B0F14] font-black px-4 py-1.5 rounded-full text-xs hover:brightness-110 transition-all cursor-pointer whitespace-nowrap">
                Contratar
              </button>
            ) : (
              <button onClick={() => handleSell(p)}
                className="bg-[rgba(251,92,107,0.15)] text-[#FB5C6B] ring-1 ring-[#FB5C6B]/30 font-bold px-4 py-1.5 rounded-full text-xs hover:bg-[rgba(251,92,107,0.25)] transition-all cursor-pointer whitespace-nowrap">
                Vender
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};