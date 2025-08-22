import { useState} from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import './Calculator.css';
import { calculateCalories, calculateReverse } from './calculatorApi';
import { useProducts } from '../products/ProductsContext';

export default function Calculator() {
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
    try {
      const calculated = await calculateCalories(kcalPer100g, weight);
      setResult(calculated);
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
    if (!reverseCalories || !reverseKcalPer100g) return setError('Podaj wszystkie wartości');
    try {
      const weight = await calculateReverse(reverseCalories, reverseKcalPer100g);
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

      <button onClick={() => setManualMode(!manualMode)}> {/*zmiana stanu, która przyjmuje argument - negacja manualMode */}
        {manualMode ? 'Wybierz z listy produktów' : 'Wpisz kalorie ręcznie'} {/* operator trojargumentowy - jesli manualMode: true to wyswietl 'Wybierz z listy produktów', jeśli false to 'Wpisz kalorie ręcznie' */}
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
                <span className="unit-hint">(dla {lastReverseKcalPer100g} kcal/100g)</span>
              </div>
            )}
          </form>
        )}
      {/* Kalkulator */}
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {!manualMode ? ( //jeśli nie w trybie manualnym to wyświetl:
          <div>
            <label>Produkt: </label>
            <input
              type="text"
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                // filtrujemy produkty do wyświetlenia w sugestiach
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
                      setKcalPer100g(p.kcal_per_100g);
                      setWeight('');
                      setFilteredProducts([]);
                    }}
                  >
                    {p.name} ({p.kcal_per_100g} kcal/100g)
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : ( //a jeśli w trybie manualnym to wyświetl:
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
          {/* wyświetlenie wyniku obliczeń */}
          {result !== null && (<div className="calorie-result">{result} kcal</div>
        )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}