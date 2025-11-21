'use client '
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import { useDialog } from '@/context/dialog-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { columns } from './apar-columns'


const fetcher = (url: string) => fetch(url).then(r => r.json())

export function AparDataTable() {
    const { open } = useDialog()

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')
    const [lantai, setLantai] = useState('')
    const [jenis, setJenis] = useState('')
    const [sizeMin, setSizeMin] = useState('')
    const [sizeMax, setSizeMax] = useState('')

    const query = useMemo(() => {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('pageSize', String(pageSize))

        if (search) params.set('search', search)
        if (lantai) params.set('lantai', lantai)
        if (jenis) params.set('jenis', jenis)
        if (sizeMin) params.set('sizeMin', sizeMin)
        if (sizeMax) params.set('sizeMax', sizeMax)

        return params.toString()
    }, [page, pageSize, search, lantai, jenis, sizeMin, sizeMax])

    const { data, mutate } = useSWR(`/api/apar?${query}`, fetcher, { revalidateOnFocus: false })

    const items = data?.data ?? []
    const total = data?.total ?? 0

    return (
        <div className="mt-6">
            {/* FILTERS */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Cari kode/lokasi..." className="w-48" />
                <Input value={lantai} onChange={(e) => { setLantai(e.target.value); setPage(1) }} placeholder="Lantai" className="w-32" />
                <select value={jenis} onChange={(e) => { setJenis(e.target.value); setPage(1) }} className="border rounded px-2 w-32 h-10">
                    <option value="">Jenis</option>
                    <option value="CABUT">CABUT</option>
                    <option value="CO2">CO2</option>
                    <option value="DRY">DRY</option>
                </select>
                <Input value={sizeMin} onChange={(e) => { setSizeMin(e.target.value); setPage(1) }} placeholder="size min" className="w-24" />
                <Input value={sizeMax} onChange={(e) => { setSizeMax(e.target.value); setPage(1) }} placeholder="size max" className="w-24" />
            </div>

            {/* TABLE */}
            <div className="overflow-auto">
                <table className="min-w-full divide-y">
                    <thead className="bg-muted">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={col.id ?? idx} className="px-3 py-2 text-left text-sm font-medium">{col.header as string}</th>
                            ))}
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any) => (
                            <tr key={item.id} className="border-b">
                                <td className="px-3 py-2">{item.kode_apar}</td>
                                <td className="px-3 py-2">{item.lantai}</td>
                                <td className="px-3 py-2">{item.lokasi}</td>
                                <td className="px-3 py-2">{item.jenis}</td>
                                <td className="px-3 py-2">{item.size}</td>
                                <td className="px-3 py-2">{new Date(item.updatedAt).toLocaleString()}</td>
                                <td className="px-3 py-2 flex gap-2">
                                    <Button size="sm" onClick={() => open('edit-apar', item)}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={async () => {
                                        if (!confirm('Hapus data?')) return
                                        await fetch(`/api/apar/${item.id}`, { method: 'DELETE' })
                                        mutate()
                                    }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between mt-4">
                <span>Showing {items.length} of {total}</span>
                <div className="flex gap-2">
                    <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                    <span className="px-2 py-1">Page {page}</span>
                    <Button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>Next</Button>
                    <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }} className="border rounded px-2 h-10">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
