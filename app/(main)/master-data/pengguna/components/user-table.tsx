"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import useSWR from "swr"


import { UserTableSkeleton } from "./user-table-skeleton"

import { UserTableFilters } from "./user-table-filters"
import { DataTable } from "@/components/datatable/data-table"
import { userTableColumns } from "./users-columns"
import { UserTableError } from "./user-table-error"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function UsersDataTable() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // State untuk filter
    const [role, setRole] = useState(searchParams.get("role") || "all")
    const [status, setStatus] = useState(searchParams.get("status") || "all")
    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1)
    const limit = 10

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    // Update URL ketika filter berubah
    useEffect(() => {
        const params = new URLSearchParams()
        if (role && role !== "all") params.set("role", role)
        if (status && status !== "all") params.set("status", status)
        if (debouncedSearch) params.set("search", debouncedSearch)
        if (page > 1) params.set("page", String(page))
        params.set("limit", String(limit))

        const newUrl = `?${params.toString()}`
        router.replace(newUrl, { scroll: false })
    }, [role, status, debouncedSearch, page, router])

    // Build SWR key dengan semua parameter
    const swrKey = useMemo(() => {
        const params = new URLSearchParams()
        if (role && role !== "all") params.set("role", role)
        if (status && status !== "all") params.set("status", status)
        if (debouncedSearch) params.set("search", debouncedSearch)
        params.set("page", String(page))
        params.set("limit", String(limit))
        return `/api/user?${params.toString()}`
    }, [role, status, debouncedSearch, page, limit])

    const { data, error, mutate, isLoading, isValidating } = useSWR(swrKey, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 2000,
        keepPreviousData: true,
    })

    const users = data?.users || []
    console.log("Users Data:", users);

    if (error) {
        return <UserTableError onRetry={() => mutate()} />
    }

    return (
        <div className="space-y-6">
            <UserTableFilters
                search={search}
                onSearchChange={(value) => {
                    setSearch(value)
                    setPage(1)
                }}
                role={role}
                onRoleChange={(value) => {
                    setRole(value)
                    setPage(1)
                }}
                status={status}
                onStatusChange={(value) => {
                    setStatus(value)
                    setPage(1)
                }}
                onRefresh={() => mutate()}
                onExport={() => {
                    // Export logic here
                }}
                isValidating={isValidating}
                isLoading={isLoading}
            />

            {isLoading ? (
                <UserTableSkeleton />
            ) : (
                <div className="rounded-md border p-3">
                    <DataTable
                        columns={userTableColumns(mutate)}
                        data={users}
                    />
                </div>
            )}
        </div>
    )
}