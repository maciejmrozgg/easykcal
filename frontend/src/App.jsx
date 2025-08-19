import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';

import Calculator from './features/calculator/Calculator';
import ProductManager from './features/products/ProductManager';
import NutritionSummary from './features/nutrition/NutritionSummary';

import './theme/theme.css';

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

        <div className="component">
          <About />
        </div>

        <div className="component">
          <Contact />
        </div>

        <div className="component">
          <Footer />
        </div>
      
    </div>
  );
}

export default App;
