import { useState, useEffect } from "react";
import "./IngredientModal.css";
import BaseModal from "../../../../ui/modal/BaseModal";

const IngredientModal = ({ open, initialData, onSave, onDelete, onClose }) => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [kcal, setKcal] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setWeight(initialData.weight || "");
      setKcal(initialData.kcal || "");
    } else {
      setName("");
      setWeight("");
      setKcal("");
    }
  }, [initialData]);

  if (!open) return null;

  const handleSave = () => {
    onSave({ name, weight: Number(weight), kcal: Number(kcal) });
  };

  return (
    <BaseModal
      open={open}
      title={initialData ? "Edytuj składnik" : "Dodaj składnik"}
      onClose={onClose}
    >
      <label>
        Nazwa:
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </label>

      <label>
        Waga (g):
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
      </label>

      <label>
        Kalorie:
        <input type="number" value={kcal} onChange={e => setKcal(e.target.value)} />
      </label>

      <div className="modal-buttons">
        {initialData && <button className="delete" onClick={onDelete}>Usuń</button>}
        <button className="cancel" onClick={onClose}>Anuluj</button>
        <button className="save" onClick={handleSave}>Zapisz</button>
      </div>
    </BaseModal >
  );
};

export default IngredientModal;
