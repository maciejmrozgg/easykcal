import { useState, useEffect } from "react";
import MealsTable from "../MealsTable/MealsTable";
import scheduleApi from "../../api/scheduleApi";
import "./MonthView.css";

const MAX_MEALS = 6;

const DEFAULT_MEALS = [
  { id: "1", name: "Posiłek 1" },
  { id: "2", name: "Posiłek 2" },
  { id: "3", name: "Posiłek 3" },
  { id: "4", name: "Posiłek 4" }
];

const MonthView = ({ year, month, onBack }) => {
  const [meals, setMeals] = useState([]);
  const [days, setDays] = useState([]);
  const [deficitLimit, setDeficitLimit] = useState(1350);
  const [zeroLimit, setZeroLimit] = useState(1500);
  const [deficitDraft, setDeficitDraft] = useState(deficitLimit);
  const [zeroDraft, setZeroDraft] = useState(zeroLimit);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH MONTH ===== */
  useEffect(() => {
    setLoading(true);
    scheduleApi.getMonth(year, month)
      .then(schedule => {
        const fetchedMeals = schedule?.meals?.length ? schedule.meals : DEFAULT_MEALS;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const fullMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
          const backendDay = schedule?.days?.find(d => d.date === dateStr);
          return {
            date: dateStr,
            meals: backendDay
              ? backendDay.meals
              : Object.fromEntries(fetchedMeals.map(m => [m.id, []]))
          };
        });

        setMeals(fetchedMeals);
        setDays(fullMonthDays);
        setDeficitLimit(schedule?.kcal_limit || 1350);
        setZeroLimit(schedule?.zero_kcal_limit || 1500);
      })
      .catch(err => console.error("Failed to fetch schedule:", err))
      .finally(() => setLoading(false));
  }, [year, month]);

  useEffect(() => {
    setDeficitDraft(deficitLimit);
    setZeroDraft(zeroLimit);
  }, [deficitLimit, zeroLimit]);


  /* ===== MEALS CRUD ===== */
  const addMealColumn = async () => {
    if (meals.length >= MAX_MEALS) return;
    try {
      const schedule = await scheduleApi.addMeal(year, month, "Nowy posiłek");
      setMeals(schedule.meals);

      // Odśwież wszystkie dni
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      setDays(Array.from({ length: daysInMonth }, (_, i) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
        const backendDay = schedule.days?.find(d => d.date === dateStr);
        const dayMeals = backendDay
          ? backendDay.meals
          : Object.fromEntries(schedule.meals.map(m => [m.id, []]));
        return { date: dateStr, meals: dayMeals };
      }));
    } catch (err) {
      console.error("Failed to add meal:", err);
    }
  };

  const renameMeal = async (mealId, newName) => {
    try {
      const schedule = await scheduleApi.updateMealName(year, month, mealId, newName);
      setMeals(schedule.meals);
    } catch (err) {
      console.error("Failed to rename meal:", err);
    }
  };

  const deleteMeal = async (mealId) => {
    try {
      const schedule = await scheduleApi.deleteMeal(year, month, mealId);
      setMeals(schedule.meals);

      // Odśwież dni po usunięciu posiłku
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      setDays(Array.from({ length: daysInMonth }, (_, i) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
        const backendDay = schedule.days?.find(d => d.date === dateStr);
        const dayMeals = backendDay
          ? backendDay.meals
          : Object.fromEntries(schedule.meals.map(m => [m.id, []]));
        return { date: dateStr, meals: dayMeals };
      }));
    } catch (err) {
      console.error("Failed to delete meal:", err);
    }
  };

  /* ===== INGREDIENTS CRUD ===== */
  const handleUpdateIngredient = async (dayIndex, mealId, ingredientIndex, ingredient) => {
    const date = days[dayIndex].date; // <- data z tablicy days
    let schedule;

    try {
      if (ingredient) {
        if (ingredientIndex !== null) {
          // PATCH
          schedule = await scheduleApi.updateIngredient(
            year,
            month,
            date,
            ingredientIndex,
            { mealId, ...ingredient }
          );
        } else {
          // POST
          schedule = await scheduleApi.addIngredient(year, month, date, { mealId, ...ingredient });
        }
      } else {
        // DELETE
        schedule = await scheduleApi.deleteIngredient(
          year,
          month,
          date,
          ingredientIndex,
          mealId
        );
      }

      // Odśwież wszystkie dni z backendu
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      setDays(Array.from({ length: daysInMonth }, (_, i) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
        const backendDay = schedule.days?.find(d => d.date === dateStr);
        const dayMeals = backendDay
          ? backendDay.meals
          : Object.fromEntries(schedule.meals.map(m => [m.id, []]));
        return { date: dateStr, meals: dayMeals };
      }));
    } catch (err) {
      console.error("Failed to update ingredient:", err);
    }
  };


  /* ===== LIMIT ===== */
  const updateLimits = async (newDeficit, newZero) => {
    try {
      const schedule = await scheduleApi.updateLimits(
        year,
        month,
        newDeficit,
        newZero
      );
      setDeficitLimit(schedule.kcal_limit);
      setZeroLimit(schedule.zero_kcal_limit);
    } catch (err) {
      console.error("Failed to update limits:", err);
    }
  };

  if (loading) return <div>Ładowanie harmonogramu...</div>;

  return (
    <div className="month-view">
      <div className="month-header">
        <button className="back-btn" onClick={onBack}>← Wybierz miesiąc</button>
        <div className="kcal-limit">
          Deficyt kaloryczny:
          <input
            type="number"
            value={deficitDraft}
            onChange={e => setDeficitDraft(Number(e.target.value))}
            onBlur={() => updateLimits(deficitDraft, zeroDraft)}
          />

          Zero kaloryczne:
          <input
            type="number"
            value={zeroDraft}
            onChange={e => setZeroDraft(Number(e.target.value))}
            onBlur={() => updateLimits(deficitDraft, zeroDraft)}
          />
        </div>
      </div>

      <MealsTable
        meals={meals}
        days={days}
        deficitLimit={deficitLimit}
        zeroLimit={zeroLimit}
        onAddMeal={addMealColumn}
        onRenameMeal={renameMeal}
        onDeleteMeal={deleteMeal}
        onUpdateIngredient={handleUpdateIngredient}
        maxMeals={MAX_MEALS}
      />
    </div>
  );
};

export default MonthView;