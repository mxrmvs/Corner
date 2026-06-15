export type Position = 'GK' | 'DEF' | 'MID' | 'ATT';

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