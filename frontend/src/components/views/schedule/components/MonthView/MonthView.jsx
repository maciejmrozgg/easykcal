import { useEffect, useState } from "react";
import { useToast } from "../../../../ui/toast/hooks/useToast";
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
  const { showToast } = useToast();

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

    showToast(
      `Dodano posiłek: Nowy posiłek`,
      "success"
    );
  };

  const renameMeal = async (mealId, name) => {
    const schedule = await scheduleApi.updateMealName(year, month, mealId, name);
    setMeals(schedule.meals);

    showToast(
      `Zmieniono nazwę posiłku na ${name}`,
      "info"
    );
  };

  const deleteMeal = async (mealId) => {
    const mealName = meals.find(m => m.id === mealId)?.name;

    const schedule = await scheduleApi.deleteMeal(year, month, mealId);
    refreshFromSchedule(schedule);

    showToast(
      `Usunięto posiłek: ${mealName}`,
      "info"
    );
  };

  /* ===== INGREDIENTS ===== */
  const handleUpdateIngredient = async (dayIndex, mealId, ingredientIndex, ingredient) => {
    const date = days[dayIndex].date;
    const mealName = meals.find(m => m.id === mealId)?.name;

    let schedule;

    if (ingredient) {
      if (ingredientIndex != null) {
        schedule = await scheduleApi.updateIngredient(year, month, date, ingredientIndex, { mealId, ...ingredient });

        showToast(
          `Zaktualizowano składnik: ${ingredient.name}`,
          "info"
        );

      } else {
        schedule = await scheduleApi.addIngredient(year, month, date, { mealId, ...ingredient });

        showToast(
          `Dodano ${ingredient.name} do posiłku ${mealName}`,
          "success"
        );
      }

    } else {
      schedule = await scheduleApi.deleteIngredient(year, month, date, ingredientIndex, mealId);
      const ingredientName =
        ingredientIndex != null
          ? days[dayIndex].meals[mealId][ingredientIndex]?.name
          : "";

      showToast(
        `Usunięto składnik ${ingredientName}`,
        "info"
      );
    }

    refreshFromSchedule(schedule);
  };

  /* ===== LIMITS ===== */
  const updateLimits = async () => {
    if (zeroDraft < deficitDraft) {
      showToast(
        "Najpierw ustaw zero kaloryczne większe lub równe deficytowi",
        "warning"
      );
      return;
    }

    const schedule = await scheduleApi.updateLimits(year, month, deficitDraft, zeroDraft);
    setDeficitLimit(schedule.kcal_limit);
    setZeroLimit(schedule.zero_kcal_limit);

    showToast(
      `Deficyt: ${deficitDraft} kcal | Zero: ${zeroDraft} kcal`,
      "info"
    );
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