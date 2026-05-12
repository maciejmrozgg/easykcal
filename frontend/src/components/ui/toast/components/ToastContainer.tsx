import Toast from "./Toast";

import type { ToastItem } from "../types/toast";

import '../styles/Toast.css';

interface ToastContainerProps {
    toasts: ToastItem[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast 
                    key={toast.id}
                    toast={toast}
                />
            ))}
        </div>
    );
}