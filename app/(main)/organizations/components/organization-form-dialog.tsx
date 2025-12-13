/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useEffect } from 'react'
import { OrganizationForm, organizationSchema } from '../data/schema'
import { useDialog } from '@/context/dialog-provider'
import { useOrganizations } from '@/hooks/crud/use-organization'

export function OrganizationFormDialog() {
    const { open, setOpen, currentRow, setCurrentRow } = useDialog<any>()
    const { mutate } = useOrganizations()

    const isEdit = open === 'edit'

    const form = useForm<OrganizationForm>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    })

    useEffect(() => {
        if (isEdit && currentRow) {
            form.reset({
                name: currentRow.name,
                slug: currentRow.slug,
            })
        }
    }, [isEdit, currentRow, form])

    async function onSubmit(values: OrganizationForm) {
        await fetch(
            isEdit
                ? '/api/organizations/update'
                : '/api/organizations/create',
            {
                method: 'POST',
                body: JSON.stringify(
                    isEdit ? { id: currentRow.id, ...values } : values
                ),
            }
        )

        await mutate()
        setOpen(null)
        setCurrentRow(null)
        form.reset()
    }

    return (
        <Dialog open={open === 'add' || open === 'edit'} onOpenChange={() => setOpen(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Organization' : 'Create Organization'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Organization Name" {...form.register('name')} />
                    <Input placeholder="Slug" {...form.register('slug')} />

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => setOpen(null)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
