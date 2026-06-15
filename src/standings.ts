import type { Match } from './calendar';
import type { ClubStanding } from './leagueTypes';
import { CLUBS } from './clubs';

export function computeStandings(matches: Match[]): ClubStanding[] {
  const map: Record<string, ClubStanding> = {};

  CLUBS.forEach(c => {
    map[c.id] = {
      clubId: c.id, clubName: c.name,
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0,
    };
  });

  matches.filter(m => m.played).forEach(m => {
    const h = map[m.homeClubId];
    const a = map[m.awayClubId];
    const hg = m.homeGoals ?? 0;
    const ag = m.awayGoals ?? 0;
    h.played++; a.played++;
    h.goalsFor += hg; h.goalsAgainst += ag;
    a.goalsFor += ag; a.goalsAgainst += hg;
    if (hg > ag) { h.wins++; h.points += 3; a.losses++; }
    else if (hg < ag) { a.wins++; a.points += 3; h.losses++; }
    else { h.draws++; h.points++; a.draws++; a.points++; }
  });

  return Object.values(map).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
  });
}