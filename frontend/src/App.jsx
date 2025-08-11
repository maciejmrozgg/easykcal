import { useState } from 'react'; //import hook

function App() { //komponent App
  const [kcalPer100g, setKcalPer100g] = useState(''); //ustawienie stanu początkowego obiektu kcalPer100g na pusty
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => { //funkcja wywolywana na event onSubmit
    e.preventDefault(); //blokuje domyślne zachowanie formularza, czyli przeładowanie strony po kliknięciu submit. Dzięki temu możemy obsłużyć formularz w React, bez utraty stanu aplikacji.
    setError(''); //zmiana stanu obiektu(w tym przypadku tak jak bylo domyslnie)
    setResult(null); //zmiana stanu obiektu(w tym przypadku tak jak bylo domyslnie)

    try { //ponizej kod ktory moze sie nie udac:
      const response = await fetch('http://localhost:3000/calculate', { //await - zaczekaj na odpowiedz serwera z backendu Express
        method: 'POST', //wysyłamy więc POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kcalPer100g: Number(kcalPer100g), weight: Number(weight) }), //wysyłamy dane w formacie JSON
      });

      const data = await response.json(); //poczekaj az odpowiedz zamieni sie z JSON na obiekt

      if (!response.ok) { //jesli coś poszło nie tak z odpowiedzią
        throw new Error(data.error || 'Coś poszło nie tak'); //wyrzuć bład i wyświetl komunikat
      }

      setResult(Math.round(data.result * 100) / 100); //na koniec do obiektu result dodaj dane z odpowiedzi z serwera czyli np. : 55, 100. Result będzie wynosić 55 kcal.
    } catch (err) { //co robic, gdy cos pojdzie nie tak:
      setError(err.message); //zmiana stanu - zapisanie do obiektu error wiadomosci z błędem
    }
  };

  return ( //JSX
    <div style={{ padding: '2rem' }}> 
      <h1>EasyKcal - Kalkulator kalorii</h1>

      <form onSubmit={handleSubmit}> {/* przypisanie funkcji do wydarzenia onSubmit */}
        <div>
          <label>Kalorie na 100g: </label>
          <input
            type="number"
            value={kcalPer100g}
            placeholder='Wprowadź kalorie'
            onChange={(e) => setKcalPer100g(e.target.value)} //po wprowadzeniu liczby - zmiana stanu obiektu i ustawienie value(wartosci) na nową wartość(poczatkowo obiekt KcalPer100g jest pusty), po wpisaniu np.100 wartość zmienia się na 100
            required
          />
        </div>

        <div>
          <label>Waga (g): </label>
          <input
            type="number"
            value={weight}
            placeholder='Wprowadź wagę'
            onChange={(e) => setWeight(e.target.value)} //to samo co w przypadku KcalPer100g
            required
          />
        </div>

        <button type="submit">Oblicz</button>
      </form>
      {/* wyświetlenie stanu końcowego i wyniku  */}
      {result !== null && <p>Kalorie: <strong>{result}</strong> kcal</p>} {/* jeśli result(wynik) nie jest pusty to wyświetli się element HTML <p>  */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* jeśli bład to wyświetl treść błedu kolorem czerwonym */}
    </div>
  );
}

export default App; //głowny komponent