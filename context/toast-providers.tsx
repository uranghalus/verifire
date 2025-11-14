import { Toaster } from "@/components/ui/sonner";
import {
    CheckCheck,
    CircleAlert,
    CircleSlash,
    InfoIcon,
    Loader,
} from "lucide-react";
import { ToasterProps } from "sonner";

// Responsive sizes
const iconWrapperBase =
    "flex items-center justify-center rounded-md shrink-0";
const iconWrapperSizes =
    "w-10 h-10 sm:w-11 sm:h-11"; // kecil di mobile, besar di desktop

const toastOption: ToasterProps = {
    toastOptions: {
        classNames: {
            icon:
                "!p-0 !m-0 flex items-center justify-center ",
            toast:
                "!p-3 !flex !gap-4 !items-center !sm:gap-5 !space-x-8", // konsisten jarak icon & content
            title: "!text-base !font-bold !text-[#434656]",
            description: "!text-sm !text-[#696984] mt-0",
            loading: "relative",
        },
    },

    icons: {
        success: (
            <div
                className={`${iconWrapperBase} ${iconWrapperSizes} bg-[#008a63] text-background`}
            >
                <CheckCheck className="size-6 sm:size-6" />
            </div>
        ),

        warning: (
            <div
                className={`${iconWrapperBase} ${iconWrapperSizes} bg-[#ffc864]`}
            >
                <CircleAlert className="size-6 sm:size-6" />
            </div>
        ),

        error: (
            <div
                className={`${iconWrapperBase} ${iconWrapperSizes} bg-[#ec486a] text-background`}
            >
                <CircleSlash className="size-6 sm:size-6" />
            </div>
        ),

        info: (
            <div
                className={`${iconWrapperBase} ${iconWrapperSizes} bg-[#3b82f6] text-background`}
            >
                <InfoIcon className="size-6 sm:size-6" />
            </div>
        ),

        loading: (
            <div
                className={`${iconWrapperBase} ${iconWrapperSizes} bg-[#434656] text-background`}
            >
                <Loader className="size-6 sm:size-6 animate-spin" />
            </div>
        ),
    },
};

export default function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={toastOption.toastOptions}
            icons={toastOption.icons}
        />
    );
}
