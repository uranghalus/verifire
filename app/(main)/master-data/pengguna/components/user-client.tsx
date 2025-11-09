/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";


// import { UserTableSkeleton } from "@/components/user-table-skeleton";

import { Button } from "@/components/ui/button";
import { fetchUsersServer } from "../data/action";
import { UserTableSkeleton } from "./user-table-skeleton";
import { UserTable } from "./user-table";
import { columns } from "./users-columns";
import { User } from "@/types";
// import {
//     exportUsersToExcel,
//     exportUsersToPDF,
// } from "@/components/export-users";



export default function UsersClient() {
    const [loading, setLoading] = React.useState(true);
    const [users, setUsers] = React.useState<User[]>([]);
    const [total, setTotal] = React.useState(0);
    const [searchInput, setSearchInput] = React.useState("");
    const [roleFilter, setRoleFilter] = React.useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name");
    const [sortDirection, setSortDirection] =
        React.useState<"asc" | "desc">("asc");

    async function loadData() {
        setLoading(true);
        const result = await fetchUsersServer({
            page,
            pageSize,
            search: searchInput,
            role: roleFilter,
            status: statusFilter,
            sortBy,
            sortDirection,
        });
        console.log('Load User', result);

        setUsers(result.users ?? []);   // ✅ Aman dari undefined/null
        setTotal(result.total ?? 0);
        setLoading(false);
    }

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setPage(0);
            loadData();
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        loadData();
    }, [page, pageSize, sortBy, sortDirection]);

    return (
        <div className="space-y-4 mt-6">

            {/* ✅ Search + Export */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input
                    type="text"
                    placeholder="Cari nama..."
                    className="border px-3 py-2 rounded-md w-full sm:w-80"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportUsersToExcel(users)}>
                        Export Excel
                    </Button>
                    <Button variant="outline" onClick={() => exportUsersToPDF(users)}>
                        Export PDF
                    </Button>
                </div> */}
            </div>

            {/* ✅ Table */}
            {loading ? (
                <UserTableSkeleton />
            ) : (
                <UserTable
                    columns={columns}
                    data={users}
                    server={{
                        page,
                        pageSize,
                        total,
                        setPage,
                        setPageSize,
                        setSortBy,
                        setSortDirection,
                    }}
                />
            )}
        </div>
    );
}
