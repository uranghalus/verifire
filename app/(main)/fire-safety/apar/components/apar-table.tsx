/* eslint-disable @typescript-eslint/no-explicit-any */
// app/apar/components/apar-table.tsx
"use client";

import { useEffect, useState } from "react";
import { useApar } from "../hooks/use-apar";
import { useRouter, useSearchParams } from "next/navigation";
import { aparColumns } from "./apar-columns";
import { DataTable } from "@/components/datatable/data-table";
import { AparToolbar } from "./apar-toolbar";






export default function AparTable() {




    const searchParams = useSearchParams()
    const router = useRouter()

    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [lantai, setLantai] = useState('')
    const [jenis, setJenis] = useState('')
    const [size, setSize] = useState('')

    // Sync URL params dengan state
    useEffect(() => {
        const pageParam = searchParams.get('page')
        const searchParam = searchParams.get('search')
        const lantaiParam = searchParams.get('lantai')
        const jenisParam = searchParams.get('jenis')
        const sizeParam = searchParams.get('size')

        if (pageParam) setPage(parseInt(pageParam))
        if (searchParam) setSearch(searchParam)
        if (lantaiParam) setLantai(lantaiParam)
        if (jenisParam) setJenis(jenisParam)
        if (sizeParam) setSize(sizeParam)
    }, [searchParams])

    // Update URL ketika state berubah
    const updateURL = (updates: Record<string, string | number>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) {
                params.delete(key)
            } else {
                params.set(key, value.toString())
            }
        })

        router.push(`/apar?${params.toString()}`, { scroll: false })
    }

    const { data, pagination, isLoading, mutate } = useApar({
        page,
        limit: 10,
        search,
        lantai,
        jenis,
        size
    })

    const handleSearchChange = (value: string) => {
        setSearch(value)
        setPage(1)
        updateURL({ search: value, page: 1 })
    }

    const handleFilterChange = (filterType: string, value: string) => {
        switch (filterType) {
            case 'lantai':
                setLantai(value)
                setPage(1)
                updateURL({ lantai: value, page: 1 })
                break
            case 'jenis':
                setJenis(value)
                setPage(1)
                updateURL({ jenis: value, page: 1 })
                break
            case 'size':
                setSize(value)
                setPage(1)
                updateURL({ size: value, page: 1 })
                break
            default:
                break
        }
    }

    const handleResetFilters = () => {
        setSearch('')
        setLantai('')
        setJenis('')
        setSize('')
        setPage(1)
        router.push('/apar', { scroll: false })
    }

    // Buat table instance untuk toolbar
    const table = {
        getState: () => ({
            columnFilters: [
                ...(lantai ? [{ id: 'lantai', value: lantai }] : []),
                ...(jenis ? [{ id: 'jenis', value: jenis }] : []),
                ...(size ? [{ id: 'size', value: size }] : [])
            ]
        }),
        getColumn: (columnId: string) => ({
            getFilterValue: () => {
                switch (columnId) {
                    case 'lantai': return lantai
                    case 'jenis': return jenis
                    case 'size': return size
                    default: return ''
                }
            },
            setFilterValue: (value: string) => handleFilterChange(columnId, value)
        }),
        resetColumnFilters: handleResetFilters
    }


    return (
        <div className="space-y-4">
            <AparToolbar
                table={table as any}
                searchValue={search}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                currentFilters={{ lantai, jenis, size }}
            />
            <div className="rounded-md border">
                <DataTable
                    columns={aparColumns}
                    data={data || []}
                />
            </div>

        </div>
    );
}