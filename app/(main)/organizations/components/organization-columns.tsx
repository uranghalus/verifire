/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Column, ColumnDef } from "@tanstack/react-table";
import { Organization } from "../types/organization";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { cn } from "@/lib/utils";
import { Text } from "lucide-react";
import OrganizationAction from "./organization-action";

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
        size: 0
    },
    {
        accessorKey: "name",
        header: ({ column }: { column: Column<Organization, unknown> }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ cell }) => {
            return <div className="font-medium ps-2">{cell.getValue<Organization['name']>()}</div>
        },
        meta: { label: "Organization Name", placeholder: "Search OrganizationName", variant: 'text', icon: Text },
        enableColumnFilter: true,
        size: 250
    },
    {
        accessorKey: "slug",
        header: ({ column }: { column: Column<Organization, unknown> }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ cell }) => {
            return <div className="font-medium ps-2">{cell.getValue<Organization['slug']>()}</div>
        },
        size: 500
    },
    {
        id: 'action',
        cell: ({ row }) => <OrganizationAction row={row} />
    }
];
