interface Props {
  news: string[];
  season: number;
  onClose: () => void;
}

export const SeasonReport = ({ news, season, onClose }: Props) => {
  const evolutions = news.filter(n => n.startsWith('📈'));
  const declines   = news.filter(n => n.startsWith('📉'));
  const retirements = news.filter(n => n.startsWith('👋'));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#131A22] border border-white/[0.08] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col gap-4">
        <div className="text-center">
          <div className="text-3xl mb-2">🏆</div>
          <h2 className="text-xl font-black">Fim da Temporada {season}</h2>
          <p className="text-xs text-[#8B97A3] mt-1">Evolução do elenco processada</p>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[rgba(45,255,168,0.06)] border border-[#2DFFA8]/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#2DFFA8]">{evolutions.length}</div>
            <div className="text-xs text-[#8B97A3] mt-0.5">Evoluíram</div>
          </div>
          <div className="bg-[rgba(251,92,107,0.06)] border border-[#FB5C6B]/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#FB5C6B]">{declines.length}</div>
            <div className="text-xs text-[#8B97A3] mt-0.5">Declinaram</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#8B97A3]">{retirements.length}</div>
            <div className="text-xs text-[#8B97A3] mt-0.5">Aposentados</div>
          </div>
        </div>

        {/* Lista de notícias */}
        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-64 pr-1">
          {[...retirements, ...declines, ...evolutions].map((n, i) => (
            <div key={i} className="text-xs px-3 py-2 rounded-lg bg-white/[0.02] text-[#8B97A3]">
              {n}
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="bg-[#2DFFA8] text-[#0B0F14] font-black py-3 rounded-full text-sm hover:brightness-110 transition-all cursor-pointer">
          Iniciar Temporada {season + 1}
        </button>
      </div>
    </div>
  );
};