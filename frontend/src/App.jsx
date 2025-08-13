import Calculator from './components/Calculator'; //Import komponentu Calculator z folderu components
import ProductManager from './components/ProductManager'; //Import komponentu ProductManager z folderu components

function App() { //Główny komponent aplikacji – łączy i wyświetla wszystkie podkomponenty
  return (
    <div style={{ padding: '2rem' }}>
      <h1>EasyKcal</h1>
      <Calculator /> {/* Wyświetlenie komponentu Calculator */}
      <hr style={{ margin: '2rem 0' }} /> {/* Linia pozioma oddzielająca sekcje (tymczasowo)*/}
      <ProductManager /> {/* Wyświetlenie komponentu ProductManager */}
    </div>
  );
}

export default App;
