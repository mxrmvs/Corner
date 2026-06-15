import { get, set, del } from 'idb-keyval';
import type { Calendar } from './calendar';
import type { ClubStanding } from './leagueTypes';
import type { Player } from './types';
import type { Club } from './clubs';

export interface SaveData {
  calendar: Calendar;
  standings: ClubStanding[];
  season: number;
  players: Player[];
  userClub: Club;
}

const SAVE_KEY = 'corner_save_v1';

export const saveGame   = (data: SaveData): Promise<void> => set(SAVE_KEY, data);
export const loadGame   = (): Promise<SaveData | undefined> => get<SaveData>(SAVE_KEY);
export const deleteGame = (): Promise<void> => del(SAVE_KEY);