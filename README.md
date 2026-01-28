# 🥗 EasyKcal

---

## 🥗 EasyKcal (PL)
EasyKcal to prosta aplikacja webowa do obliczania kalorii spożywanych produktów na podstawie wagi i wartości odżywczych. Projekt edukacyjny – krok po kroku, od backendu i frontendu po pełnoprawną aplikację webową.

### ✨ Funkcje
- Kalkulator kalorii (kcal/100g * waga)  
- Odwrócony kalkulator (kalorie -> waga)  
- Nutrition Summary – podsumowanie kalorii i wartości odżywczych wybranych w kalkulatorze produktów lub wpisanych ręcznie
- CRUD produktów (dodawanie, edycja, usuwanie)  
- Wyszukiwanie produktów  
- Harmonogram posiłków – planowanie posiłków na miesiąc, zarządzanie składnikami
- Recipes – zarządzanie przepisami kulinarnymi
- Responsywny i prosty interfejs  
- Przygotowany do wdrożenia online  

### 🛠️ Technologie

#### 🔹 Frontend (React + Vite)
- React.js (Vite)  
- HTML + CSS  
- JavaScript (ES6+)  
- react-icons  

**Główne moduły frontendowe:**

| Moduł                  | Pliki                                                                               |  Funkcjonalność                                                         |
|------------------------|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Harmonogram (schedule) | `MonthView.jsx`, `MealsTable.jsx`, `Schedule.jsx`, `scheduleApi.js`   | Planowanie posiłków, dodawanie/usuwanie składników, obsługa miesięcznego harmonogramu |
| Recipes                | `Recipes.jsx`, `RecipeForm.jsx`, `recipesApi.js`                                    | CRUD przepisów kulinarnych                                              |
| Products               | `ProductManager.jsx`, `ProductList.jsx`, `ProductForm.jsx`, `productApi.js`         | CRUD produktów, wyszukiwanie, zarządzanie listą produktów               |
| Calculator             | `Calculator.jsx`, `CalorieForm.jsx`, `CalculatorControls.jsx`, `calculatorApi.js`   | Obliczanie kalorii i wag produktów                                      |
| Nutrition Summary      | `NutritionSummary.jsx`                                                              | Podsumowanie wartości odżywczych                                        |
| Layout                 | `Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx`                                           | Nawigacja i struktura interfejsu                                        |

---

#### 🔹 Backend (Node.js + Express)
- Node.js + Express  
- PostgreSQL  
- Dotenv  
- Middleware błędów i CORS  
- HTTPS (lokalne certyfikaty)  

**Endpointy backendowe:**

| Endpoint                     | Metody         | Funkcjonalność                                |
|------------------------------|----------------|-----------------------------------------------|
| `/products`                  | GET, POST, PUT, DELETE | CRUD produktów                        |
| `/calculator/calculate`      | POST           | Oblicza kalorie na podstawie wagi             |
| `/calculator/calculate-reverse` | POST        | Oblicza wagę na podstawie kalorii             |
| `/api/recipes`               | GET, POST, PUT, DELETE | CRUD przepisów kulinarnych            |
| `/api/schedule/:year/:month` | GET, PATCH, POST, DELETE | Pobieranie i zarządzanie harmonogramem miesięcznym |
| `/auth/register`             | POST           | Rejestracja użytkownika                       |
| `/auth/login`                | POST           | Logowanie użytkownika                         |
| `/auth/logout`               | POST           | Wylogowanie użytkownika                       |
| `/auth/me`                   | GET            | Pobranie danych zalogowanego użytkownika      |

---

#### 🔹 Baza danych
- PostgreSQL lokalnie lub zdalnie (Supabase / Railway / pgAdmin)  

## Migracja bazy danych

Wszystkie zmiany schematu bazy danych są przechowywane w folderze `backend/migrations`.
Możesz je uruchomić ręcznie lub za pomocą preferowanego narzędzia do migracji.

### 🚀 Uruchomienie lokalne

#### ---Backend---
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

#### ---Frontend---
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

⚡ Wdrożenie online
- Backend: Railway, Render lub inny darmowy hosting Node.js. Zaktualizuj zmienne środowiskowe i upewnij się, że CORS wskazuje na frontend.
- Frontend: Netlify lub Vercel. W .env ustaw VITE_API_URL na URL backendu online.

