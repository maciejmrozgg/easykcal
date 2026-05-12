import { useState } from "react";
import type { ToastItem, ToastType } from "../types/toast";
import { ToastContext } from "./ToastContext";
import ToastContainer from "../components/ToastContainer";

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showToast = (message: string, type: ToastType) => {
        const id = Date.now();

        const newToast: ToastItem = {
            id,
            message,
            type,
        };

        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
}