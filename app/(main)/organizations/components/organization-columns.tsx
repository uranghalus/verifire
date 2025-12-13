/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Organization } from "../types/organization";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Button } from "@/components/ui/button";


export const columns: ColumnDef<Organization>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nama Unit Bisnis' />
        ),
        cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'slug',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Slug' />
        ),
        cell: ({ row }) => <div className='font-medium'>{row.getValue('slug')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const org = row.original
            return (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => console.log('delete', org.id)}
                >
                    Delete
                </Button>
            )
        },
    }
];
