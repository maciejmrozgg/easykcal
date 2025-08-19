#🍏 EasyKcal - Backend

Backend aplikacji **EasyKcal** napisany w **Node.js (Express)** z bazą danych **PostgreSQL**.  
Odpowiada za obsługę produktów, kalkulator kalorii i (w przyszłości) logowanie użytkowników.

---

##🚀 Uruchomienie

1.Skopiuj repozytorium i przejdź do katalogu backend:
   cd backend

2.Zainstaluj zależności:
npm install

3.Skonfiguruj plik .env (przykład):
PORT=3000
HOST=localhost
KEY_PATH=../key.pem
CERT_PATH=../cert.pem
ALLOWED_ORIGINS=https://localhost:5173
DATABASE_URL=postgres://user:password@localhost:5432/easykcal

4.Uruchom backend:
npm start

Serwer wystartuje pod adresem:
https://HOST:PORT

📌 Endpointy
Produkty /products
GET /products – pobiera wszystkie produkty (opcjonalnie z filtrem ?search=)
POST /products – dodaje nowy produkt ({ name, kcalPer100g })

Kalkulator /calculator
POST /calculator/calculate – oblicza kalorie na podstawie wagi ({ kcalPer100g, weight })
POST /calculator/calculate-reverse – oblicza wagę na podstawie kalorii ({ kcalPer100g, calories })

🛡️ Bezpieczeństwo
🔒 CORS ograniczony do domeny zdefiniowanej w .env
🔒 HTTPS z własnymi certyfikatami
🔒 Globalny handler błędów (middleware/errorHandler.js)