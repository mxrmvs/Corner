import type { Dilemma, DilemmaChoice } from './dilemmas';
import type { Player } from './types';

interface Props {
  dilemma: Dilemma;
  players: Player[];
  onChoose: (choice: DilemmaChoice) => void;
}

export const DilemmaModal = ({ dilemma, players, onChoose }: Props) => {
  const subject = players.find(p => p.id === dilemma.subjectId);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: '440px', border: '1px solid #1A1A1A' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #D6CFC4' }}>
          <p style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#E8432D', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            Dilema do Vestiário
          </p>
          {subject && (
            <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginBottom: '8px' }}>
              {subject.name} · {subject.age} anos
            </p>
          )}
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1.4, margin: 0 }}>
            {dilemma.title}
          </h2>
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {dilemma.choices.map((choice, i) => (
            <button key={i} onClick={() => onChoose(choice)}
              style={{
                padding: '12px 16px', border: '1px solid #D6CFC4', cursor: 'pointer',
                background: 'white', textAlign: 'left',
                fontFamily: 'system-ui', fontSize: '12px', color: '#1A1A1A',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#F2EDE4'; (e.target as HTMLElement).style.borderColor = '#1A1A1A'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = 'white'; (e.target as HTMLElement).style.borderColor = '#D6CFC4'; }}>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>{choice.label}</div>
              <div style={{ fontSize: '10px', color: '#9E9890' }}>
                {choice.moraleEffect > 0 && `+${choice.moraleEffect} moral`}
                {choice.moraleEffect < 0 && `${choice.moraleEffect} moral`}
                {choice.squadEffect !== 0 && ` · ${choice.squadEffect > 0 ? '+' : ''}${choice.squadEffect} elenco`}
                {choice.balanceEffect !== 0 && ` · ${choice.balanceEffect > 0 ? '+' : ''}R$${Math.abs(choice.balanceEffect / 1000).toFixed(0)}K`}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};