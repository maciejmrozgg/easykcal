import { useState, useEffect } from 'react'; //import hooków (specjalnych funkcji Reacta)
import { FaExchangeAlt } from 'react-icons/fa';
import './Calculator.css';

export default function Calculator( {addProduct }) { //komponent 
  const [products, setProducts] = useState([]); //tworzy stan lokalny komponentu gdzie products to aktualna wartosc, a setProducts to funkcja do jej aktualizacji.Wartosc poczatkowa to pusta tablica.
  const [selectedProduct, setSelectedProduct] = useState(''); //wybrany produkt
  const [kcalPer100g, setKcalPer100g] = useState(''); //liczba kcal na 100g
  const [weight, setWeight] = useState(''); //waga
  const [result, setResult] = useState(null); //wynik
  const [error, setError] = useState(''); //błąd
  const [manualMode, setManualMode] = useState(false); // tryb ręcznego wpisywania kalorii
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [reverseMode, setReverseMode] = useState(false);
  const [reverseCalories, setReverseCalories] = useState('');
  const [reverseKcalPer100g, setReverseKcalPer100g] = useState('');
  const [reverseResult, setReverseResult] = useState(null);
  const [lastReverseKcalPer100g, setLastReverseKcalPer100g] = useState('');

  // Pobieranie listy produktów
  useEffect(() => { //useEffect działa po renderze komponentu, tutaj tylko raz, bo przekazaliśmy []. Być może do zmiany, zeby po dodaniu produktu bez przeładowania aktualizowała się lista?
    const fetchProducts = async () => { //wywołanie funkcji asynchronicznej, która wykona się po przełądowaniu strony(tylko raz pobierze wszystkie produkty)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`); //await - zaczekaj na odpowiedz serwera z backendu Express
        const data = await res.json(); //do zmiennej stalej "data" zapisujemy zawartość zwróconej odpowiedzi w formacie JSON,która zamieni sie z JSON na obiekt
        setProducts(data); //aktualizacja stanu produktów(data - dane które otrzymaliśmy w odpowiedzi(zmienione z JSON na obiekt) z GET)
      } catch {
        setError('Błąd pobierania produktów'); //jeśli coś pojdzie nie tak: aktualizacja stanu error
      }
    };
    fetchProducts(); //to wywołanie funkcji, więc cała logika asynchroniczna w niej zawarta zostanie uruchomiona w momencie montowania komponentu
  }, []); // [] oznacza, że useEffect uruchomi się tylko raz po montażu komponentu

  const handleSubmit = async (e) => { //funkcja wywolywana na event onSubmit
    e.preventDefault(); //blokuje domyślne zachowanie formularza, czyli przeładowanie strony po kliknięciu submit. Dzięki temu możemy obsłużyć formularz w React, bez utraty stanu aplikacji.
    setError(''); //zmiana stanu (ustawienie tak jak bylo domyslnie)
    setResult(null); //zmiana stanu (ustawienie tak jak bylo domyslnie)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/calculator/calculate`, { //await - zaczekaj na odpowiedz serwera z backendu Express
        method: 'POST', //wysyłamy więc POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ //wysyłamy dane w formacie JSON
          kcalPer100g: Number(kcalPer100g),
          weight: Number(weight),
        }),
      });

      const data = await response.json(); //poczekaj az odpowiedz zamieni sie z JSON na obiekt
      if (!response.ok) throw new Error(data.error || 'Coś poszło nie tak'); //jesli coś poszło nie tak z odpowiedzią wyrzuć bład,zapisz błąd w data i wyświetl komunikat'Coś poszło nie tak'

      const calculatedResult = (Math.round(data.result * 100) / 100); //na koniec do obiektu result dodaj dane z odpowiedzi z serwera czyli np. : 55, 100. Result będzie wynosić 55 kcal.
      setResult(calculatedResult);

      // dodanie produktu do NutritionSummary
      addProduct({
      name: selectedProduct || 'Ręcznie wpisany produkt',
      kcal: calculatedResult,
    });

      // opcjonalnie wyczyszczenie formularza
      setSelectedProduct('');
      setKcalPer100g('');
      setWeight('');
      setFilteredProducts([]);

    } catch (err) { //co robic, gdy cos pojdzie nie tak:
      setError(err.message); //zmiana stanu - zapisanie do obiektu error wiadomosci z błędem
    }
  };

  //Funkcja do obliczeń(odwrotny kalkulator)
  const handleReverseCalc = async (e) => {
  e.preventDefault();
  setError('');

  if (!reverseCalories || !reverseKcalPer100g) {
    setError('Podaj wszystkie wartości');
    return;
  }

  try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/calculator/calculate-reverse`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          calories: Number(reverseCalories),
          kcalPer100g: Number(reverseKcalPer100g),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Coś poszło nie tak');
      
      setReverseResult(Math.round(data.weight * 100) / 100);
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