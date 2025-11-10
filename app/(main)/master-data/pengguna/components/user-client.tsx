"use client";

import React from "react";
import { UserTableSkeleton } from "./user-table-skeleton";
import { UserTable } from "./user-table";
import { columns } from "./users-columns";


export type UserWithDetails = {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    banned: boolean;
    banReason?: string;
    banExpires?: Date | null;
    accounts: string[];
    lastSignIn: Date | null;
    createdAt: Date;
    avatarUrl: string;
    role?: string;
};

export default function UsersClient() {
    const [loading, setLoading] = React.useState(true);
    const [users, setUsers] = React.useState<UserWithDetails[]>([]);
    const [total, setTotal] = React.useState(0);

    // ✅ server-side controlled states
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [role, setRole] = React.useState<string | undefined>(undefined);
    const [sortBy, setSortBy] = React.useState("createdAt");
    const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
        "desc"
    );

    async function loadData() {
        setLoading(true);

        const url = new URL("/api/user", window.location.origin);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", String(pageSize));

        if (search) url.searchParams.set("name", search);
        if (role) url.searchParams.set("role", role);

        url.searchParams.set("sortBy", sortBy);
        url.searchParams.set("sortDirection", sortDirection);

        const res = await fetch(url.toString());
        const json = await res.json();

        setUsers(json.users);
        setTotal(json.total);
        setLoading(false);
    }

    React.useEffect(() => {
        loadData();
    }, [page, pageSize, search, role, sortBy, sortDirection]);

    return (
        <div className="space-y-4 mt-6">
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
                    toolbar={{
                        search,
                        setSearch,
                        role,
                        setRole,
                    }}
                />
            )}
        </div>
    );
}
