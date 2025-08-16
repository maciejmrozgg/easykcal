import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator'; //Import komponentu Calculator z folderu components
import ProductManager from './components/ProductManager'; //Import komponentu ProductManager z folderu components
import Navbar from './components/Navbar';
import NutritionSummary from './components/NutritionSummary';
import './theme.css';

function App() { //Główny komponent aplikacji – łączy i wyświetla wszystkie podkomponenty
   const [darkMode, setDarkMode] = useState(false);
   const [selectedProducts, setSelectedProducts] = useState([]);

   const addProduct = (product) => {
    setSelectedProducts(prev => [...prev, product]);
   };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  return (
     <div className="app-container">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <h1>EasyKcal</h1>
        
        <div className="component">
          <Calculator addProduct={addProduct}/>
          
        </div>

        <div className="component">
          <NutritionSummary selectedProducts={selectedProducts} />
        </div>
        
        <div className="component">
          <ProductManager />
        </div>
      
    </div>
  );
}

export default App;
