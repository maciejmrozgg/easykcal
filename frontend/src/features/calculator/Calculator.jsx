import { useState } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import './Calculator.css';
import { calculateCalories, calculateReverse } from './calculatorApi';
import { useProducts } from '../products/ProductsContext';

export default function Calculator( { addProduct }) {
  const { products } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState('');
  const [kcalPer100g, setKcalPer100g] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [reverseMode, setReverseMode] = useState(false);
  const [reverseCalories, setReverseCalories] = useState('');
  const [reverseKcalPer100g, setReverseKcalPer100g] = useState('');
  const [reverseResult, setReverseResult] = useState(null);
  const [lastReverseKcalPer100g, setLastReverseKcalPer100g] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const kcalNum = parseFloat(kcalPer100g);
    const weightNum = parseFloat(weight);

    if (!kcalPer100g || !weight || isNaN(kcalNum) || isNaN(weightNum)) {
      setError('Nieprawidłowa wartość kalorii lub wagi');
      return;
    }

    try {
      const calculated = await calculateCalories(kcalNum, weightNum);
      setResult(calculated);

      addProduct({
        name: selectedProduct || 'Ręcznie wprowadzony',
        kcalPer100g: kcalNum,
        weight: weightNum,
        result: calculated
      });

      setSelectedProduct('');
      setKcalPer100g('');
      setWeight('');
      setFilteredProducts([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReverseCalc = async (e) => {
    e.preventDefault();
    setError('');

    const reverseCaloriesNum = parseFloat(reverseCalories);
    const reverseKcalNum = parseFloat(reverseKcalPer100g);

    if (!reverseCalories || !reverseKcalPer100g || isNaN(reverseCaloriesNum) || isNaN(reverseKcalNum)) {
      setError('Nieprawidłowa wartość kalorii lub kcal/100g');
      return;
    }

    try {
      const weight = await calculateReverse(reverseCaloriesNum, reverseKcalNum);
      setReverseResult(weight);
      setLastReverseKcalPer100g(reverseKcalPer100g);
      setReverseCalories('');
      setReverseKcalPer100g('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Kalkulator kalorii</h2>

      <button onClick={() => setManualMode(!manualMode)}>
        {manualMode ? 'Wybierz z listy produktów' : 'Wpisz kalorie ręcznie'}
      </button>

      <button onClick={() => setReverseMode(!reverseMode)} className="swap-btn">
        <FaExchangeAlt /> {reverseMode ? 'Tryb kcal → g' : 'Tryb g → kcal'}
      </button>

      {/* Odwrócony kalkulator */}
      {reverseMode && (
        <form onSubmit={handleReverseCalc} className="reverse-calculator" style={{ marginTop: '1rem' }}>
          <h3>Przelicz kalorie na gramy</h3>
          <div>
            <label>Kalorie: </label>
            <input
              type="number"
              placeholder="Wpisz liczbę kalorii..."
              value={reverseCalories}
              onChange={(e) => setReverseCalories(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Kcal na 100g: </label>
            <input
              type="number"
              placeholder="Wpisz kalorie na 100g..."
              value={reverseKcalPer100g}
              onChange={(e) => setReverseKcalPer100g(e.target.value)}
              required
            />
          </div>

          <button type="submit">Oblicz</button>

          {reverseResult !== null && (
            <div className="reverse-result">
              {reverseResult.toFixed(2)} g 
              <span>(dla {lastReverseKcalPer100g} kcal/100g)</span>
            </div>
          )}
        </form>
      )}

      {/* Kalkulator */}
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {!manualMode ? (
          <div>
            <label>Produkt: </label>
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
                      // kontrolowany input zawsze string
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
            <label>Kalorie na 100g: </label>
            <input
              type="number"
              placeholder='Wpisz kalorie na 100g...'
              value={kcalPer100g}
              onChange={(e) => setKcalPer100g(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label>Waga (g): </label>
          <input
            type="number"
            placeholder='Wprowadź wagę...'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>

        <button type="submit">Oblicz</button> 
      </form>

      {result !== null && <div className="calorie-result">{result} kcal</div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}