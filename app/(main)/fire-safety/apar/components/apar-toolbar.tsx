"use client";

import { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTableFacetedFilter } from "@/components/datatable/datatable-faceted-filter";


interface FilterOptions {
    lantai: string[];
    jenis: string[];
    size: string[];
    totalBatch: number;
}

export default function AparToolbar<TData>({ table }: { table: Table<TData> }) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const [options, setOptions] = useState<FilterOptions>({ lantai: [], jenis: [], size: [], totalBatch: 1 });
    const [selectedBatch, setSelectedBatch] = useState("1");
    const [selectedLantaiPrint, setSelectedLantaiPrint] = useState("");

    useEffect(() => {
        fetch("/api/apar/filter-options")
            .then((res) => res.json())
            .then((data) => setOptions(data))
            .catch(() => { });
    }, []);

    const handlePrint = () => {
        const params = new URLSearchParams();
        if (selectedLantaiPrint) params.append("lantai", selectedLantaiPrint);
        params.append("batch", selectedBatch);
        window.open(`/api/apar/print-qrcode?${params.toString()}`, "_blank");
    };

    return (
        <div className="-items-center flex justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                <Input
                    placeholder="Cari Apar"
                    value={(table.getColumn("kode_apar")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("kode_apar")?.setFilterValue(event.target.value)}
                    className="w-full sm:w-[250px] md:w-[300px] lg:w-[400px]"
                />

                <div className="flex gap-x-2">
                    {table.getColumn("jenis") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("jenis")}
                            title="Jenis Apar"
                            options={(options.jenis || []).map((lt) => ({ label: lt, value: lt }))}
                        />
                    )}

                    {table.getColumn("size") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("size")}
                            title="Ukuran Apar"
                            options={(options.size || []).map((lt) => ({ label: lt, value: lt }))}
                        />
                    )}

                    {table.getColumn("lantai") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("lantai")}
                            title="Lantai"
                            options={(options.lantai || []).map((lt) => ({ label: lt, value: lt }))}
                        />
                    )}
                </div>

                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Select onValueChange={setSelectedLantaiPrint}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Pilih Lantai" />
                    </SelectTrigger>
                    <SelectContent>
                        {(options.lantai || []).map((lok, i) => (
                            <SelectItem key={i} value={lok}>
                                {lok}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select defaultValue="1" onValueChange={setSelectedBatch}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Batch ke-" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: options.totalBatch || 1 }, (_, i) => (
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
    );
}