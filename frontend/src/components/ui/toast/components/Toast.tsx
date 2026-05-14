import type { ToastItem } from "../types/toast";

interface ToastProps {
    toast: ToastItem;
}

const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
};

export default function Toast({ toast }: ToastProps) {
    return (
        <div className={`toast toast-${toast.type}`}>
            <span>{icons[toast.type]}</span>
            <span>{toast.message}</span>
        </div>
    );
}