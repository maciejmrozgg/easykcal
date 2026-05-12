import type { ToastItem } from "../types/toast";

interface ToastProps {
    toast: ToastItem;
}

export default function Toast({ toast }: ToastProps) {
    return (
        <div className={`toast toast-${toast.type}`}>
            {toast.message}
        </div>
    );
}