import { useState } from 'react';

export function useCalculator(addProduct, products) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [kcalPer100g, setKcalPer100g] = useState('');
  const [weight, setWeight] = useState('');
  const [protein, setProtein] = useState(null);
  const [fat, setFat] = useState(null);
  const [carbs, setCarbs] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [reverseMode, setReverseMode] = useState(false);
  const [reverseCalories, setReverseCalories] = useState('');
  const [reverseKcalPer100g, setReverseKcalPer100g] = useState('');
  const [reverseResult, setReverseResult] = useState(null);
  const [lastReverseKcalPer100g, setLastReverseKcalPer100g] = useState('');

  const round = (value) => Math.round(value * 10) / 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const kcalNum = parseFloat(kcalPer100g);
    const weightNum = parseFloat(weight);

    const product = products.find(
      p => p.name === selectedProduct
    );

    const proteinValue = product
      ? round((product.proteinPer100g * weightNum) / 100)
      : null;

    const fatValue = product
      ? round((product.fatPer100g * weightNum) / 100)
      : null;

    const carbsValue = product
      ? round((product.carbsPer100g * weightNum) / 100)
      : null;

    if (!kcalPer100g || !weight || isNaN(kcalNum) || isNaN(weightNum) || kcalNum <= 0 || weightNum <= 0) {
      setError('Nieprawidłowa wartość kalorii lub wagi');
      return;
    }


    const calculated = Math.round(((kcalNum * weightNum) / 100) * 100) / 100;
    setResult(calculated);
    setProtein(proteinValue);
    setFat(fatValue);
    setCarbs(carbsValue);

    addProduct({
      hasMacros: !!product,
      name: selectedProduct || 'Ręcznie wprowadzona wartość',
      kcalPer100g: kcalNum,
      weight: weightNum,
      result: calculated,
      protein: proteinValue,
      fat: fatValue,
      carbs: carbsValue
    });

    setSelectedProduct('');
    setKcalPer100g('');
    setWeight('');
    setFilteredProducts([]);
  };

  const handleReverseCalc = (e) => {
    e.preventDefault();
    setError('');

    const reverseCaloriesNum = parseFloat(reverseCalories);
    const reverseKcalNum = parseFloat(reverseKcalPer100g);

    if (
      !reverseCalories ||
      !reverseKcalPer100g ||
      isNaN(reverseCaloriesNum) ||
      isNaN(reverseKcalNum) ||
      reverseCaloriesNum <= 0 ||
      reverseKcalNum <= 0
    ) {
      setError('Nieprawidłowa wartość kalorii lub kcal/100g');
      return;
    }

    const calculatedWeight = (reverseCaloriesNum * 100) / reverseKcalNum;

    setReverseResult(Math.round(calculatedWeight * 100) / 100);
    setLastReverseKcalPer100g(reverseKcalPer100g);
    setReverseCalories('');
    setReverseKcalPer100g('');
  };

  return {
    selectedProduct, setSelectedProduct,
    kcalPer100g, setKcalPer100g,
    weight, setWeight,
    protein, setProtein,
    fat, setFat,
    carbs, setCarbs,
    result, setResult,
    error, setError,
    manualMode, setManualMode,
    filteredProducts, setFilteredProducts,
    reverseMode, setReverseMode,
    reverseCalories, setReverseCalories,
    reverseKcalPer100g, setReverseKcalPer100g,
    reverseResult, setReverseResult,
    lastReverseKcalPer100g,
    handleSubmit,
    handleReverseCalc
  };
}