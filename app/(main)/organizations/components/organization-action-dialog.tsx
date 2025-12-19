'use client'

import { useActionState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import {
    OrganizationForm,
    organizationSchema,
} from '../data/schema'
import {
    createOrganization,
    updateOrganization,
} from '@/hooks/crud/use-organization'
import { Organization } from '../types/organization'
import { useAutoSlug } from '@/hooks/use-auto-slug'

interface Props {
    currentRow?: Organization | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrganizationActionDialog({
    open,
    onOpenChange,
    currentRow,
}: Props) {
    const isEdit = !!currentRow

    const action = isEdit
        ? updateOrganization
        : createOrganization

    const [state, formAction] = useActionState(action, null)

    const form = useForm<OrganizationForm>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
        mode: 'onChange', // 🔑 PENTING
    })

    // ✅ SATU-SATUNYA AUTO SLUG
    const autoSlug = useAutoSlug(form, isEdit)
    // reset auto slug saat dialog ditutup
    useEffect(() => {
        if (!open) autoSlug.reset()
    }, [autoSlug, open])

    // prefill saat edit
    useEffect(() => {
        if (isEdit && currentRow) {
            form.reset({
                name: currentRow.name,
                slug: currentRow.slug,
            })
        } else {
            form.reset({
                name: '',
                slug: '',
            })
        }
    }, [isEdit, currentRow, form])

    // close on success
    useEffect(() => {
        if (state?.status === 'success') {
            form.reset()
            onOpenChange(false)
        }
    }, [state, form, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Unit Bisnis' : 'Tambah Unit Bisnis'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form action={formAction} className="space-y-4">
                        {isEdit && (
                            <input
                                type="hidden"
                                name="id"
                                value={currentRow?.id}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ }) => (
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => autoSlug.onNameChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => autoSlug.onSlugChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {state?.status === 'error' && (
                            <p className="text-sm text-red-500">
                                {state.message}
                            </p>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {isEdit ? 'Update' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
