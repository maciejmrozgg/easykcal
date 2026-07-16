import { useState, useEffect } from "react";
import "./IngredientModal.css";
import BaseModal from "../../../../ui/modal/BaseModal";
import { useProducts } from "../../../../products/hooks/useProducts";

const IngredientModal = ({ open, initialData, onSave, onDelete, onClose }) => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const { products } = useProducts();

  const selectedProduct = products.find(
    p => String(p.id) === selectedProductId
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setWeight(initialData.weight || "");
      setKcal(initialData.kcal || "");
      setProtein(initialData.protein || "");
      setFat(initialData.fat || "");
      setCarbs(initialData.carbs || "");
      setSelectedProductId(initialData.productId || "");
    } else {
      setName("");
      setWeight("");
      setKcal("");
      setProtein("");
      setFat("");
      setCarbs("");
      setSelectedProductId("");
    }
  }, [initialData, open]);

  useEffect(() => {
    if (!selectedProduct) return;

    setName(selectedProduct.name);
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct || !weight) return;

    const weightValue = Number(weight);

    setKcal(
      Math.round((selectedProduct.kcalPer100g * weightValue) / 100)
    );

    setProtein(
      Number(
        ((selectedProduct.proteinPer100g || 0) * weightValue / 100)
          .toFixed(1)
      )
    );

    setFat(
      Number(
        ((selectedProduct.fatPer100g || 0) * weightValue / 100)
          .toFixed(1)
      )
    );

    setCarbs(
      Number(
        ((selectedProduct.carbsPer100g || 0) * weightValue / 100)
          .toFixed(1)
      )
    );

  }, [selectedProduct, weight]);

  if (!open) return null;

  const handleSave = () => {
    onSave({ name, weight: Number(weight), kcal: Number(kcal), protein: Number(protein), fat: Number(fat), carbs: Number(carbs), productId: selectedProductId || null });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <BaseModal
      open={open}
      title={initialData ? "Edytuj składnik" : "Dodaj składnik"}
      onClose={onClose}
    >
      <label>
        Nazwa:
        <input type="text" value={name} onChange={e => {
          setName(e.target.value);
          if (selectedProductId) {
            setSelectedProductId("");
          }
        }} />

        {/*  Product suggestions */}
        {name.length >= 2 && !selectedProductId && filteredProducts.length > 0 && (
          <div className="product-suggestions">
            {filteredProducts.slice(0, 5).map(product => (
              <div
                key={product.id}
                className="product-suggestion"
                onClick={() => {
                  setSelectedProductId(String(product.id));
                  setName(product.name);
                }}
              >
                <span>{product.name} </span>
                <span className="product-suggestion-kcal">
                  {product.kcalPer100g} kcal / 100g
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`ingredient-source ${selectedProductId
            ? "ingredient-source-product"
            : "ingredient-source-manual"
            }`}
        >
          {selectedProductId ? "📦 Produkt z bazy" : "📝 Ręczny składnik"}
        </div>
      </label>

      <label>
        Waga (g):
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
      </label>

      <label>
        Kalorie:
        <input type="number" value={kcal} onChange={e => setKcal(e.target.value)} />
      </label>

      <label>
        Białko:
        <input
          type="number"
          value={protein}
          onChange={e => setProtein(e.target.value)}
        />
      </label>

      <label>
        Tłuszcz:
        <input
          type="number"
          value={fat}
          onChange={e => setFat(e.target.value)}
        />
      </label>

      <label>
        Węglowodany:
        <input
          type="number"
          value={carbs}
          onChange={e => setCarbs(e.target.value)}
        />
      </label>

      <label>
        Produkt z bazy:
        <select
          className="product-select"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">-- wybierz produkt --</option>

          {products.map(product => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name}
            </option>
          ))}
        </select>
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
