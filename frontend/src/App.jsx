import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator'; //Import komponentu Calculator z folderu components
import ProductManager from './components/ProductManager'; //Import komponentu ProductManager z folderu components
import ThemeSwitcher from './ThemeSwitcher';
import './theme.css';

function App() { //Główny komponent aplikacji – łączy i wyświetla wszystkie podkomponenty
   const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  return (
    <div className="app-container">
      <ThemeSwitcher darkMode={darkMode} setDarkMode={setDarkMode} />
      <h1>EasyKcal</h1>
      
      <div className="component">
        <Calculator />
      </div>
      
      <hr />
      
      <div className="component">
        <ProductManager />
      </div>
    </div>
  );
}

export default App;
