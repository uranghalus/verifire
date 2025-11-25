// app/apar/components/apar-toolbar.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table } from '@tanstack/react-table'
import { Printer, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Apar } from '../types/apar'
import { DataTableFacetedFilter } from '@/components/datatable/datatable-faceted-filter'

interface AparToolbarProps<TData> {
    table: Table<TData>
    searchValue: string
    onSearchChange: (value: string) => void
    onFilterChange: (filterType: string, value: string) => void
    onResetFilters: () => void
    currentFilters: {
        lantai: string
        jenis: string
        size: string
    }
}

export function AparToolbar<TData>({
    table,
    searchValue,
    onSearchChange,
    onFilterChange,
    onResetFilters,
    currentFilters
}: AparToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const [lantaiList, setLantaiList] = useState<string[]>([])
    const [jenisList, setJenisList] = useState<string[]>([])
    const [sizeList, setSizeList] = useState<string[]>([])
    const [batchCount, setBatchCount] = useState(1)
    const [selectedLantai, setSelectedLantai] = useState('')
    const [selectedBatch, setSelectedBatch] = useState('1')

    // Ambil data filter options dari backend
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch('/api/apar/filter-options')
                if (response.ok) {
                    const data = await response.json()
                    setBatchCount(data.totalBatch ?? 1)
                    setJenisList(data.jenis ?? [])
                    setSizeList(data.size ?? [])
                    setLantaiList(data.lantai ?? [])
                }
            } catch (error) {
                console.error('Error fetching filter options:', error)
            }
        }

        fetchFilterOptions()
    }, [])

    const handlePrint = () => {
        const params = new URLSearchParams()
        if (selectedLantai) params.append('lantai', selectedLantai)
        params.append('batch', selectedBatch)

        // Ganti dengan route Next.js Anda
        window.open(`/api/apar/print-qrcode?${params.toString()}`, '_blank')
    }

    // Handler untuk faceted filter changes
    const handleFacetedFilterChange = (columnId: string, value: string[]) => {
        if (value.length > 0) {
            onFilterChange(columnId, value[0]) // Ambil value pertama untuk single selection
        } else {
            onFilterChange(columnId, '') // Reset jika tidak ada selection
        }
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                <Input
                    placeholder="Cari APAR"
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="w-full sm:w-[250px] md:w-[300px] lg:w-[400px]"
                />
                <div className="flex gap-x-2">
                    {table.getColumn('jenis') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('jenis')}
                            title="Jenis APAR"
                            options={jenisList.map((item) => ({ label: item, value: item }))}
                        />
                    )}
                    {table.getColumn('size') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('size')}
                            title="Ukuran APAR"
                            options={sizeList.map((item) => ({ label: `${item} kg`, value: item }))}
                        />
                    )}
                    {table.getColumn('lantai') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('lantai')}
                            title="Lantai"
                            options={lantaiList.map((item) => ({ label: item, value: item }))}
                        />
                    )}
                </div>
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={onResetFilters}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Select value={selectedLantai} onValueChange={setSelectedLantai}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Pilih Lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                        {lantaiList.map((lokasi, index) => (
                            <SelectItem key={index} value={lokasi}>
                                {lokasi}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Batch ke-" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: batchCount }, (_, i) => (
                            <SelectItem key={i} value={`${i + 1}`}>
                                Batch {i + 1}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button size="sm" className="h-8" variant="secondary" onClick={handlePrint}>
                    <Printer className="mr-1 h-4 w-4" />
                    Cetak QR Code
                </Button>
            </div>
        </div>
    )
}