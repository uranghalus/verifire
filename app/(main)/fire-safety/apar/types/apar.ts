// app/apar/types/apar.ts
export enum JenisApar {
  POWDER = 'POWDER',
  FOAM = 'FOAM',
  CO2 = 'CO2',
  WET_CHEMICAL = 'WET_CHEMICAL',
}

export type Apar = {
  id: number;
  kode_apar: string;
  lantai?: string;
  lokasi: string;
  jenis: JenisApar;
  size: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    email: string;
  };
};

export type AparFormData = {
  kode_apar: string;
  lantai?: string;
  lokasi: string;
  jenis: JenisApar;
  size: number;
  userId?: string;
};

// Tipe dialog khusus untuk APAR
export type AparDialogType = 'add' | 'edit' | 'delete';
