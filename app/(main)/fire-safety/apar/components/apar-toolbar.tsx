// app/apar/components/apar-table-toolbar.tsx (Recommended)
'use client'

import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { JenisApar } from '../types/apar'
import { useDialog } from '@/context/dialog-provider'

// Gunakan value yang meaningful untuk "all"
const ALL_JENIS_VALUE = 'ALL_JENIS'
const ALL_SIZE_VALUE = 'ALL_SIZE'

const jenisOptions = [
    { label: 'Semua Jenis', value: ALL_JENIS_VALUE },
    { label: 'Powder', value: JenisApar.POWDER },
    { label: 'Foam', value: JenisApar.FOAM },
    { label: 'CO2', value: JenisApar.CO2 },
    { label: 'Wet Chemical', value: JenisApar.WET_CHEMICAL },
]

const sizeOptions = [
    { label: 'Semua Size', value: ALL_SIZE_VALUE },
    { label: '1 kg', value: '1' },
    { label: '2 kg', value: '2' },
    { label: '3 kg', value: '3' },
    { label: '4 kg', value: '4' },
    { label: '5 kg', value: '5' },
    { label: '6 kg', value: '6' },
    { label: '9 kg', value: '9' },
]

interface AparTableToolbarProps {
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

export function AparTableToolbar({
    searchValue,
    onSearchChange,
    onFilterChange,
    onResetFilters,
    currentFilters
}: AparTableToolbarProps) {
    const isFiltered =
        searchValue !== '' ||
        currentFilters.lantai !== '' ||
        currentFilters.jenis !== '' ||
        currentFilters.size !== ''

    // Convert internal state ke external state
    const handleJenisChange = (value: string) => {
        onFilterChange('jenis', value === ALL_JENIS_VALUE ? '' : value)
    }

    const handleSizeChange = (value: string) => {
        onFilterChange('size', value === ALL_SIZE_VALUE ? '' : value)
    }

    // Convert external state ke internal state untuk display
    const displayJenisValue = currentFilters.jenis === '' ? ALL_JENIS_VALUE : currentFilters.jenis
    const displaySizeValue = currentFilters.size === '' ? ALL_SIZE_VALUE : currentFilters.size
    const { setOpen } = useDialog()
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Cari kode APAR, lokasi, atau lantai..."
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="h-8 w-[250px] lg:w-[300px]"
                />

                {/* Filter Lantai */}
                <Input
                    placeholder="Filter lantai..."
                    value={currentFilters.lantai}
                    onChange={(event) => onFilterChange('lantai', event.target.value)}
                    className="h-8 w-[130px]"
                />

                {/* Filter Jenis */}
                <Select
                    value={displayJenisValue}
                    onValueChange={handleJenisChange}
                >
                    <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue placeholder="Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                        {jenisOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Filter Size */}
                <Select
                    value={displaySizeValue}
                    onValueChange={handleSizeChange}
                >
                    <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        {sizeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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
            <div className="flex gap-2">
                <Button
                    onClick={() => setOpen('add')}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Tambah APAR
                </Button>
            </div>
        </div>
    )
}