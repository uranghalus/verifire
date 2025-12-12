/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { useDialog } from "@/context/dialog-provider";
import { updateOrganization } from "../data/actions";

export function EditDialog() {
    const { open, setOpen, currentRow } = useDialog<any>();
    const [name, setName] = useState("");

    useEffect(() => {
        if (currentRow) setName(currentRow.name);
    }, [currentRow]);

    async function submit() {
        await updateOrganization(currentRow.id, {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
        });

        setOpen(null);
    }

    return (
        <Dialog open={open === "edit"} onOpenChange={() => setOpen(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Organisasi</DialogTitle>
                </DialogHeader>

                <Input value={name} onChange={(e) => setName(e.target.value)} />

                <Button className="w-full mt-4" onClick={submit}>
                    Update
                </Button>
            </DialogContent>
        </Dialog>
    );
}
