// data/data.ts

import {
  BubblesIcon,
  DropletsIcon,
  FireExtinguisherIcon,
  SnowflakeIcon,
} from 'lucide-react';
import { JenisApar } from '../types/apar';

export const jenisApar = [
  {
    value: JenisApar.Powder,
    label: 'Powder',
    icon: FireExtinguisherIcon, // Anda perlu membuat/import icon
  },
  {
    value: JenisApar.Foam,
    label: 'Foam',
    icon: BubblesIcon,
  },
  {
    value: JenisApar.CO2,
    label: 'CO2',
    icon: SnowflakeIcon,
  },
  {
    value: JenisApar.Water,
    label: 'Water',
    icon: DropletsIcon,
  },
] as const;

export const sizes = [
  { value: '1.0', label: '1.0 kg' },
  { value: '2.0', label: '2.0 kg' },
  { value: '3.5', label: '3.5 kg' },
  { value: '5.0', label: '5.0 kg' },
  { value: '6.0', label: '6.0 kg' },
  { value: '9.0', label: '9.0 kg' },
] as const;
