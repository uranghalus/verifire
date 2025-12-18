/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Column, ColumnDef } from "@tanstack/react-table";
import { Organization } from "../types/organization";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { cn } from "@/lib/utils";
import { Text } from "lucide-react";

export const columns: ColumnDef<Organization>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="w-[24px]">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className='translate-y-0.5'
                />
            </div>
        ),
        meta: {
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
        } as any,
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className='translate-y-0.5'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }: { column: Column<Organization, unknown> }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ cell }) => {

            return <div className="font-medium ps-2 text-nowrap w-32">{cell.getValue<Organization['name']>()}</div>
        },
        meta: { label: "Organization Name", placeholder: "Search OrganizationName", variant: 'text', icon: Text },
        enableColumnFilter: true,
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ getValue }) => (
            <div className="font-medium">{getValue<string>()}</div>
        ),
    },
];
