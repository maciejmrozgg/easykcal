![Version](https://img.shields.io/badge/version-v1.0.2-blue)
![Status](https://img.shields.io/badge/status-stable-green)

# 🥗 EasyKcal (ENG)
EasyKcal is a full-stack web application for managing calories, products, recipes, and monthly meal schedules.

The project presents the complete process of building a web application:
- REST API (Node.js + Express)
- relational database (PostgreSQL)
- user authentication (JWT)
- roles (user / admin)
- backend and frontend testing
- modular React-based frontend

Version v1.0.0 marks the first stable release of the application.
Current version: v1.0.2.

## Features

### 🔹 Calculator
- Calorie calculator (kcal/100g × weight)
- Reverse calculator (calories → weight)
- Nutrition Summary – overview of calories and nutritional values

### 🔹 Products
- Full product CRUD
- Search functionality
- Data updates

### 🔹 Recipes
- Full recipe CRUD
- Global (default) categories
- User custom categories (custom CRUD)
- Automatic reassignment to “Uncategorized” when a category is deleted

### 🔹 Schedule
- Monthly meal view
- Desktop + Mobile views
- Ingredient management
- Calorie limits

### 🔹 Authentication
- User registration and login
- JWT
- Roles: user / admin
- Protected endpoints

## Architecture

### Frontend
- React + Vite
- Modular feature-based structure
- API abstraction layer
- Local state + custom hooks
- Vitest + React Testing Library

### Backend
- Node.js + Express
- PostgreSQL
- Relational data model
- Middleware (auth, error handler, CORS)
- SQL migrations
- Integration tests (Jest)

---

## Testing

### Backend
- Jest
- Endpoint integration tests
- Authorization and ownership tests
- CRUD tests for recipes and categories

### Frontend
- Vitest
- React Testing Library
- Component tests
- Integration tests
- Modal tests

All tests pass in the current stable version.

---

## Technologies

### Frontend
- React (Vite)
- JavaScript (ES6+)
- HTML + CSS
- react-icons

### Backend
- Node.js + Express
- PostgreSQL
- JWT
- Dotenv
- HTTPS (local certificates)

**Backend endpoints:**

| Endpoint                        | Methods                  | Functionality                                 |
|---------------------------------|--------------------------|-----------------------------------------------|
| `/products`                     | GET, POST, PUT, DELETE   | CRUD for products                             |
| `/calculator/calculate`         | POST                     | Calculates calories based on weight           |
| `/calculator/calculate-reverse` | POST                     | Calculates weight based on calories           |
| `/api/recipes`                  | GET, POST, PUT, DELETE   | CRUD for cooking recipes                      |
| `/api/categories`               | GET, POST, PUT, DELETE   | Categories (global + user)                    |
| `/api/schedule/:year/:month`    | GET, PATCH, POST, DELETE | Retrieve and manage monthly meal schedule     |
| `/auth/register`                | POST                     | User registration                             |
| `/auth/login`                   | POST                     | User login                                    |
| `/auth/logout`                  | POST                     | User logout                                   |
| `/auth/me`                      | GET                      | Get logged-in user information                |

---

## Database
The application uses a relational **PostgreSQL** database. 

### Main design principles:
- Foreign Keys (relational integrity)
- UNIQUE constraints
- JSONB (ingredients, instructions, schedule)
- `updated_at` triggers
- SQL migrations (schema evolution during project development)

---

### 📄 Structure and documentation
The project includes three levels of working with the database schema:

### 1️⃣ Full schema (rebuild from scratch)
Executable file: `backend/db/schema.sql`
Allows rebuilding the entire database structure from scratch.

### 2️⃣ Migrations (incremental changes)
Folder: `backend/migrations`
Contains migration files documenting schema evolution during the development of the project.

### 3️⃣ Technical documentation
File: `backend/db/SCHEMA.md`
Describes:
- table structures
- relationships
- constraints
- database design assumptions

---

## Rebuilding the database

### Linux / macOS
psql <database_name> < backend/db/schema.sql

### Windows (PowerShell)
Get-Content backend\db\schema.sql | psql -U <db_user> <database_name>
Where:
- `<db_user>` – your PostgreSQL user (e.g. postgres)
- `<database_name>` – your database name (e.g. easykcal)
---

## 🚀 Local setup

### Backend
1.Clone the repository:
git clone https://github.com/maciejmrozgg/easykcal.git

2.Go to the backend folder:
cd easykcal/backend

3.Install dependencies:
npm install

4.Configure .env file (example):
PGHOST=localhost
PGUSER=YourUser
PGPASSWORD=YourPassword
PGDB=YourDatabase
PGPORT=5432

HOST=localhost
PORT=3000

KEY_PATH=../key.pem
CERT_PATH=../cert.pem

ALLOWED_ORIGINS=https://localhost:5173

5.Start the backend:
npm start

Backend will run at:
https://HOST:PORT

### Frontend
1.Go to frontend folder:
cd ../frontend

2.Install dependencies:
npm install

3.Configure .env (example):
VITE_API_URL=https://localhost:3000

4.Start frontend:
npm run dev

Frontend will be available at default Vite address, e.g.:
https://localhost:5173

## ⚡ Deployment
- Backend: Railway, Render, or other free Node.js hosting. Update environment variables and make sure CORS points to frontend.
- Frontend: Netlify or Vercel. Set VITE_API_URL to backend URL in .env.

## 🛡️ Security
- CORS limited to frontend domain
- JWT authentication
- Role based access
- HTTPS (local certificates or production SSL)
- Global error handler

## 📚 Educational purpose
The project demonstrates the complete full-stack development process:
- database design
- migrations
- REST API
- frontend SPA
- testing
- semantic versioning (SemVer)
- release management

## 🧠 Author
- Maciej Mróz
- GitHub: https://github.com/maciejmrozgg

---

# 🥗 EasyKcal (PL)
EasyKcal to pełnoprawna aplikacja webowa typu **full-stack** do zarządzania kaloriami, produktami, przepisami oraz harmonogramem posiłków.

Projekt prezentuje pełny proces budowy aplikacji webowej:
- REST API (Node.js + Express)
- relacyjną bazę danych (PostgreSQL)
- uwierzytelnianie użytkowników (JWT)
- role (user / admin)
- testy backendu i frontendu
- modularny frontend oparty o React

Wersja **v1.0.0** oznacza pierwszą stabilną wersję aplikacji.
Obecna wersja: v1.0.2.

---

## Funkcje

### 🔹 Kalkulator
- Kalkulator kalorii (kcal/100g × waga)
- Odwrócony kalkulator (kalorie → waga)
- Nutrition Summary – podsumowanie kalorii i wartości odżywczych

### 🔹 Produkty
- CRUD produktów
- Wyszukiwanie
- Aktualizacja danych

### 🔹 Przepisy
- CRUD przepisów
- Kategorie globalne (default)
- Kategorie użytkownika (custom CRUD)
- Automatyczne przenoszenie przepisów do „Bez kategorii” po usunięciu kategorii

### 🔹 Harmonogram
- Miesięczny widok posiłków
- Desktop + Mobile views
- Zarządzanie składnikami
- Limity kalorii

### 🔹 Autoryzacja
- Rejestracja i logowanie
- JWT
- Role: user / admin
- Ochrona endpointów

## Architektura

### Frontend
- React + Vite
- Modularna struktura (feature-based)
- API abstraction layer
- Local state + custom hooks
- Vitest + React Testing Library

### Backend
- Node.js + Express
- PostgreSQL
- Relacyjny model danych
- Middleware (auth, error handler, CORS)
- Migracje SQL
- Testy integracyjne (Jest)

---

## Testy

### Backend
- Jest
- Testy integracyjne endpointów
- Testy autoryzacji i ownership
- Testy CRUD dla recipes i categories

### Frontend
- Vitest
- React Testing Library
- Testy komponentów
- Testy integracyjne
- Testy modali

Wszystkie testy w obecnej stabilnej wersji przechodzą pomyślnie.

---

## Technologie

### Frontend
- React (Vite)
- JavaScript (ES6+) 
- HTML + CSS  
- react-icons  

### Backend
- Node.js + Express  
- PostgreSQL
- JWT
- Dotenv   
- HTTPS (lokalne certyfikaty)  

**Endpointy backendowe:**

| Endpoint                        | Metody                   | Funkcjonalność                                |
|---------------------------------|--------------------------|-----------------------------------------------|
| `/products`                     | GET, POST, PUT, DELETE   | CRUD produktów                                |
| `/calculator/calculate`         | POST                     | Oblicza kalorie na podstawie wagi             |
| `/calculator/calculate-reverse` | POST                     | Oblicza wagę na podstawie kalorii             |
| `/api/recipes`                  | GET, POST, PUT, DELETE   | CRUD przepisów kulinarnych                    |
| `/api/categories`               | GET, POST, PUT, DELETE   | Kategorie (global + user)                     |
| `/api/schedule/:year/:month`    | GET, PATCH, POST, DELETE | Pobieranie i zarządzanie harmonogramem        |
| `/auth/register`                | POST                     | Rejestracja użytkownika                       |
| `/auth/login`                   | POST                     | Logowanie użytkownika                         |
| `/auth/logout`                  | POST                     | Wylogowanie użytkownika                       |
| `/auth/me`                      | GET                      | Pobranie danych zalogowanego użytkownika      |

---

## Baza danych

Aplikacja wykorzystuje relacyjną bazę danych **PostgreSQL**.

### Główne założenia projektowe:
- Foreign Keys (spójność relacyjna)
- UNIQUE constraints
- JSONB (ingredients, instructions, schedule)
- Triggery `updated_at`
- Migracje SQL (ewolucja schematu w trakcie rozwoju projektu)

---

### 📄 Struktura i dokumentacja
Projekt zawiera trzy poziomy pracy ze schematem bazy:

### 1️⃣ Pełny schemat (odtworzenie od zera)
Wykonywalny plik: `backend/db/schema.sql`
Umożliwia zbudowanie całej struktury bazy od podstaw.

### 2️⃣ Migracje (zmiany inkrementalne)
Folder: `backend/migrations`
Zawiera pliki migracyjne dokumentujące ewolucję schematu w kolejnych etapach rozwoju projektu.

### 3️⃣ Dokumentacja techniczna
Plik: `backend/db/SCHEMA.md`
Opisuje:
- strukturę tabel
- relacje
- constrainty
- założenia projektowe

---

## Odtworzenie bazy danych

### Linux / macOS
psql <database_name> < backend/db/schema.sql

### Windows (PowerShell)
Get-Content backend\db\schema.sql | psql -U <db_user> <database_name>
Gdzie:
- `<db_user>` – użytkownik PostgreSQL (np. postgres)
- `<database_name>` – nazwa bazy danych (np. easykcal)

---

## 🚀 Uruchomienie lokalne

### Backend
1.Sklonuj repozytorium:  
git clone https://github.com/maciejmrozgg/easykcal.git

2.Przejdź do katalogu backend:
cd easykcal/backend

3.Zainstaluj zależności:
npm install

4.Skonfiguruj plik .env (przykład):
PGHOST=localhost
PGUSER=TwojUzytkownik
PGPASSWORD=TwojeHaslo
PGDB=NazwaBazy
PGPORT=5432

HOST=localhost
PORT=3000

KEY_PATH=../key.pem
CERT_PATH=../cert.pem

ALLOWED_ORIGINS=https://localhost:5173

5.Uruchom backend:
npm start

Serwer wystartuje pod adresem:
https://HOST:PORT

### Frontend
1.Przejdź do katalogu frontend:
cd ../frontend

2.Zainstaluj zależności:
npm install

3.Skonfiguruj .env (przykład):
VITE_API_URL=https://localhost:3000

4.Uruchom frontend:
npm run dev

Frontend będzie dostępny pod adresem domyślnym Vite, np.:
https://localhost:5173

## ⚡ Wdrożenie online
- Backend: Railway, Render lub inny darmowy hosting Node.js. Zaktualizuj zmienne środowiskowe i upewnij się, że CORS wskazuje na frontend.
- Frontend: Netlify lub Vercel. W .env ustaw VITE_API_URL na URL backendu online.

## 🛡️ Bezpieczeństwo
- CORS ograniczony do domeny frontendowej
- Uwierzytelnianie JWT
- Dostęp oparty na rolach
- HTTPS (lokalne certyfikaty lub SSL na produkcji)
- Globalny handler błędów

## 📚 Cel edukacyjny
Projekt pokazuje kompletny proces tworzenia aplikacji full-stack:
- projekt bazy danych
- migracje
- REST API
- frontend SPA
- testowanie
- wersjonowanie (SemVer)
- release management

---

## 🧠 Autor
- Maciej Mróz
- GitHub: https://github.com/maciejmrozgg

Version: v1.0.2
Status: Stable