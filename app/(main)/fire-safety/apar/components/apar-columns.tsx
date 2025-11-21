'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

export type AparRow = {
    id: number;
    kode_apar: string;
    lantai?: string | null;
    lokasi: string;
    jenis: string;
    size: number;
    createdAt: string;
    updatedAt: string;
};

export const columns: ColumnDef<AparRow>[] = [
    { accessorKey: 'kode_apar', header: 'Kode' },
    { accessorKey: 'lantai', header: 'Lantai' },
    { accessorKey: 'lokasi', header: 'Lokasi' },
    { accessorKey: 'jenis', header: 'Jenis' },
    { accessorKey: 'size', header: 'Size' },
    {
        accessorKey: 'updatedAt',
        header: 'Terakhir',
        cell: info => new Date(info.getValue() as string).toLocaleString(),
    },
];
