import '../styles/CalorieForm.css';
import '../styles/ProductSuggestions.css';

export default function CalorieForm({
  manualMode,
  products,
  selectedProduct,
  setSelectedProduct,
  kcalPer100g,
  setKcalPer100g,
  weight,
  setWeight,
  filteredProducts,
  setFilteredProducts,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit} className="calculator" style={{ marginTop: '1rem' }}>
      <h3>Przelicz gramy na kalorie</h3>

      {!manualMode ? (
        <div>
          <label>Produkt:</label>
          <input
            type="text"
            value={selectedProduct}
            onChange={(e) => {
              setSelectedProduct(e.target.value);
              const filtered = products.filter((p) =>
                p.name.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setFilteredProducts(filtered);
            }}
            placeholder="Wpisz nazwę produktu..."
          />

          {selectedProduct && filteredProducts.length > 0 && (
            <ul className="product-suggestions">
              {filteredProducts.map((p) => (
                <li
                  key={p.id}
                  style={{ listStyle: 'none', padding: '0.2rem', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedProduct(p.name);
                    setKcalPer100g(p.kcalPer100g?.toString() || '');
                    setWeight('');
                    setFilteredProducts([]);
                  }}
                >
                  {p.name} ({p.kcalPer100g} kcal/100g)
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <label>Kalorie na 100g:</label>
          <input
            type="number"
            placeholder="Wpisz kalorie na 100g..."
            value={kcalPer100g}
            onChange={(e) => setKcalPer100g(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label>Waga (g):</label>
        <input
          type="number"
          placeholder="Wprowadź wagę..."
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>

      <button type="submit">Oblicz</button>
    </form>
  );
}