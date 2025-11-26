// components/apar-action-dialog.tsx
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
import { SelectDropdown } from '@/components/select-dropdown'
import { jenisApar, sizes } from '../data/data'
import { Apar, JenisApar } from '../types/apar'


const formSchema = z.object({
    kode_apar: z.string().min(1, 'Kode APAR harus diisi'),
    lokasi: z.string().min(1, 'Lokasi harus diisi'),
    lantai: z.string().optional(),
    jenis: z.nativeEnum(JenisApar),
    size: z.string().min(1, 'Size harus dipilih'),
})

type AparForm = z.infer<typeof formSchema>

type AparActionDialogProps = {
    currentRow?: Apar
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AparActionDialog({
    currentRow,
    open,
    onOpenChange,
}: AparActionDialogProps) {
    const isEdit = !!currentRow

    const form = useForm<AparForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                kode_apar: currentRow.kode_apar,
                lokasi: currentRow.lokasi,
                lantai: currentRow.lantai || '',
                jenis: currentRow.jenis,
                size: currentRow.size.toString(),
            }
            : {
                kode_apar: '',
                lokasi: '',
                lantai: '',
                jenis: '' as JenisApar,
                size: '',
            },
    })

    const onSubmit = async (values: AparForm) => {
        try {
            const url = isEdit ? `/api/apar/${currentRow.id}` : '/api/apar'
            const method = isEdit ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    size: parseFloat(values.size),
                }),
            })

            if (response.ok) {
                form.reset()
                onOpenChange(false)

                // Refresh data dengan window.location.reload() atau callback
                if (typeof window !== 'undefined') {
                    window.location.reload()
                }
            } else {
                console.error('Failed to save APAR')
            }
        } catch (error) {
            console.error('Error saving APAR:', error)
        }
    }
    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>
                        {isEdit ? 'Edit APAR' : 'Tambah APAR Baru'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update data APAR' : 'Tambah data APAR baru'}.
                        Klik simpan ketika selesai.
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[80vh] overflow-y-auto py-1 pe-3'>
                    <Form {...form}>
                        <form
                            id='apar-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 px-0.5'
                        >
                            <FormField
                                control={form.control}
                                name='kode_apar'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Kode APAR
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='APAR-001'
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
                                name='lokasi'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Lokasi
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Gedung A, Ruang Server'
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
                                name='lantai'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Lantai
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Lantai 1'
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
                                name='jenis'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>Jenis</FormLabel>
                                        <SelectDropdown
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            placeholder='Pilih jenis APAR'
                                            className='col-span-4'
                                            items={jenisApar.map(({ label, value }) => ({
                                                label,
                                                value,
                                            }))}
                                        />
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='size'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>Size</FormLabel>
                                        <SelectDropdown
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            placeholder='Pilih size'
                                            className='col-span-4'
                                            items={sizes.map(({ label, value }) => ({
                                                label,
                                                value,
                                            }))}
                                        />
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type='submit' form='apar-form'>
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}