'use client'

import { DataTable } from "@/components/datatable/data-table";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";

import { parseAsInteger, useQueryState } from 'nuqs';
interface OrgTableParams<TData, TValue> {
    data: TData[];
    totalItems: number;
    columns: ColumnDef<TData, TValue>[];
}
import React from 'react'

export default function OrganizationTable<TData, TValue>({
    data,
    totalItems,
    columns
}: OrgTableParams<TData, TValue>) {
    const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

    const pageCount = Math.ceil(totalItems / pageSize);

    const { table } = useDataTable({
        data, // product data
        columns, // product columns
        pageCount: pageCount,
        shallow: false, //Setting to false triggers a network request with the updated querystring.
        debounceMs: 500
    });
    console.log({
        dataLength: data.length,
        rows: table.getRowModel().rows.length,
    });
    return (
        <DataTable table={table} >
            <DataTableToolbar table={table} />
        </DataTable>
    );
}
