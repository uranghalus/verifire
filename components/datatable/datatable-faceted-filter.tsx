/* eslint-disable react-hooks/rules-of-hooks */
"use client";


import { type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Check, PlusCircle } from "lucide-react";
import { useCallback, useMemo } from "react";

type FilterOption = {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
};

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: FilterOption[];
}

/**
 * Robust faceted filter for TanStack Table + Shadcn UI.
 */
export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
}: DataTableFacetedFilterProps<TData, TValue>) {
    if (!column) return null;

    // facets: Map<string, number> | undefined
    const facets = useMemo(() => column.getFacetedUniqueValues?.(), [column]);

    // compute selected Set lazily inside handler to avoid stale closures
    const selectedSet = useMemo(
        () => new Set((column.getFilterValue() as string[]) ?? []),
        [column]
    );

    const handleSelect = useCallback(
        (value: string) => {
            // read latest filter value from column (avoid stale closure)
            const current = (column.getFilterValue() as string[]) ?? [];
            const next = new Set(current);

            if (next.has(value)) next.delete(value);
            else next.add(value);

            const nextArr = Array.from(next);
            column.setFilterValue(nextArr.length ? nextArr : undefined);
        },
        [column]
    );

    // for rendering badges / count
    const selectedValuesCount = (column.getFilterValue() as string[])?.length ?? 0;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle className="h-4 w-4" />
                    {title}
                    {selectedValuesCount > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedValuesCount}
                            </Badge>

                            <div className="hidden space-x-1 lg:flex">
                                {selectedValuesCount > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                        {selectedValuesCount} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((opt) => (column.getFilterValue() as string[] ?? []).includes(opt.value))
                                        .map((opt) => (
                                            <Badge key={opt.value} variant="secondary" className="rounded-sm px-1 font-normal">
                                                {opt.label}
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
                                const isSelected = (column.getFilterValue() as string[] ?? []).includes(option.value);
                                return (
                                    <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                                        <div
                                            className={cn(
                                                "flex h-4 w-4 items-center justify-center rounded-sm border",
                                                isSelected ? "bg-primary text-primary-foreground border-transparent" : "opacity-50"
                                            )}
                                        >
                                            <Check className="h-3 w-3" />
                                        </div>

                                        {option.icon && <option.icon className="text-muted-foreground h-4 w-4 ml-2" />}

                                        <span className="ml-2">{option.label}</span>

                                        {facets?.get(option.value) && (
                                            <span className="ms-auto flex h-4 w-8 items-center justify-center font-mono text-xs">
                                                {facets.get(option.value)}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>

                        {selectedValuesCount > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => {
                                            column.setFilterValue(undefined);
                                        }}
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
    );
}
