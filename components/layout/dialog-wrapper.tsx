'use client'

import { DialogProvider } from "@/context/dialog-provider"
import { ReactNode } from "react"

type DialogWrapperProps = {
    children: ReactNode
}
export default function DialogWrapper({ children }: DialogWrapperProps) {
    return (
        <DialogProvider>
            {children}
        </DialogProvider>
    )
}
