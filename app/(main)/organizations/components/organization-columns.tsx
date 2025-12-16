'use client'
import { ColumnDef } from "@tanstack/react-table";
import { Organization } from "../types/organization";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Organization>[] = [
    {
        id: "select",
        header: "Select",
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
    },
    {
        accessorKey: "name",
        header: "Nama Unit Bisnis",
        cell: ({ getValue }) => (
            <div className="font-medium">{getValue<string>()}</div>
        ),
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ getValue }) => (
            <div className="font-medium">{getValue<string>()}</div>
        ),
    },
];
