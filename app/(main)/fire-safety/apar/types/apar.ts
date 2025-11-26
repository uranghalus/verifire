// data/schema.ts
export type Apar = {
  id: number;
  kode_apar: string;
  lantai: string | null;
  lokasi: string;
  jenis: JenisApar;
  size: number;
  userId: string | null;
  user: User | null;
  createdAt: Date;
  updatedAt: Date;
};

export enum JenisApar {
  Powder = 'Powder',
  Foam = 'Foam',
  CO2 = 'CO2',
  Water = 'Water',
}

export type User = {
  id: string;
  name: string;
  email: string;
};
