export type Position = 'GK' | 'DEF' | 'MID' | 'ATT';

export type PositionFilter = 'ALL' | Position;

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
  attributes: PlayerAttributes;
}