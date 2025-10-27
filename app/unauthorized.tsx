"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function UnauthorizedPage() {
    const pathname = usePathname();

    return (
        <main className="flex grow items-center justify-center px-4 text-center mx-auto h-screen">
            <div className="space-y-6">
                <Image src="/images/401 Error Unauthorized-cuate.svg" alt="401 - Unauthorized" width={450} height={350} className="w-[450px] mb-4" priority />
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">401 - Unauthorized</h1>
                    <p className="text-muted-foreground">Please sign in to continue.</p>
                </div>
                <div>
                    <Button asChild>
                        <Link href={`/?redirect=${pathname}`}>Sign in</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
