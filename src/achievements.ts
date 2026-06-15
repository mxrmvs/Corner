import type { ClubStanding } from './leagueTypes';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export function checkAchievements(
  prev: ClubStanding | undefined,
  curr: ClubStanding | undefined,
  allMatches: { homeClubId: string; awayClubId: string; homeGoals?: number; awayGoals?: number; played: boolean }[],
  userClubId: string,
): Achievement[] {
  const found: Achievement[] = [];
  if (!curr) return found;

  // Subiu de posição
  if (prev && curr.points > prev.points) {
    if (curr.wins === 1) {
      found.push({ id: 'first_win', icon: '🏆', title: 'Primeira Vitória!', desc: 'Você venceu sua primeira partida na temporada.' });
    }
    if (curr.wins === 5) {
      found.push({ id: 'five_wins', icon: '🔥', title: '5 Vitórias!', desc: 'Cinco triunfos na temporada. O elenco está confiante.' });
    }
    if (curr.wins === 10) {
      found.push({ id: 'ten_wins', icon: '⚡', title: '10 Vitórias!', desc: 'Duas mãos cheias de vitórias. Título à vista?' });
    }
  }

  // Sequência de vitórias
  const userMatches = allMatches
    .filter(m => m.played && (m.homeClubId === userClubId || m.awayClubId === userClubId))
    .slice(-5);

  const streak = userMatches.filter(m => {
    const isHome = m.homeClubId === userClubId;
    const ug = isHome ? m.homeGoals! : m.awayGoals!;
    const og = isHome ? m.awayGoals! : m.homeGoals!;
    return ug > og;
  }).length;

  if (streak === 3) {
    found.push({ id: 'streak_3', icon: '🚀', title: 'Sequência de 3!', desc: 'Três vitórias consecutivas. O time está em chamas!' });
  }
  if (streak === 5) {
    found.push({ id: 'streak_5', icon: '👑', title: 'Sequência de 5!', desc: 'Cinco seguidas! Ninguém para esse time.' });
  }

  // Líder da tabela
  if (curr.points > 0 && prev && curr.points > prev.points) {
    if (curr.wins >= 3 && curr.losses === 0) {
      found.push({ id: 'unbeaten', icon: '🛡️', title: 'Invicto!', desc: 'Ainda sem derrotas na temporada.' });
    }
  }

  // Artilharia
  if (curr.goalsFor >= 10 && (!prev || prev.goalsFor < 10)) {
    found.push({ id: 'goals_10', icon: '⚽', title: '10 Gols Marcados!', desc: 'Seu ataque está afiado nesta temporada.' });
  }
  if (curr.goalsFor >= 30 && (!prev || prev.goalsFor < 30)) {
    found.push({ id: 'goals_30', icon: '💥', title: '30 Gols!', desc: 'Ataque devastador. Artilharia da competição?' });
  }

  return found;
}