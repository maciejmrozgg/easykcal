import { useState, useEffect } from "react";
import MealsTable from "../MealsTable/MealsTable";
import "./MonthView.css";

const DEFAULT_MEALS = [
  { id: "1", name: "Posilek 1" },
  { id: "2", name: "Posilek 2" },
  { id: "3", name: "Posilek 3" },
  { id: "4", name: "Posilek 4" }
];

const MAX_MEALS = 6;

const MonthView = ({ year, month, onBack }) => {
  const [meals, setMeals] = useState(DEFAULT_MEALS);
  const [days, setDays] = useState([]);

  /* ===== INIT DAYS ===== */
  useEffect(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const initialDays = Array.from({ length: daysInMonth }, (_, i) => ({
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i + 1
      ).padStart(2, "0")}`,
      meals: Object.fromEntries(
        DEFAULT_MEALS.map(meal => [meal.id, []])
      )
    }));

    setDays(initialDays);
  }, [year, month]);

  /* ===== MEALS ===== */

  const addMealColumn = () => {
    if (meals.length >= MAX_MEALS) return;

    const id = crypto.randomUUID();
    const name = "Nowy posiłek";

    setMeals(prev => [...prev, { id, name }]);

    setDays(prev =>
      prev.map(day => ({
        ...day,
        meals: {
          ...day.meals,
          [id]: []
        }
      }))
    );
  };

  const renameMeal = (id, newName) => {
    setMeals(prev =>
      prev.map(m => (m.id === id ? { ...m, name: newName } : m))
    );
  };

  /* ===== INGREDIENTS ===== */

  const handleAddIngredient = (dayIndex, mealId, ingredient) => {
    setDays(prev =>
      prev.map((day, i) => {
        if (i !== dayIndex) return day;

        return {
          ...day,
          meals: {
            ...day.meals,
            [mealId]: [...(day.meals[mealId] || []), ingredient]
          }
        };
      })
    );
  };

  const handleUpdateIngredient = (dayIndex, mealId, ingredientIndex, ingredient) => {
    const newDays = [...days];
    const mealIngredients = newDays[dayIndex].meals[mealId] || [];

    if (ingredient) {
      // edycja lub dodanie
      if (ingredientIndex !== null) {
        mealIngredients[ingredientIndex] = ingredient; 
      } else {
        mealIngredients.push(ingredient);
      }
    } else {
      // usuwanie
      if (ingredientIndex !== null) {
        mealIngredients.splice(ingredientIndex, 1);
      }
    }

    newDays[dayIndex].meals[mealId] = mealIngredients;
    setDays(newDays);
  };

  /* ===== RENDER ===== */

  return (
    <div className="month-view">
      <button className="back-btn" onClick={onBack}>
        ← Wybierz miesiąc
      </button>

      <MealsTable
        meals={meals}
        days={days}
        onAddMeal={addMealColumn}
        onRenameMeal={renameMeal}
        onAddIngredient={handleAddIngredient}
        onUpdateIngredient={handleUpdateIngredient}
        maxMeals={MAX_MEALS}
      />
    </div>
  );
};

export default MonthView;