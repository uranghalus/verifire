import React from 'react'
import { FourSquare } from "react-loading-indicators";

export default function Loading() {
    return (
        <div className='flex min-h-svh items-center justify-center p-6'>
            <FourSquare color="#3b82f6" size="medium" text="Mohon Tunggu Sebentar..." textColor="" />
        </div>
    )
}