🛡️ Bezpieczeństwo
- CORS ograniczony do domeny frontendowej
- HTTPS (lokalne certyfikaty lub SSL na produkcji)
- Globalny handler błędów

📚 Cel edukacyjny
Projekt pokazuje pełny proces tworzenia aplikacji fullstack – od bazy danych, backendu po frontend i wdrożenie. Uczy pracy z React, Node.js, PostgreSQL oraz dobrych praktyk w organizacji kodu i zarządzaniu stanem.

🧠 Autor
- Maciej Mróz
- GitHub: https://github.com/maciejmrozgg

# 🥗 EasyKcal (ENG)
EasyKcal is a simple web application for calculating calories of consumed products based on weight and nutritional values. Educational project – step by step, from backend and frontend to a full-featured web app.

## ✨ Features
- Calorie calculator (kcal/100g * weight)
- Reverse calculator (calories -> weight)
- Nutrition Summary – shows a summary of calories and nutrients based on products selected in the calculator or entered manually
- Product CRUD (add, edit, delete)
- Product search
- Meal Schedule – monthly meal planning, ingredient management  
- Recipes – managing cooking recipes  
- Responsive and simple UI
- Ready for online deployment

### 🛠️ Technologies
#### 🔹 Frontend (React + Vite)
- React.js (Vite)
- HTML + CSS
- JavaScript (ES6+)
- react-icons

**Main frontend modules:**

| Module                  | Files                                                                               | Functionality                                                           |
|-------------------------|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Meal Schedule (schedule)| `MonthView.jsx`, `MealsTable.jsx`, `Schedule.jsx`, `scheduleApi.js`                 | Monthly meal planning, adding/removing ingredients, schedule management |
| Recipes                 | `Recipes.jsx`, `RecipeForm.jsx`, `recipesApi.js`                                    | CRUD for cooking recipes                                                |
| Products                | `ProductManager.jsx`, `ProductList.jsx`, `ProductForm.jsx`, `productApi.js`         | CRUD for products, search, product list management                      |
| Calculator              | `Calculator.jsx`, `CalorieForm.jsx`, `CalculatorControls.jsx`, `calculatorApi.js`   | Calculating calories and weights                                        |
| Nutrition Summary       | `NutritionSummary.jsx`                                                              | Overview of nutritional values                                          |
| Layout                  | `Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx`                                           | Navigation and UI structure                                             |

---

#### 🔹 Backend (Node.js + Express)
- Node.js + Express
- PostgreSQL
- Dotenv
- Error handling middleware and CORS
- HTTPS (local certificates)

| Endpoint                     | Methods         | Functionality                                |
|------------------------------|-----------------|----------------------------------------------|
| `/products`                  | GET, POST, PUT, DELETE | CRUD for products                     |
| `/calculator/calculate`      | POST           | Calculates calories based on weight           |
| `/calculator/calculate-reverse` | POST        | Calculates weight based on calories           |
| `/api/recipes`               | GET, POST, PUT, DELETE | CRUD for cooking recipes              |
| `/api/schedule/:year/:month` | GET, PATCH, POST, DELETE | Retrieve and manage monthly meal schedule |
| `/auth/register`             | POST           | User registration                             |
| `/auth/login`                | POST           | User login                                    |
| `/auth/logout`               | POST           | User logout                                   |
| `/auth/me`                   | GET            | Get logged-in user information                |

---

#### 🔹 Database
- PostgreSQL locally or remotely (Supabase / Railway / pgAdmin)

## Database migrations

All database schema changes are stored in `backend/migrations`.
Run them manually or using your preferred migration tool.

 ### 🚀 Local setup

#### ---Backend---
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

#### ---Frontend---
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

⚡ Deployment
- Backend: Railway, Render, or other free Node.js hosting. Update environment variables and make sure CORS points to frontend.
- Frontend: Netlify or Vercel. Set VITE_API_URL to backend URL in .env.

🛡️ Security
- CORS limited to frontend domain
- HTTPS (local certificates or production SSL)
- Global error handler

📚 Educational purpose
The project demonstrates a full-stack application workflow – from database and backend to frontend and deployment. Teaches React, Node.js, PostgreSQL, and good practices in code organization and state management.

🧠 Author
- Maciej Mróz
- GitHub: https://github.com/maciejmrozgg