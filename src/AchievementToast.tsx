import { useEffect, useState } from 'react';
import type { Achievement } from './achievements';

interface Props {
  achievements: Achievement[];
  onDone: () => void;
}

export const AchievementToast = ({ achievements, onDone }: Props) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!achievements.length) { onDone(); return; }
    setIndex(0);
    setVisible(true);
  }, [achievements]);

  useEffect(() => {
    if (!achievements.length) return;
    const timer = setTimeout(() => {
      if (index < achievements.length - 1) {
        setVisible(false);
        setTimeout(() => { setIndex(i => i + 1); setVisible(true); }, 300);
      } else {
        setVisible(false);
        setTimeout(onDone, 300);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [index, achievements]);

  if (!achievements.length) return null;
  const a = achievements[index];

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-[#131A22] border border-[#2DFFA8]/30 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-glow max-w-sm">
        <span className="text-3xl">{a.icon}</span>
        <div>
          <p className="text-xs text-[#2DFFA8] font-bold uppercase tracking-widest mb-0.5">
            Conquista desbloqueada
          </p>
          <p className="font-black text-[#E6EDF3] text-sm">{a.title}</p>
          <p className="text-xs text-[#8B97A3] mt-0.5">{a.desc}</p>
        </div>
      </div>
    </div>
  );
};