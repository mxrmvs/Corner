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
  { id: 'fla', name: 'Flamengo',           reputation: 95, balance: 120000000, stadiumCapacity: 78838, tactical: { style: 'TIKI_TAKA', formation: '4-2-3-1' } },
  { id: 'pal', name: 'Palmeiras',           reputation: 93, balance: 110000000, stadiumCapacity: 43713, tactical: { style: 'DIRECT',    formation: '4-4-2'   } },
  { id: 'cru', name: 'Cruzeiro',            reputation: 85, balance: 60000000,  stadiumCapacity: 61846, tactical: { style: 'COUNTER',   formation: '4-3-3'   } },
  { id: 'mir', name: 'Mirassol',            reputation: 65, balance: 20000000,  stadiumCapacity: 16000, tactical: { style: 'COUNTER',   formation: '4-4-2'   } },
  { id: 'flu', name: 'Fluminense',          reputation: 84, balance: 55000000,  stadiumCapacity: 78838, tactical: { style: 'TIKI_TAKA', formation: '4-3-3'   } },
  { id: 'bot', name: 'Botafogo',            reputation: 83, balance: 70000000,  stadiumCapacity: 44661, tactical: { style: 'DIRECT',    formation: '4-3-3'   } },
  { id: 'bah', name: 'Bahia',               reputation: 78, balance: 40000000,  stadiumCapacity: 49500, tactical: { style: 'TIKI_TAKA', formation: '4-3-3'   } },
  { id: 'cor', name: 'Corinthians',         reputation: 88, balance: 50000000,  stadiumCapacity: 49205, tactical: { style: 'DIRECT',    formation: '4-2-3-1' } },
  { id: 'sao', name: 'São Paulo',           reputation: 87, balance: 55000000,  stadiumCapacity: 67428, tactical: { style: 'COUNTER',   formation: '4-4-2'   } },
  { id: 'gre', name: 'Grêmio',             reputation: 85, balance: 50000000,  stadiumCapacity: 55000, tactical: { style: 'TIKI_TAKA', formation: '4-3-3'   } },
  { id: 'int', name: 'Internacional',       reputation: 84, balance: 48000000,  stadiumCapacity: 50128, tactical: { style: 'DIRECT',    formation: '4-4-2'   } },
  { id: 'atm', name: 'Atlético Mineiro',    reputation: 86, balance: 65000000,  stadiumCapacity: 44892, tactical: { style: 'COUNTER',   formation: '4-2-3-1' } },
  { id: 'vas', name: 'Vasco da Gama',       reputation: 80, balance: 35000000,  stadiumCapacity: 21880, tactical: { style: 'DIRECT',    formation: '4-4-2'   } },
  { id: 'rbb', name: 'Red Bull Bragantino', reputation: 76, balance: 45000000,  stadiumCapacity: 15000, tactical: { style: 'TIKI_TAKA', formation: '4-3-3'   } },
  { id: 'san', name: 'Santos',              reputation: 82, balance: 30000000,  stadiumCapacity: 20000, tactical: { style: 'DIRECT',    formation: '4-3-3'   } },
  { id: 'vit', name: 'Vitória',             reputation: 68, balance: 18000000,  stadiumCapacity: 38081, tactical: { style: 'COUNTER',   formation: '4-4-2'   } },
  { id: 'for', name: 'Fortaleza',           reputation: 74, balance: 25000000,  stadiumCapacity: 57876, tactical: { style: 'DIRECT',    formation: '4-4-2'   } },
  { id: 'cea', name: 'Ceará',              reputation: 70, balance: 20000000,  stadiumCapacity: 57876, tactical: { style: 'COUNTER',   formation: '4-4-2'   } },
  { id: 'juv', name: 'Juventude',           reputation: 62, balance: 15000000,  stadiumCapacity: 17800, tactical: { style: 'DIRECT',    formation: '5-3-2'   } },
  { id: 'spo', name: 'Sport',              reputation: 60, balance: 12000000,  stadiumCapacity: 29000, tactical: { style: 'COUNTER',   formation: '4-4-2'   } },
];