import { Toaster } from "@/components/ui/sonner";

const toastOptions = {
    classNames: {
        title: '!text-base !font-bold !text-white',
        description: '!text-sm !text-white',
        icon: '!text-white',
        toast: '!text-sm !text-white !rounded-lg !p-4 gap-5 border-none',
        success: '!bg-teal-500',
        error: '!bg-red-500',
        warning: '!bg-yellow-500',
        info: '!bg-blue-600',
    },
};
export default function ToastProvider() {
    return <Toaster position="top-right" toastOptions={toastOptions} />;
}
