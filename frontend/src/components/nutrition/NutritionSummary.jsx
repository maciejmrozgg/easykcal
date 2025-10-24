import './styles/NutritionSummary.css';

export default function NutritionSummary({ selectedProducts }) {
  const totalKcal = parseFloat(
  selectedProducts.reduce((sum, p) => sum + (p.result || 0), 0).toFixed(2)
);

  return (
    <div className="nutrition-summary">
      <h2>Podsumowanie kalorii</h2>
      <div className="products-grid">
        {selectedProducts.map((product, index) => (
          <div key={index} className="product-card-wrapper">
            <div className="product-card">
              <div className="product-name">{product.name}</div>
              <div className="product-kcal">{product.weight} g - {product.result.toFixed(2)} kcal</div>
            </div>
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
