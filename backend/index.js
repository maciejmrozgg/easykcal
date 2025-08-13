const express = require('express'); //Ładujemy bibliotekę Express (czyli framework do budowania serwera w Node.js)
const app = express(); //express() tworzy instancję aplikacji Express – coś jak „serwer aplikacji”.Przypisujemy to do app, dzięki czemu możemy dodawać do tej aplikacji trasy (app.get, app.post, itd.). //Tworzymy aplikację Express – to jest nasz "serwer"
const PORT = process.env.PORT || 3000; //process.env.PORT – zmienna środowiskowa (np. ustawiana przez Railway). Jeśli brak, używamy domyślnie portu 3000 //|| 3000 – jeśli nie ma takiej zmiennej, to użyj "3000" jako domyślnego portu.
const cors = require('cors'); // Ładujemy bibliotekę CORS – pozwala naszemu backendowi zezwalać na połączenia z innych domen (np. frontend Reacta na innym porcie)
const pool = require('./db'); // Ładujemy obiekt pool z db.js(połączenie z bazą - lokalną)

//Endpoint GET
app.get('/', (req, res) => { //app.get() – definiuje trasę GET (czyli taką, którą użytkownik odwiedza np. przez przeglądarkę).'/' – to ścieżka główna (localhost:3000/).
                             //req = request (żądanie użytkownika, np. dane, nagłówki). res = response (odpowiedź serwera, czyli to co my wysyłamy)
  res.send('Hello from EasyKcal API!'); //res.send(...) – wysyłamy tekst jako odpowiedź
});

app.use(cors()); // Middleware – pozwala innym aplikacjom (np. frontendowi z Reacta) wysyłać zapytania do backendu (domyślnie było to zablokowane)
app.use(express.json()); //pozwala odczytać JSON z ciała żądań(np. POST z frontendu). Middleware – pozwala czytać dane JSON z ciała żądań POST

//Endpoint POST /calculate - kalkulator
app.post('/calculate', (req,res) => { //app.post() - Definiujemy trasę POST na ścieżce '/calculate'
    const {kcalPer100g, weight} = req.body; //Odczytujemy dane z ciała żądania (JSON)

    if (!kcalPer100g || !weight) { //Jeśli nie ma wymaganych danych:
        return res.status(400).json({error: 'Brakuje danych wejściowych'}); // Zwracamy błąd 400
    }

    const result = (kcalPer100g / 100) * weight; //Obliczamy kalorie na podstawie wagii

    res.json({result}); //zwrócenie wyniku w formacie JSON
});

//Endpoint POST /products - zapis produktu do bazy
app.post('/products', async (req, res) => { //trasa POST na ścieżce /products
  const { name, kcalPer100g } = req.body; //Dane z ciała żadania (JSON)
  if (!name || !kcalPer100g ) {
    return res.status(400).json({ error: 'Brakuje danych produktu '});
  }

  try { //blok kodu który może się nie udać
    //Wstawienie rekordu do bazy
    const result = await pool.query(
      'INSERT INTO products (name, kcal_per_100g) VALUES ($1, $2) RETURNING *',
      [name, kcalPer100g]
    );

    //Zwrocenie nowo dodanego produktu
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Błąd zapisu produktu:', err);
    res.status(500).json({ error: 'Błąd serwera przy zapisie produktu'});
  }
});

//Endpoint GET /products - pobranie wszystkich produktów
app.get('/products', async (req, res) => { //trasa GET na scieżce /products
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows) //Zwracamy listę produktó w formacie JSON
  } catch (err) {
    console.error('Błąd pobierania produktów:', err);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu produktu'});
  }
});

// Uruchamiamy nasłuchiwanie serwera
app.listen(PORT, () => { //app.listen(PORT, ...) – uruchamia nasłuchiwanie serwera na porcie
  console.log(`Server running on http://localhost:${PORT}`); //Kiedy serwer wystartuje, wywoła się funkcja, która pokazuje tekst w konsoli.
});
