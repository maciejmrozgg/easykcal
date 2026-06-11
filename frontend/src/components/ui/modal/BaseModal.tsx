import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import "./BaseModal.css";

type BaseModalProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

const BaseModal = ({
    open,
    onClose,
    title,
    children
}: BaseModalProps) => {

    if (!open) return null;

    return createPortal(
        <div
            className="modal-backdrop"
            onClick={onClose}
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{title}</h2>

                {children}
            </div>
        </div>,
        document.body
    );
};

export default BaseModal;