import { useState, useEffect } from "react";
import "../../styles/CategoryModal.css";
import type { Category } from "../../../../../types/category";

type CategoryModalProps = {
    open: boolean;

    category: Category | null;

    onSave:(name: string) => Promise<void>;
    onDelete:() => Promise<void>;
    onClose: () => void;
};

const CategoryModal = ({
    open,
    category,
    onSave,
    onDelete,
    onClose
}: CategoryModalProps ) => {
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
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>
                    {category ? "Edytuj kategorię" : "Dodaj kategorię"}
                </h2>

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
            </div>
        </div>
    );
};

export default CategoryModal;