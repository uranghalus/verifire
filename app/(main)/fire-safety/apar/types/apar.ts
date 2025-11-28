// data/schema.ts
type Decimal3_1 = number & { readonly __brand: 'decimal_3_1' };
export type Apar = {
  id: number;
  kode_apar: string;
  lantai: string | null;
  lokasi: string;
  jenis: JenisApar;
  size: Decimal3_1;
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
