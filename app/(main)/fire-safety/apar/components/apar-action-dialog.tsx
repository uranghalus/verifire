// app/apar/components/apar-action-dialog.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Apar, AparFormData, JenisApar } from '../types/apar'
import { createAparMutation, updateAparMutation } from '../hooks/use-apar'


const formSchema = z.object({
    kode_apar: z.string().min(1, 'Kode APAR harus diisi'),
    lantai: z.string().optional(),
    lokasi: z.string().min(1, 'Lokasi harus diisi'),
    jenis: z.nativeEnum(JenisApar, {
        error: 'Jenis harus dipilih'
    }),
    size: z.coerce.number().min(0.1, 'Size harus lebih dari 0'),
})

type FormValues = z.infer<typeof formSchema>

interface AparActionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentApar?: Apar | null
    onSuccess?: () => void
}

export function AparActionDialog({
    open,
    onOpenChange,
    currentApar,
    onSuccess
}: AparActionDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const isEdit = !!currentApar

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        defaultValues: {
            kode_apar: '',
            lantai: '',
            lokasi: '',
            jenis: JenisApar.POWDER,
            size: 1,
        }
    })

    // Reset form ketika dialog dibuka/ditutup atau currentApar berubah
    useEffect(() => {
        if (open) {
            if (isEdit && currentApar) {
                form.reset({
                    kode_apar: currentApar.kode_apar,
                    lantai: currentApar.lantai || '',
                    lokasi: currentApar.lokasi,
                    jenis: currentApar.jenis,
                    size: currentApar.size,
                })
            } else {
                form.reset({
                    kode_apar: '',
                    lantai: '',
                    lokasi: '',
                    jenis: JenisApar.POWDER,
                    size: 1,
                })
            }
        }
    }, [open, isEdit, currentApar, form])

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        try {
            if (isEdit && currentApar) {
                await updateAparMutation(currentApar.id, values)
                toast.success('APAR berhasil diupdate')
            } else {
                await createAparMutation(values)
                toast.success('APAR berhasil dibuat')
            }
            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit APAR' : 'Tambah APAR'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update data APAR di sini.'
                            : 'Tambahkan data APAR baru di sini.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="kode_apar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kode APAR</FormLabel>
                                    <FormControl>
                                        <Input placeholder="APAR-001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lokasi"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lokasi</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lobi Utama" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lantai"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lantai</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lantai 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="jenis"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jenis</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={JenisApar.POWDER}>Powder</SelectItem>
                                                <SelectItem value={JenisApar.FOAM}>Foam</SelectItem>
                                                <SelectItem value={JenisApar.CO2}>CO2</SelectItem>
                                                <SelectItem value={JenisApar.WET_CHEMICAL}>Wet Chemical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Size (kg)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                placeholder="1"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}