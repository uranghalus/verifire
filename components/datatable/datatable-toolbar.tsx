"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./datatable-faceted-filter";
import { DataTableViewOptions } from "./datatable-view-options";


export function DataTableToolbar({
    table,
    searchValue,
    onSearchChange,
    roleValue,
    onRoleChange,
}: {
    table: unknown;
    searchValue: string;
    onSearchChange: (value: string) => void;
    roleValue?: string;
    onRoleChange: (v: string | undefined) => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
                <Input
                    placeholder="Cari nama..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8 w-[200px]"
                />

                <DataTableFacetedFilter
                    title="Role"
                    selected={roleValue}
                    onChange={onRoleChange}
                    options={[
                        { label: "Admin", value: "admin" },
                        { label: "User", value: "user" },
                    ]}
                />

                {(roleValue || searchValue) && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            onSearchChange("");
                            onRoleChange(undefined);
                        }}
                        className="h-8"
                    >
                        Reset
                    </Button>
                )}
            </div>

            <DataTableViewOptions table={table} />
        </div>
    );
}
