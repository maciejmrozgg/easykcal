import { useEffect, useState } from "react";
import MealsTable from "../MealsTable";
import scheduleApi from "../../api/scheduleApi";
import "./MonthView.css";

const MAX_MEALS = 6;

const buildDaysFromSchedule = (schedule, year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
    const backendDay = schedule.days?.find(d => d.date === dateStr);
    return {
      date: dateStr,
      meals: backendDay
        ? backendDay.meals
        : Object.fromEntries(schedule.meals.map(m => [m.id, []]))
    };
  });
};

const MonthView = ({ year, month, onBack }) => {
  const [meals, setMeals] = useState([]);
  const [days, setDays] = useState([]);
  const [deficitLimit, setDeficitLimit] = useState(0);
  const [zeroLimit, setZeroLimit] = useState(0);
  const [deficitDraft, setDeficitDraft] = useState(0);
  const [zeroDraft, setZeroDraft] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH ===== */
  useEffect(() => {
    setLoading(true);
    scheduleApi.getMonth(year, month)
      .then(schedule => {
        setMeals(schedule.meals);
        setDays(buildDaysFromSchedule(schedule, year, month));
        setDeficitLimit(schedule.kcal_limit);
        setZeroLimit(schedule.zero_kcal_limit);
      })
      .catch(err => console.error("Fetch schedule failed:", err))
      .finally(() => setLoading(false));
  }, [year, month]);

  useEffect(() => {
    setDeficitDraft(deficitLimit);
    setZeroDraft(zeroLimit);
  }, [deficitLimit, zeroLimit]);

  const refreshFromSchedule = (schedule) => {
    setMeals(schedule.meals);
    setDays(buildDaysFromSchedule(schedule, year, month));
  };

  /* ===== MEALS ===== */
  const addMealColumn = async () => {
    if (meals.length >= MAX_MEALS) return;
    const schedule = await scheduleApi.addMeal(year, month, "Nowy posiłek");
    refreshFromSchedule(schedule);
  };

  const renameMeal = async (mealId, name) => {
    const schedule = await scheduleApi.updateMealName(year, month, mealId, name);
    setMeals(schedule.meals);
  };

  const deleteMeal = async (mealId) => {
    const schedule = await scheduleApi.deleteMeal(year, month, mealId);
    refreshFromSchedule(schedule);
  };

  /* ===== INGREDIENTS ===== */
  const handleUpdateIngredient = async (dayIndex, mealId, ingredientIndex, ingredient) => {
    const date = days[dayIndex].date;
    let schedule;

    if (ingredient) {
      schedule = ingredientIndex != null
        ? await scheduleApi.updateIngredient(year, month, date, ingredientIndex, { mealId, ...ingredient })
        : await scheduleApi.addIngredient(year, month, date, { mealId, ...ingredient });
    } else {
      schedule = await scheduleApi.deleteIngredient(year, month, date, ingredientIndex, mealId);
    }

    refreshFromSchedule(schedule);
  };

  /* ===== LIMITS ===== */
  const updateLimits = async () => {
    const schedule = await scheduleApi.updateLimits(year, month, deficitDraft, zeroDraft);
    setDeficitLimit(schedule.kcal_limit);
    setZeroLimit(schedule.zero_kcal_limit);
  };

  if (loading) return <div>Ładowanie harmonogramu…</div>;

  return (
    <div className="month-view">
      {/* HEADER */}
      <header className="month-header">
        <button className="back-btn" onClick={onBack}>← Wybierz miesiąc</button>
        <div className="kcal-limit">
          <label>
            Deficyt kaloryczny:
            <input
              type="number"
              title="Zmiana limitu deficytu kalorycznego"
              value={deficitDraft}
              onChange={e => setDeficitDraft(+e.target.value)}
              onBlur={updateLimits}
            />
          </label>

          <label>
            Zero kaloryczne:
            <input
              type="number"
              title="Zmiana limitu zera kalorycznego"
              value={zeroDraft}
              onChange={e => setZeroDraft(+e.target.value)}
              onBlur={updateLimits}
            />
          </label>
        </div>
      </header>

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