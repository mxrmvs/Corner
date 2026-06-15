import type { TacticalStyle, Formation } from './types';

export interface Club {
  id: string;
  name: string;
  reputation: number;
  balance: number;
  stadiumCapacity: number;
  tactical: {
    style: TacticalStyle;
    formation: Formation;
  };
}

export const CLUBS: Club[] = [
  { id: 'c1',  name: 'Corner FC',       reputation: 72, balance: 5_000_000,  stadiumCapacity: 35_000, tactical: { style: 'TIKI_TAKA', formation: '4-3-3'   } },
  { id: 'c2',  name: 'Rival FC',        reputation: 68, balance: 4_200_000,  stadiumCapacity: 28_000, tactical: { style: 'COUNTER',   formation: '4-4-2'   } },
  { id: 'c3',  name: 'Norte United',    reputation: 65, balance: 3_800_000,  stadiumCapacity: 25_000, tactical: { style: 'DIRECT',    formation: '3-5-2'   } },
  { id: 'c4',  name: 'Sul Athletic',    reputation: 70, balance: 4_500_000,  stadiumCapacity: 30_000, tactical: { style: 'TIKI_TAKA', formation: '4-2-3-1' } },
  { id: 'c5',  name: 'Leste City',      reputation: 60, balance: 3_000_000,  stadiumCapacity: 22_000, tactical: { style: 'COUNTER',   formation: '5-3-2'   } },
  { id: 'c6',  name: 'Oeste FC',        reputation: 58, balance: 2_800_000,  stadiumCapacity: 20_000, tactical: { style: 'DIRECT',    formation: '4-4-2'   } },
  { id: 'c7',  name: 'Central SC',      reputation: 75, balance: 6_000_000,  stadiumCapacity: 40_000, tactical: { style: 'TIKI_TAKA', formation: '4-3-3'   } },
  { id: 'c8',  name: 'Porto Alegre FC', reputation: 80, balance: 8_000_000,  stadiumCapacity: 45_000, tactical: { style: 'DIRECT',    formation: '4-2-3-1' } },
  { id: 'c9',  name: 'Capital United',  reputation: 78, balance: 7_500_000,  stadiumCapacity: 42_000, tactical: { style: 'COUNTER',   formation: '4-3-3'   } },
  { id: 'c10', name: 'Serra FC',        reputation: 55, balance: 2_500_000,  stadiumCapacity: 18_000, tactical: { style: 'DIRECT',    formation: '5-3-2'   } },
  { id: 'c11', name: 'Vale SC',         reputation: 52, balance: 2_000_000,  stadiumCapacity: 15_000, tactical: { style: 'COUNTER',   formation: '4-4-2'   } },
  { id: 'c12', name: 'Litoral FC',      reputation: 50, balance: 1_800_000,  stadiumCapacity: 12_000, tactical: { style: 'DIRECT',    formation: '3-5-2'   } },
];