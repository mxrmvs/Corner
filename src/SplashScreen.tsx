interface Props {
  hasSave: boolean;
  savedClubName?: string;
  savedSeason?: number;
  savedPosition?: number;
  savedWins?: number;
  savedPoints?: number;
  seed: string;
  onNewGame: () => void;
  onContinue: () => void;
}

export const SplashScreen = ({
  hasSave, savedClubName, savedSeason, savedPosition,
  savedWins, savedPoints, seed, onNewGame, onContinue,
}: Props) => (
  <div className="min-h-screen bg-[#F2EDE4] flex flex-col">
    <header style={{ borderBottom: '1px solid #1A1A1A' }}
      className="px-8 py-4 flex justify-between items-end">
      <div>
        <h1 style={{ fontFamily: 'Georgia, serif', letterSpacing: '-1px' }}
          className="text-5xl font-black text-[#1A1A1A] leading-none">CORNER</h1>
        <p className="text-[10px] text-[#9E9890] tracking-[0.15em] uppercase mt-1 font-sans">
          Simulador de Carreira · Brasileirão 2025
        </p>
      </div>
      <span className="font-mono text-[10px] text-[#9E9890]">SEED #{seed}</span>
    </header>

    <main className="flex-1 flex items-center px-8 py-12">
      <div className="grid grid-cols-2 gap-16 max-w-4xl w-full mx-auto items-center">

        {/* Hero */}
        <div>
          <p className="text-[11px] text-[#E8432D] tracking-[0.15em] uppercase font-sans font-bold mb-4">
            Nova temporada
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', lineHeight: 1 }}
            className="text-6xl font-black text-[#1A1A1A] mb-4">
            Assuma<br />o comando.
          </h2>
          <p className="text-sm text-[#6B6560] leading-relaxed mb-8 font-sans">
            Escolha seu clube, monte sua equipe<br />e leve o time ao título.
          </p>
          <div className="flex gap-3">
            <button onClick={onNewGame}
              className="bg-[#E8432D] text-white font-sans font-bold text-[11px] tracking-[0.1em] uppercase px-6 py-3 cursor-pointer hover:bg-[#D63520] transition-colors">
              NOVA CARREIRA →
            </button>
            {hasSave && (
              <button onClick={onContinue}
                className="bg-transparent text-[#1A1A1A] font-sans font-bold text-[11px] tracking-[0.1em] uppercase px-6 py-3 cursor-pointer hover:bg-[#EDE8DF] transition-colors"
                style={{ border: '1px solid #1A1A1A' }}>
                CONTINUAR
              </button>
            )}
          </div>
        </div>

        {/* Card última carreira */}
        {hasSave && savedClubName ? (
          <div className="bg-white p-6" style={{ border: '1px solid #D6CFC4' }}>
            <p className="text-[10px] text-[#9E9890] tracking-[0.1em] uppercase font-sans mb-3">
              Última carreira
            </p>
            <h3 style={{ fontFamily: 'Georgia, serif' }}
              className="text-3xl font-black text-[#1A1A1A]">{savedClubName}</h3>
            <p className="text-[11px] text-[#6B6560] font-sans mt-1 mb-5">
              Série A · Temporada {savedSeason}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: `${savedPosition}º`, label: 'Posição' },
                { value: savedWins, label: 'Vitórias' },
                { value: savedPoints, label: 'Pontos' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div style={{ fontFamily: 'Georgia, serif' }}
                    className="text-2xl font-black text-[#E8432D]">{value}</div>
                  <div className="text-[10px] text-[#9E9890] uppercase tracking-[0.08em] font-sans mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 flex items-center justify-center"
            style={{ border: '1px solid #D6CFC4', minHeight: '180px' }}>
            <p className="text-[11px] text-[#9E9890] font-sans text-center">
              Nenhuma carreira salva.<br />Inicie uma nova para começar.
            </p>
          </div>
        )}
      </div>
    </main>

    <footer style={{ borderTop: '1px solid #D6CFC4' }}
      className="px-8 py-3 flex justify-between items-center">
      <span className="text-[10px] text-[#9E9890] tracking-[0.1em] uppercase font-sans">
        Corner · Brasileirão 2025
      </span>
      <span className="font-mono text-[10px] text-[#9E9890]">v1.0</span>
    </footer>
  </div>
);