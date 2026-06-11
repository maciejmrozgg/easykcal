import { useState, useEffect } from "react";
import "./CategoryModal.css";
import type { Category } from "../../../../../types/category";
import BaseModal from "../../../../ui/modal/BaseModal";

type CategoryModalProps = {
    open: boolean;

    category: Category | null;

    onSave: (name: string) => Promise<void>;
    onDelete: () => Promise<void>;
    onClose: () => void;
};

const CategoryModal = ({
    open,
    category,
    onSave,
    onDelete,
    onClose
}: CategoryModalProps) => {
    const [name, setName] = useState<string>("");

    useEffect(() => {
        if (category) {
            setName(category.name || "");
        } else {
            setName("");
        }
    }, [category]);

    if (!open) return null;

    const handleSave = () => {
        if (!name.trim()) return;
        onSave(name.trim());
    };

    return (
        <BaseModal
            open={open}
            title={category ? "Edytuj kategorię" : "Dodaj kategorię"}
            onClose={onClose}
        >
            <label>
                Nazwa:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
            </label>

            <div className="modal-buttons">
                {category && (
                    <button
                        className="delete"
                        onClick={() => {
                            const confirmed = window.confirm(
                                `Czy na pewno chcesz usunąć kategorię "${category.name}"?\n\nPrzepisy z tej kategorii trafią do kafelka 'Bez kategorii'`
                            );

                            if (confirmed) {
                                onDelete();
                            }
                        }}
                    >
                        Usuń
                    </button>
                )}
                <button className="cancel" onClick={onClose}>
                    Anuluj
                </button>
                <button className="save" onClick={handleSave}>
                    Zapisz
                </button>
            </div>
        </BaseModal>
    );
};

export default CategoryModal;