import type { Player } from './types';

export const PLAYERS: Player[] = [
  { id: '1',  name: 'Alisson B.',      age: 32, position: 'GK',  foot: 'Destro',  currentRating: 89, clubId: 'c1', salary: 120_000, marketValue: 8_000_000,  attributes: { attack: 30, defense: 91, physical: 85 } },
  { id: '2',  name: 'Ederson M.',      age: 30, position: 'GK',  foot: 'Destro',  currentRating: 86, clubId: 'c1', salary: 100_000, marketValue: 6_000_000,  attributes: { attack: 28, defense: 87, physical: 82 } },
  { id: '3',  name: 'Marquinhos S.',   age: 30, position: 'DEF', foot: 'Destro',  currentRating: 86, clubId: 'c1', salary: 110_000, marketValue: 7_000_000,  attributes: { attack: 55, defense: 88, physical: 83 } },
  { id: '4',  name: 'Gabriel M.',      age: 26, position: 'DEF', foot: 'Destro',  currentRating: 82, clubId: 'c1', salary: 80_000,  marketValue: 5_000_000,  attributes: { attack: 50, defense: 84, physical: 80 } },
  { id: '5',  name: 'Wendell S.',      age: 30, position: 'DEF', foot: 'Canhoto', currentRating: 77, clubId: 'c1', salary: 60_000,  marketValue: 3_000_000,  attributes: { attack: 62, defense: 78, physical: 76 } },
  { id: '6',  name: 'Danilo L.',       age: 33, position: 'DEF', foot: 'Destro',  currentRating: 75, clubId: 'c1', salary: 55_000,  marketValue: 2_000_000,  attributes: { attack: 58, defense: 76, physical: 72 } },
  { id: '7',  name: 'Bruno G.',        age: 27, position: 'MID', foot: 'Destro',  currentRating: 85, clubId: 'c1', salary: 115_000, marketValue: 7_500_000,  attributes: { attack: 82, defense: 81, physical: 84 } },
  { id: '8',  name: 'Lucas P.',        age: 27, position: 'MID', foot: 'Destro',  currentRating: 83, clubId: 'c1', salary: 90_000,  marketValue: 6_000_000,  attributes: { attack: 80, defense: 75, physical: 79 } },
  { id: '9',  name: 'Gerson S.',       age: 27, position: 'MID', foot: 'Canhoto', currentRating: 80, clubId: 'c1', salary: 75_000,  marketValue: 4_500_000,  attributes: { attack: 76, defense: 74, physical: 82 } },
  { id: '10', name: 'Andreas P.',      age: 28, position: 'MID', foot: 'Destro',  currentRating: 78, clubId: 'c1', salary: 65_000,  marketValue: 3_500_000,  attributes: { attack: 72, defense: 79, physical: 80 } },
  { id: '11', name: 'Rodrigo C.',      age: 28, position: 'MID', foot: 'Destro',  currentRating: 76, clubId: 'c1', salary: 58_000,  marketValue: 3_000_000,  attributes: { attack: 74, defense: 70, physical: 75 } },
  { id: '12', name: 'Vinicius Jr.',    age: 24, position: 'ATT', foot: 'Destro',  currentRating: 92, clubId: 'c1', salary: 200_000, marketValue: 15_000_000, attributes: { attack: 93, defense: 38, physical: 88 } },
  { id: '13', name: 'Rodrygo G.',      age: 24, position: 'ATT', foot: 'Destro',  currentRating: 83, clubId: 'c1', salary: 85_000,  marketValue: 6_000_000,  attributes: { attack: 84, defense: 40, physical: 78 } },
  { id: '14', name: 'Raphinha B.',     age: 28, position: 'ATT', foot: 'Canhoto', currentRating: 82, clubId: 'c1', salary: 80_000,  marketValue: 5_500_000,  attributes: { attack: 83, defense: 42, physical: 80 } },
  { id: '15', name: 'Endrick F.',      age: 18, position: 'ATT', foot: 'Destro',  currentRating: 76, clubId: 'c1', salary: 40_000,  marketValue: 4_000_000,  attributes: { attack: 79, defense: 44, physical: 77 } },
  // Jogadores no mercado livre (sem clube)
  { id: '16', name: 'Hulk A.',         age: 37, position: 'ATT', foot: 'Destro',  currentRating: 72, clubId: '', salary: 30_000,  marketValue: 800_000,    attributes: { attack: 74, defense: 30, physical: 70 } },
  { id: '17', name: 'Diego C.',        age: 35, position: 'MID', foot: 'Destro',  currentRating: 70, clubId: '', salary: 25_000,  marketValue: 600_000,    attributes: { attack: 72, defense: 65, physical: 68 } },
  { id: '18', name: 'Felipe A.',       age: 22, position: 'DEF', foot: 'Canhoto', currentRating: 68, clubId: '', salary: 20_000,  marketValue: 1_200_000,  attributes: { attack: 40, defense: 70, physical: 72 } },
  { id: '19', name: 'Carlos E.',       age: 24, position: 'MID', foot: 'Destro',  currentRating: 71, clubId: '', salary: 28_000,  marketValue: 1_500_000,  attributes: { attack: 68, defense: 60, physical: 74 } },
  { id: '20', name: 'Rafael S.',       age: 26, position: 'ATT', foot: 'Destro',  currentRating: 74, clubId: '', salary: 35_000,  marketValue: 2_000_000,  attributes: { attack: 76, defense: 35, physical: 72 } },
  { id: '21', name: 'Pedro H.',        age: 20, position: 'GK',  foot: 'Destro',  currentRating: 65, clubId: '', salary: 15_000,  marketValue: 900_000,    attributes: { attack: 20, defense: 67, physical: 70 } },
  { id: '22', name: 'Lucas F.',        age: 23, position: 'DEF', foot: 'Destro',  currentRating: 69, clubId: '', salary: 22_000,  marketValue: 1_100_000,  attributes: { attack: 45, defense: 71, physical: 68 } },
];