import { useState, useEffect } from 'react'; //import hookow

export default function ProductManager() { //komponent
  const [products, setProducts] = useState([]); //tworzy stan lokalny komponentu gdzie products to aktualna wartosc, a setProducts to funkcja do jej aktualizacji.Wartosc poczatkowa to pusta tablica.
  const [name, setName] = useState(''); //nazwa składnika
  const [kcalPer100g, setKcalPer100g] = useState(''); //kcal na 100g
  const [error, setError] = useState(''); //błąd
  const [search, setSearch] = useState('');

  // Pobranie produktów
  const fetchProducts = async (query = '') => { //funkcja strzałkowa do pobrania produktów
    try {
      const url = query
      ? `${import.meta.env.VITE_API_URL}/products?search=${encodeURIComponent(query)}`
      : `${import.meta.env.VITE_API_URL}/products`;

      const res = await fetch(url); //await - zaczekaj na odpowiedz serwera z backendu Express
      const data = await res.json(); //poczekaj na zmiane odpowiedzi z JSON na obiekt
      setProducts(data); //aktualizacja stanu produktów(data - dane które otrzymaliśmy w odpowiedzi(zmienione z JSON na obiekt) z GET)
    } catch {
      setError('Błąd pobierania produktów'); //jeśli coś pojdzie nie tak: aktualizacja stanu error
    }
  };

  useEffect(() => { //useEffect działa po renderze komponentu, tutaj tylko raz, bo przekazaliśmy []
    fetchProducts(); //wywołanie funkcji, więc cała logika asynchroniczna w niej zawarta zostanie uruchomiona w momencie montowania komponentu
  }, []); // [] oznacza, że useEffect uruchomi się tylko raz po montażu komponentu

  const handleAddProduct = async (e) => { //funkcja strzałkowa wywołuje się w <form> w evencie onSubmit czyli kiedy formularz jest wysłany
    e.preventDefault(); //blokuje domyślne zachowanie formularza, czyli przeładowanie strony po kliknięciu submit. Dzięki temu możemy obsłużyć formularz w React, bez utraty stanu aplikacji.
    setError(''); //zmiana stanu (ustawienie tak jak bylo domyslnie)

    try { //ponizej kod ktory moze sie nie udac:
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, { //await - zaczekaj na odpowiedz serwera z backendu Express
        method: 'POST', //wysyłamy więc POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, kcalPer100g: Number(kcalPer100g) }), //wysyłamy dane w formacie JSON
      });

      const data = await res.json(); //poczekaj az odpowiedz zamieni sie z JSON na obiekt
      if (!res.ok) throw new Error(data.error || 'Błąd dodawania produktu'); //response.ok sprawdza, czy status HTTP jest w zakresie 200–299. Jeśli nie, wyrzucamy błąd,zapisz błąd w data i wyświetl komunikat'Coś poszło nie tak'

      setProducts([...products, data]); // Dodajemy nowy produkt do listy, używamy spread, czyli pobieramy poprzednie wartośći z produkt i dodajemy nowe. Dzięki temu aktualizujemy stan.
      setName(''); //aktualizacja stanu name
      setKcalPer100g(''); //aktualizacja stanu kcalPer100g
    } catch (err) { //co robic, gdy cos pojdzie nie tak:
      setError(err.message); //zmiana stanu - zapisanie do obiektu error wiadomosci z błędem
    }
  };

  //Obłsuga wyszukiwania
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchProducts(value);
  }

  return (
    <div>
      <h2>Zarządzanie produktami</h2>

      {/* Formularz dodawania */}
      <form onSubmit={handleAddProduct}> {/*wywołanie funkcji strzałkwowej 'handleAddProduct' po wysłaniu formularza*/}
        <input
          type="text"
          placeholder="Nazwa produktu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Kalorie na 100g"
          value={kcalPer100g}
          onChange={(e) => setKcalPer100g(e.target.value)}
          required
        />
        <button type="submit">Dodaj produkt</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

       {/* Wyszukiwarka */}
      <h3>Wyszukaj produkt</h3>
      <input
        type="text"
        placeholder="Wpisz nazwę..."
        value={search}
        onChange={handleSearchChange}
      />

      {/* Lista */}
      <h3>Lista produktów</h3> 
      <ol>
        {products.map((p) => ( //dla każdego elementu w tablicy products wywołujemy funkcję(tu strzałkową z pojedyńczym produktem), która zwraca JSX.React tworzy z tego tablicę elementów, które wstawia do DOM.
          <li key={p.id}> {/* unikalny identyfikator elementu, potrzebny Reactowi do optymalizacji renderowania(tu id produktu) */}
            {p.name} - {p.kcal_per_100g} kcal {/* wyświetlenie(w formie listy nieuporządkowanej <ul> ) nazwy produktu oraz ilości kcal na 100g wraz z dopiskiem na końcu kcal*/}
          </li>
        ))}
      </ol>
    </div>
  );
}