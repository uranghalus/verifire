'use client';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import React from 'react'
import { toast } from 'sonner';

export default function Dashboard() {
    const onClick = () => {
        toast.error("Test Toast", {
            description: "Ini adalah deskripsi dari toast",
        });
    };

    return (
        <div>
            <Button onClick={onClick}>Test Toast</Button>
        </div>
    );
}
