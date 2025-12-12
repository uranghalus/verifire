"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { useDialog } from "@/context/dialog-provider";
import { createOrganization } from "../data/actions";

export function AddDialog() {
    const { open, setOpen } = useDialog();
    const [name, setName] = useState("");

    async function submit() {
        await createOrganization({
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
        });

        setOpen(null);
        setName("");
    }

    return (
        <Dialog open={open === "add"} onOpenChange={() => setOpen(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Organisasi</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="Nama organisasi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Button className="w-full mt-4" onClick={submit}>
                    Simpan
                </Button>
            </DialogContent>
        </Dialog>
    );
}

