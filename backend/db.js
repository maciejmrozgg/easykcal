require('dotenv').config(); //ładuje zmienne środowiskowe z pliku .env do process.env.
const { Pool } = require('pg'); //klasa Pool z modułu pg

const pool = new Pool({ //tworzymy instancję klasy Pool, przekazując jej dane logowania do bazy
    host: process.env.PGHOST, 
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDB,
    port: process.env.PGPORT
}); //host, user, password, database, port są wczytywane z pliku .env za pomocą process.env.NAZWA_ZMIENNEJ

module.exports = pool; //udostępnienie obiektu pool innym plikom w aplikacji