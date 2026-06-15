export type Position = 'GK' | 'DEF' | 'MID' | 'ATT';
export type PositionFilter = 'ALL' | Position;
export type TacticalStyle = 'TIKI_TAKA' | 'COUNTER' | 'DIRECT';
export type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '5-3-2';

export interface PlayerAttributes {
  attack: number;
  defense: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  position: Position;
  foot: 'Destro' | 'Canhoto';
  currentRating: number;
  clubId: string;
  salary: number;
  marketValue: number;
  morale: number;
  attributes: PlayerAttributes;
}