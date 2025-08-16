export default function NutritionSummary({ selectedProducts }) {
  const totalKcal = parseFloat(
  selectedProducts.reduce((sum, p) => sum + p.kcal, 0).toFixed(2)
);

  return (
    <div className="nutrition-summary">
      <h2>Podsumowanie kalorii</h2>
      <div className="products-grid">
        {selectedProducts.map((product, index) => (
          <div key={index} className="product-card-wrapper">
            <div className="product-card">
              <div className="product-name">{product.name}</div>
              <div className="product-kcal">{product.kcal} kcal</div>
            </div>
            {/* Dodajemy + tylko jeśli to nie ostatni produkt */}
            {index < selectedProducts.length - 1 && <span className="plus">+</span>}
          </div>
        ))}

        {selectedProducts.length > 0 && (
          <div className="product-card total">
            <div className="product-name">Razem</div>
            <div className="product-kcal">{totalKcal} kcal</div>
          </div>
        )}
      </div>
    </div>
  );
}
