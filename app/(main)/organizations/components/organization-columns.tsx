/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Organization } from "../types/organization";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";


export const columns: ColumnDef<Organization>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
