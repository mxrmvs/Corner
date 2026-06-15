import { get, set } from 'idb-keyval';
import type { Calendar } from './calendar';
import type { ClubStanding } from './leagueTypes';

export interface SaveData {
  calendar: Calendar;
  standings: ClubStanding[];
  season: number;
}

const SAVE_KEY = 'corner_save_v1';

export const saveGame = (data: SaveData): Promise<void> =>
  set(SAVE_KEY, data);

export const loadGame = (): Promise<SaveData | undefined> =>
  get<SaveData>(SAVE_KEY);