'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Apar } from '@/types';

export const columns: ColumnDef<Apar>[] = [
    {
        accessorKey: "kode_apar",
        header: "Kode APAR",
        meta: { className: "w-[150px]" },
    },
    {
        accessorKey: "lantai",
        header: "Lantai",
        meta: { className: "w-[120px]" },
    },
    {
        accessorKey: "lokasi",
        header: "Lokasi",
        meta: { className: "w-[200px]" },
    },
    {
        accessorKey: "jenis",
        header: "Jenis",
        meta: { className: "w-[120px]" },
    },
    {
        accessorKey: "size",
        header: "Size (Kg)",
        cell: ({ row }) => <span>{row.original.size} Kg</span>,
        meta: { className: "w-[100px]" },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <button
                    type="button"
                    data-id={row.original.id}
                    className="text-sm text-blue-600"
                // The parent page will handle open edit/delete via callbacks if needed
                >
                    Edit
                </button>
                <button type="button" data-id={row.original.id} className="text-sm text-red-600">
                    Delete
                </button>
            </div>
        ),
        meta: { className: "w-[140px] text-right" },
    },
];
