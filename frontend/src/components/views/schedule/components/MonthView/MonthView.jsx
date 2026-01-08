import { useState, useMemo } from "react";
import MealsTable from "../MealsTable/MealsTable";
import "./MonthView.css";

const DEFAULT_MEALS = [
  { id: "breakfast", name: "Śniadanie" },
  { id: "lunch", name: "Obiad" },
  { id: "dinner", name: "Kolacja" }
];

const MAX_MEALS = 6;

const MonthView = ({ year, month, onBack }) => {
  const [meals, setMeals] = useState(DEFAULT_MEALS);

  // dni miesiąca
  const days = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
      meals: Object.fromEntries(DEFAULT_MEALS.map(meal => [meal.id, null]))
    }));
  }, [year, month]);

  // dodanie nowego posiłku z limitem
  const addMealColumn = () => {
    if (meals.length >= MAX_MEALS) return;
    const id = crypto.randomUUID();
    const name = "Nowy posiłek";
    setMeals(prev => [...prev, { id, name }]);
  };

  // edycja nazwy posiłku
  const renameMeal = (id, newName) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, name: newName } : m));
  };

  return (
    <div className="month-view">
      <button className="back-btn" onClick={onBack}>← Wybierz miesiąc</button>
      <MealsTable
        meals={meals}
        days={days}
        onAddMeal={addMealColumn}
        onRenameMeal={renameMeal}
        maxMeals={MAX_MEALS}
      />
    </div>
  );
};

export default MonthView;