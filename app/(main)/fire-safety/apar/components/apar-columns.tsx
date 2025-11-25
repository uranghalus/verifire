import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Apar } from "../types/apar";

import { AparRowActions } from "./apar-row-action";
import { JenisApar } from "@/generated/prisma";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";


const jenisLabels: Record<JenisApar, string> = {
    Powder: "Powder",
    Foam: "Foam",
    CO2: "CO2",
    Air: "Air",
};

const jenisColors: Record<JenisApar, string> = {
    Powder: "bg-blue-100 text-blue-800",
    Foam: "bg-green-100 text-green-800",
    CO2: "bg-gray-100 text-gray-800",
    Air: "bg-orange-100 text-orange-800",
};

export const aparColumns: ColumnDef<Apar>[] = [
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
        accessorKey: "kode_apar",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode APAR" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('kode_apar')}</div>,
    },
    {
        accessorKey: "lokasi",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Lokasi" />
        ),
        cell: ({ row }) => <div>{row.getValue('lokasi')}</div>,
    },
    {
        accessorKey: "lantai",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Lantai" />
        ),
        cell: ({ row }) => <div>{row.getValue('lantai') || '-'}</div>,
    },
    {
        accessorKey: "jenis",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jenis" />
        ),
        cell: ({ row }) => {
            const jenis = row.getValue('jenis') as JenisApar;
            return (
                <Badge variant="secondary" className={jenisColors[jenis]}>
                    {jenisLabels[jenis]}
                </Badge>
            );
        },
        // NOTE: server-side filtering will be used; keep filterFn simple or remove
    },
    {
        accessorKey: "size",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Size (kg)" />
        ),
        cell: ({ row }) => <div className="text-right">{row.getValue('size')} kg</div>,
    },
    {
        accessorKey: 'user',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='PIC' />
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div>
                    {user ? (
                        <div>
                            <div className='font-medium'>{user.name}</div>
                            <div className='text-sm text-muted-foreground'>{user.email}</div>
                        </div>
                    ) : (
                        <span className='text-muted-foreground'>-</span>
                    )}
                </div>
            )
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <AparRowActions row={row} />,
    }
];
