import './styles/Calculator.css';
import { useProducts } from '../../features/products/useProducts';
import CalorieForm from './components/CalorieForm';
import ReverseCalorieForm from './components/ReverseCalorieForm';
import CalculatorControls from './components/CalculatorControls';
import { useCalculator } from './hooks/useCalculator';

export default function Calculator({ addProduct }) {
  const { products } = useProducts();
  const calc = useCalculator(addProduct);

  return (
    <div>
      <CalculatorControls
        manualMode={calc.manualMode}
        setManualMode={calc.setManualMode}
        reverseMode={calc.reverseMode}
        setReverseMode={calc.setReverseMode}
      />

      {calc.reverseMode ? (
        <ReverseCalorieForm
          reverseCalories={calc.reverseCalories}
          setReverseCalories={calc.setReverseCalories}
          reverseKcalPer100g={calc.reverseKcalPer100g}
          setReverseKcalPer100g={calc.setReverseKcalPer100g}
          reverseResult={calc.reverseResult}
          lastReverseKcalPer100g={calc.lastReverseKcalPer100g}
          handleReverseCalc={calc.handleReverseCalc}
        />
      ) : (
        <CalorieForm
          manualMode={calc.manualMode}
          products={products}
          selectedProduct={calc.selectedProduct}
          setSelectedProduct={calc.setSelectedProduct}
          kcalPer100g={calc.kcalPer100g}
          setKcalPer100g={calc.setKcalPer100g}
          weight={calc.weight}
          setWeight={calc.setWeight}
          filteredProducts={calc.filteredProducts}
          setFilteredProducts={calc.setFilteredProducts}
          handleSubmit={calc.handleSubmit}
        />
      )}

      {calc.result !== null && <div className="calorie-result">{calc.result} kcal</div>}
      {calc.error && <p style={{ color: 'red' }}>{calc.error}</p>}
    </div>
  );
}