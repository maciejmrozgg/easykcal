const pool = require('./db'); //import obiektu pool z pliku db.js

//Test połączenia z bazą
pool.query('SELECT NOW()', (err, res) => { //korzystamy z obiektu klasy Pool i jej metody - query(). Pierwszym argumentem jest zapytanie SQL a drugi to funkcja callback z 2 parametrami(err i res)
  if(err) { 
    console.error('Blad polaczenia z baza:', err); //jeśli err to: wyświetl komunikat i zawartość err.
  } else {
    console.log('Polaczenie OK. Czas w bazie', res.rows[0]); //jeśli jest dobrze to wyświetl komunikat i 1wszy wiersz odpowiedzi(res)
  }
});