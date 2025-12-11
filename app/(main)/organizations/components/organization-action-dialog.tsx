'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { Input } from '@/components/ui/input'
import { Organization } from '@/generated/prisma'
import { toast } from 'sonner'
import { useOrganizations } from '../hooks/organization-client'

const formSchema = z.object({
    name: z.string().min(1, 'Nama organisasi harus diisi'),
    slug: z.string()
        .min(1, 'Slug harus diisi')
        .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
})

type OrganizationForm = z.infer<typeof formSchema>

type OrganizationActionDialogProps = {
    currentRow?: Organization
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrganizationActionDialog({
    currentRow,
    open,
    onOpenChange,
}: OrganizationActionDialogProps) {
    const isEdit = !!currentRow
    const { mutate } = useOrganizations()

    const form = useForm<OrganizationForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                name: currentRow.name,
                slug: currentRow.slug,
            }
            : {
                name: '',
                slug: '',
            },
    })

    const onSubmit = async (values: OrganizationForm) => {
        try {
            const url = isEdit ? `/api/organizations/${currentRow.id}` : '/api/organizations'
            const method = isEdit ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result = await response.json()

            if (response.ok) {
                form.reset()
                onOpenChange(false)

                // Refresh data dengan mutate
                mutate()

                toast.success(
                    isEdit
                        ? 'Organisasi berhasil diperbarui'
                        : 'Organisasi berhasil ditambahkan'
                )
            } else {
                toast.error(result.error || 'Gagal menyimpan organisasi')
            }
        } catch (error) {
            console.error('Error saving organization:', error)
            toast.error('Terjadi kesalahan saat menyimpan organisasi')
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) {
                    form.reset()
                }
                onOpenChange(state)
            }}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>
                        {isEdit ? 'Edit Organisasi' : 'Tambah Organisasi Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update data organisasi' : 'Tambah data organisasi baru'}.
                        Klik simpan ketika selesai.
                    </DialogDescription>
                </DialogHeader>

                <div className='max-h-[80vh] overflow-y-auto py-1 pe-3'>
                    <Form {...form}>
                        <form
                            id='organization-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 px-0.5'
                        >
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Nama Organisasi
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Nama perusahaan atau tim'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='slug'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Slug
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='nama-organisasi'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>

                <DialogFooter>
                    <Button
                        type='submit'
                        form='organization-form'
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}