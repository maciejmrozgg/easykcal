import { useState, useEffect } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import About from './components/layout/About';
import Contact from './components/layout/Contact';
import Register from "./components/auth/register/Register";
import Login from './components/auth/login/Login';

import Calculator from './components/calculator/Calculator';
import ProductManager from './components/products/ProductManager';
import NutritionSummary from './components/nutrition/NutritionSummary';
import { ProductsProvider } from './components/products/context/ProductsProvider';

import './theme/theme.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const addProduct = (product) => {
    setSelectedProducts(prev => [...prev, product]);
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Błąd podczas wylogowania", err);
    }
  };

  return (
    <ProductsProvider>
      <div className="app-container">
        <Navbar
          onRegisterClick={() => setShowRegister(true)}
          onLoginClick={() => setShowLogin(true)}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
        />

        <h1>EasyKcal</h1>

        <div className="component">
          <Calculator addProduct={addProduct} />
        </div>

        <div className="nutrition-component">
          <NutritionSummary selectedProducts={selectedProducts} />
        </div>

        <div className="component">
          <ProductManager />
        </div>

        <div className="component">
          <About />
        </div>

        <div className="component">
          <Contact />
        </div>

        <div className="component">
          <Footer />
        </div>

        {showRegister && (
          <div className="modal-overlay">
            <Register onClose={() => setShowRegister(false)} />
          </div>
        )}

        {showLogin && (
          <div className="modal-overlay">
            <Login onLoginSuccess={(userData) => {
              setUser(userData);
              setShowLogin(false);
            }}
              onClose={() => setShowLogin(false)}
            />
          </div>
        )}

      </div>
    </ProductsProvider>
  );
}

export default App;
