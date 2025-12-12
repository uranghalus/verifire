/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteOrganization } from "../data/actions";
import { useDialog } from "@/context/dialog-provider";


export function DeleteDialog() {
    const { open, setOpen, currentRow } = useDialog<any>();

    async function submit() {
        await deleteOrganization(currentRow.id);
        setOpen(null);
    }

    return (
        <Dialog open={open === "delete"} onOpenChange={() => setOpen(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Organisasi</DialogTitle>
                </DialogHeader>

                <p className="text-sm">
                    Apakah Anda yakin ingin menghapus <b>{currentRow?.name}</b>?
                </p>

                <Button variant="destructive" className="mt-4 w-full" onClick={submit}>
                    Hapus
                </Button>
            </DialogContent>
        </Dialog>
    );
}
