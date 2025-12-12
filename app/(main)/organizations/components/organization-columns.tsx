/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-provider";


export type OrgType = {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    createdAt?: string;
};

export const columns: ColumnDef<OrgType>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
            <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
        ),
    },

    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const org = row.original;
            const { setOpen, setCurrentRow } = useDialog<OrgType>();

            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setCurrentRow(org);
                            setOpen("edit");
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            setCurrentRow(org);
                            setOpen("delete");
                        }}
                    >
                        Delete
                    </Button>
                </div>
            );
        },
    },
];
