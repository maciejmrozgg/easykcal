import { useState } from 'react';
import { calculateCalories, calculateReverse } from '../api/calculatorApi';

export function useCalculator(addProduct) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [kcalPer100g, setKcalPer100g] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [reverseMode, setReverseMode] = useState(false);
  const [reverseCalories, setReverseCalories] = useState('');
  const [reverseKcalPer100g, setReverseKcalPer100g] = useState('');
  const [reverseResult, setReverseResult] = useState(null);
  const [lastReverseKcalPer100g, setLastReverseKcalPer100g] = useState('');

  // --- Główna logika ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const kcalNum = parseFloat(kcalPer100g);
    const weightNum = parseFloat(weight);

    if (!kcalPer100g || !weight || isNaN(kcalNum) || isNaN(weightNum) || kcalNum <= 0 || weightNum <= 0) {
      setError('Nieprawidłowa wartość kalorii lub wagi');
      return;
    }

    try {
      const calculated = await calculateCalories(kcalNum, weightNum);
      setResult(calculated);

      addProduct({
        name: selectedProduct || 'Ręcznie wprowadzona wartość',
        kcalPer100g: kcalNum,
        weight: weightNum,
        result: calculated,
      });

      setSelectedProduct('');
      setKcalPer100g('');
      setWeight('');
      setFilteredProducts([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReverseCalc = async (e) => {
    e.preventDefault();
    setError('');

    const reverseCaloriesNum = parseFloat(reverseCalories);
    const reverseKcalNum = parseFloat(reverseKcalPer100g);

    if (!reverseCalories || !reverseKcalPer100g || isNaN(reverseCaloriesNum) || isNaN(reverseKcalNum)) {
      setError('Nieprawidłowa wartość kalorii lub kcal/100g');
      return;
    }

    try {
      const weight = await calculateReverse(reverseCaloriesNum, reverseKcalNum);
      setReverseResult(weight);
      setLastReverseKcalPer100g(reverseKcalPer100g);
      setReverseCalories('');
      setReverseKcalPer100g('');
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    // stany
    selectedProduct, setSelectedProduct,
    kcalPer100g, setKcalPer100g,
    weight, setWeight,
    result, setResult,
    error, setError,
    manualMode, setManualMode,
    filteredProducts, setFilteredProducts,
    reverseMode, setReverseMode,
    reverseCalories, setReverseCalories,
    reverseKcalPer100g, setReverseKcalPer100g,
    reverseResult, setReverseResult,
    lastReverseKcalPer100g,

    // funkcje
    handleSubmit,
    handleReverseCalc
  };
}