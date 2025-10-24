import { useState, useEffect } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import About from './components/layout/About';
import Contact from './components/layout/Contact';

import Calculator from './components/calculator/Calculator';
import ProductManager from './components/products/ProductManager';
import NutritionSummary from './components/nutrition/NutritionSummary';
import { ProductsProvider } from './components/products/context/ProductsProvider';

import './theme/theme.css';

function App() {
   const [darkMode, setDarkMode] = useState(true);
   const [selectedProducts, setSelectedProducts] = useState([]);

   const addProduct = (product) => {
    setSelectedProducts(prev => [...prev, product]);
   };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  return (
      <ProductsProvider>
      <div className="app-container">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <h1>EasyKcal</h1>

        <div className="component">
          <Calculator addProduct={addProduct} />
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
    </ProductsProvider>
  );
}

export default App;
