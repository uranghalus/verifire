'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'

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
import { OrganizationForm, organizationSchema } from '../data/schema'
import { createOrganization } from '@/hooks/crud/use-organization'
import { useDialog } from '@/context/dialog-provider'


export function CreateOrganizationDialog() {
    const { open, setOpen } = useDialog<null>()

    const [state, formAction] = useFormState(createOrganization, null)

    const form = useForm<OrganizationForm>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    })

    return (
        <Dialog
            open={open === 'add'}
            onOpenChange={(isOpen) => {
                if (!isOpen) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        action={formAction}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                onClick={() => setOpen(null)}
                            >
                                Cancel
                            </Button>

                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
