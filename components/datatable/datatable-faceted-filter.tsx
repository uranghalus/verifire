'use client'

import * as React from 'react'

import { type Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Check, PlusCircle } from 'lucide-react'

type FilterOption = {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
}

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: FilterOption[]
}

/**
 * ✅ Komponen ini kompatibel dengan Next.js (App Router)
 * Gunakan di dalam Client Components yang menggunakan TanStack Table.
 */
export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
}: DataTableFacetedFilterProps<TData, TValue>) {
    // Pastikan column ada sebelum dipakai
    const facets = React.useMemo(() => column?.getFacetedUniqueValues?.(), [column])
    const selectedValues = React.useMemo(
        () => new Set((column?.getFilterValue() as string[]) ?? []),
        [column]
    )

    const handleSelect = React.useCallback(
        (value: string) => {
            const updated = new Set(selectedValues)
            if (updated.has(value)) {
                updated.delete(value)
            } else {
                updated.add(value)
            }

            const filterValues = Array.from(updated)
            column?.setFilterValue(filterValues.length ? filterValues : undefined)
        },
        [column, selectedValues]
    )

    if (!column) return null

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle className="size-4" />
                    {title}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>

                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value)

                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                    >
                                        <div
                                            className={cn(
                                                'border-primary flex size-4 items-center justify-center rounded-sm border',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <Check className="text-background h-4 w-4" />
                                        </div>

                                        {option.icon && (
                                            <option.icon className="text-muted-foreground size-4" />
                                        )}

                                        <span>{option.label}</span>

                                        {facets?.get(option.value) && (
                                            <span className="ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option.value)}
                                            </span>
                                        )}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>

                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => column?.setFilterValue(undefined)}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
