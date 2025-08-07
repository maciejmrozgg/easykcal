const express = require('express'); //Ładujemy bibliotekę Express (czyli framework do budowania serwera w Node.js)
const app = express(); //express() tworzy instancję aplikacji Express – coś jak „serwer aplikacji”.Przypisujemy to do app, dzięki czemu możemy dodawać do tej aplikacji trasy (app.get, app.post, itd.).
                        //Tworzymy aplikację Express – to jest nasz "serwer"
const PORT = process.env.PORT || 3000; //process.env.PORT – zmienna środowiskowa (np. ustawiana przez Railway). Jeśli brak, używamy domyślnie portu 3000
                                       //|| 3000 – jeśli nie ma takiej zmiennej, to użyj "3000" jako domyślnego portu.

//Endpoint GET
app.get('/', (req, res) => { //app.get() – definiuje trasę GET (czyli taką, którą użytkownik odwiedza np. przez przeglądarkę).'/' – to ścieżka główna (localhost:3000/).
                             //req = request (żądanie użytkownika, np. dane, nagłówki). res = response (odpowiedź serwera, czyli to co my wysyłamy)
  res.send('Hello from EasyKcal API!'); //res.send(...) – wysyłamy tekst jako odpowiedź
});

app.use(express.json()); //pozwala odczytać JSON z ciała żądań(np. POST z frontendu). Middleware – pozwala czytać dane JSON z ciała żądań POST

//Endpoint POST
app.post('/calculate', (req,res) => { //app.post() - Definiujemy trasę POST na ścieżce '/calculate'
    const {kcalPer100g, weight} = req.body; //Odczytujemy dane z ciała żądania (JSON)

    if (!kcalPer100g || !weight) { //Jeśli nie ma wymaganych danych:
        return res.status(400).json({error: 'Brakuje danych wejściowych'}); // Zwracamy błąd 400
    }

    const result = (kcalPer100g / 100) * weight; //Obliczamy kalorie na podstawie wagii

    res.json({result}); //zwrócenie wyniku w formacie JSON
});

// Uruchamiamy nasłuchiwanie serwera
app.listen(PORT, () => { //app.listen(PORT, ...) – uruchamia nasłuchiwanie serwera na porcie
  console.log(`Server running on http://localhost:${PORT}`); //Kiedy serwer wystartuje, wywoła się funkcja, która pokazuje tekst w konsoli.
});
