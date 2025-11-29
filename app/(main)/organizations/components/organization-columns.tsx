import { Button } from "@/components/ui/button";
import { Organization } from "@/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";

export const OrgColumns: ColumnDef<Organization>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
    {
        accessorKey: 'logo',
        header: 'Logo',
        cell: ({ row }) => (
            <img
                src={row.getValue('logo') || '/placeholder.svg'}
                className="w-8 h-8 rounded"
            />
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex gap-2">
                {/* <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
                    Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>
                    Delete
                </Button> */}
            </div>
        ),
    },
]