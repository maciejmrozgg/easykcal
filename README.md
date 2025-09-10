# 🥗 EasyKcal

---

## 🥗 EasyKcal (PL)
EasyKcal to prosta aplikacja webowa do obliczania kalorii spożywanych produktów na podstawie wagi i wartości odżywczych. Projekt edukacyjny – krok po kroku, od backendu i frontendu po pełnoprawną aplikację webową.

### ✨ Funkcje
- Kalkulator kalorii (kcal/100g * waga)  
- Odwrócony kalkulator (kalorie -> waga)  
- CRUD produktów (dodawanie, edycja, usuwanie)  
- Wyszukiwanie produktów  
- Responsywny i prosty interfejs  
- Przygotowany do wdrożenia online  

### 🛠️ Technologie

#### 🔹 Frontend (React + Vite)
- React.js (Vite)  
- HTML + CSS  
- JavaScript (ES6+)  
- react-icons  

#### 🔹 Backend (Node.js + Express)
- Node.js + Express  
- PostgreSQL  
- Dotenv  
- Middleware błędów i CORS  
- HTTPS (lokalne certyfikaty)  

#### 🔹 Baza danych
- PostgreSQL lokalnie lub zdalnie (Supabase / Railway / pgAdmin)  

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

📌 Endpointy
- /products – CRUD produktów (GET, POST, PUT, DELETE)
- /calculator/calculate – oblicza kalorie na podstawie wagi
- /calculator/calculate-reverse – oblicza wagę na podstawie kalorii

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
- Product CRUD (add, edit, delete)
- Product search
- Responsive and simple UI
- Ready for online deployment

### 🛠️ Technologies
#### 🔹 Frontend (React + Vite)
- React.js (Vite)
- HTML + CSS
- JavaScript (ES6+)
- react-icons

#### 🔹 Backend (Node.js + Express)
- Node.js + Express
- PostgreSQL
- Dotenv
- Error handling middleware and CORS
- HTTPS (local certificates)

#### 🔹 Database
- PostgreSQL locally or remotely (Supabase / Railway / pgAdmin)

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

📌 Endpoints
- /products – CRUD products (GET, POST, PUT, DELETE)
- /calculator/calculate – calculate calories based on weight
- /calculator/calculate-reverse – calculate weight based on calories

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