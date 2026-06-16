import { useEffect, useState } from 'react';
import type { Achievement } from './achievements';

interface Props {
  achievements: Achievement[];
  onDone: () => void;
}

export const AchievementToast = ({ achievements, onDone }: Props) => {
  const [index, setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!achievements.length) { onDone(); return; }
    setIndex(0); setVisible(true);
  }, [achievements]);

  useEffect(() => {
    if (!achievements.length) return;
    const t = setTimeout(() => {
      if (index < achievements.length - 1) {
        setVisible(false);
        setTimeout(() => { setIndex(i => i + 1); setVisible(true); }, 300);
      } else {
        setVisible(false);
        setTimeout(onDone, 300);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [index, achievements]);

  if (!achievements.length) return null;
  const a = achievements[index];

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 100,
      transition: 'all 0.3s',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
    }}>
      <div style={{
        background: 'white', border: '1px solid #1A1A1A',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
        maxWidth: '320px', boxShadow: '4px 4px 0 #1A1A1A',
      }}>
        <span style={{ fontSize: '28px', flexShrink: 0 }}>{a.icon}</span>
        <div>
          <p style={{ fontFamily: 'system-ui', fontSize: '10px', color: '#E8432D', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>
            Conquista desbloqueada
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 900, color: '#1A1A1A', margin: 0 }}>
            {a.title}
          </p>
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', color: '#6B6560', marginTop: '2px' }}>
            {a.desc}
          </p>
        </div>
      </div>
    </div>
  );
};