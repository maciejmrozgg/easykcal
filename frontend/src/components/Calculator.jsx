import { useState, useEffect } from 'react'; //import hooków (specjalnych funkcji Reacta)

export default function Calculator() { //komponent 
  const [products, setProducts] = useState([]); //tworzy stan lokalny komponentu gdzie products to aktualna wartosc, a setProducts to funkcja do jej aktualizacji.Wartosc poczatkowa to pusta tablica.
  const [selectedProduct, setSelectedProduct] = useState(''); //wybrany produkt
  const [kcalPer100g, setKcalPer100g] = useState(''); //liczba kcal na 100g
  const [weight, setWeight] = useState(''); //waga
  const [result, setResult] = useState(null); //wynik
  const [error, setError] = useState(''); //błąd
  const [manualMode, setManualMode] = useState(false); // tryb ręcznego wpisywania kalorii
  const [filteredProducts, setFilteredProducts] = useState([]);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/calculate`, { //await - zaczekaj na odpowiedz serwera z backendu Express
        method: 'POST', //wysyłamy więc POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ //wysyłamy dane w formacie JSON
          kcalPer100g: Number(kcalPer100g),
          weight: Number(weight),
        }),
      });

      const data = await response.json(); //poczekaj az odpowiedz zamieni sie z JSON na obiekt
      if (!response.ok) throw new Error(data.error || 'Coś poszło nie tak'); //jesli coś poszło nie tak z odpowiedzią wyrzuć bład,zapisz błąd w data i wyświetl komunikat'Coś poszło nie tak'

      setResult(Math.round(data.result * 100) / 100); //na koniec do obiektu result dodaj dane z odpowiedzi z serwera czyli np. : 55, 100. Result będzie wynosić 55 kcal.
    } catch (err) { //co robic, gdy cos pojdzie nie tak:
      setError(err.message); //zmiana stanu - zapisanie do obiektu error wiadomosci z błędem
    }
  };

  return (
    <div>
      <h2>Kalkulator kalorii</h2>

      <button onClick={() => setManualMode(!manualMode)}> {/*zmiana stanu, która przyjmuje argument - negacja manualMode */}
        {manualMode ? 'Wybierz z listy produktów' : 'Wpisz kalorie ręcznie'} {/* operator trojargumentowy - jesli manualMode: true to wyswietl 'Wybierz z listy produktów', jeśli false to 'Wpisz kalorie ręcznie' */}
      </button>

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