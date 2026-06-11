import { useState, useEffect } from "react";
import "./ProductModal.css";
import BaseModal from "../../../ui/modal/BaseModal";
import type { Product, ProductFormData } from "../../../../types/product";

type ProductModalProps = {
    open: boolean;
    product: Product | null;

    onSave: (data: ProductFormData) => Promise<void>;
    onDelete: () => Promise<void>;
    onClose: () => void;
};

const ProductModal = ({ open, product, onSave, onDelete, onClose }: ProductModalProps) => {
    const [name, setName] = useState("");
    const [kcalPer100g, setKcalPer100g] = useState("");
    const [proteinPer100g, setProteinPer100g] = useState("");
    const [fatPer100g, setFatPer100g] = useState("");
    const [carbsPer100g, setCarbsPer100g] = useState("");

    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setKcalPer100g(String(product.kcalPer100g ?? ""));
            setProteinPer100g(String(product.proteinPer100g ?? ""));
            setFatPer100g(String(product.fatPer100g ?? ""));
            setCarbsPer100g(String(product.carbsPer100g ?? ""));
        } else {
            setName("");
            setKcalPer100g("");
            setProteinPer100g("");
            setFatPer100g("");
            setCarbsPer100g("");
        }
    }, [product]);

    if (!open) return null;

    const handleSave = () => {
        onSave({
            name,
            kcalPer100g: Number(kcalPer100g),
            proteinPer100g: Number(proteinPer100g),
            fatPer100g: Number(fatPer100g),
            carbsPer100g: Number(carbsPer100g),
        });
    };

    return (
        <BaseModal
            open={open}
            title="Edytuj produkt"
            onClose={onClose}
        >
            <label>
                Nazwa:
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </label>

            <label>
                Kalorie (na 100g):
                <input type="number" value={kcalPer100g} onChange={e => setKcalPer100g(e.target.value)} />
            </label>

            <label>
                Białko (na 100g):
                <input type="number" value={proteinPer100g} onChange={e => setProteinPer100g(e.target.value)} />
            </label>

            <label>
                Tłuszcze (na 100g):
                <input type="number" value={fatPer100g} onChange={e => setFatPer100g(e.target.value)} />
            </label>

            <label>
                Węglowodany (na 100g):
                <input type="number" value={carbsPer100g} onChange={e => setCarbsPer100g(e.target.value)} />
            </label>

            <div className="modal-buttons">
                {product && <button className="delete" onClick={onDelete}>Usuń</button>}
                <button className="cancel" onClick={onClose}>Anuluj</button>
                <button className="save" onClick={handleSave}>Zapisz</button>
            </div>
        </BaseModal >
    );
};

export default ProductModal;