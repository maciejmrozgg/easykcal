import { useState, useEffect, useRef } from "react";
import "./MealsTableDesktop.css";
import IngredientModal from "../../modals/IngredientModal";
import DaySummary from "../../DaySummary/DaySummary";

/* ===== HEADER POSIŁKU (rename na blur) ===== */
const MealHeader = ({ meal, onRenameMeal, onDeleteMeal }) => {
  const [value, setValue] = useState(meal.name);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="meal-column">
      <input
        className="meal-name-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => {
          if (value !== meal.name) {
            onRenameMeal(meal.id, value);
          }
        }}
      />
      <button
        className="delete-meal"
        onClick={async () => {
          if (isDeleting) return;
          const confirmed = window.confirm("Czy na pewno chcesz usunąć ten posiłek?");
          if (!confirmed) return;

          setIsDeleting(true);
          await onDeleteMeal(meal.id);
          setTimeout(() => setIsDeleting(false), 2000);
        }}
        title="Usuń posiłek"
        disabled={isDeleting}
      >
        ❌
      </button>
    </div>
  );
};

/* ===== GŁÓWNA TABELA ===== */
const MealsTable = ({
  meals,
  days,
  deficitLimit,
  zeroLimit,
  onAddMeal,
  onRenameMeal,
  onUpdateIngredient,
  onDeleteMeal,
  maxMeals,
  scrollToDate,
  onScrollComplete
}) => {
  const columnsTemplate = `140px repeat(${meals.length}, minmax(180px, 1fr)) 180px 140px`;

  /* ===== MODAL STATE ===== */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalDayIndex, setModalDayIndex] = useState(null);
  const [modalMealId, setModalMealId] = useState(null);
  const [modalIngredientIndex, setModalIngredientIndex] = useState(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    if (!scrollToDate) return;

    const todayIndex = days.findIndex(day => day.date === scrollToDate);

    if (todayIndex !== -1) {
      rowRefs.current[todayIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
      onScrollComplete();
    }
  }, [scrollToDate, days, onScrollComplete]);

  /* ===== HELPERS ===== */
  const getMealTotals = (ingredients) => {
    if (!Array.isArray(ingredients)) return { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 };
    return ingredients.reduce(
      (acc, i) => ({
        kcal: acc.kcal + (i.kcal || 0),
        weight: acc.weight + (i.weight || 0),
        protein: acc.protein + (i.protein || 0),
        fat: acc.fat + (i.fat || 0),
        carbs: acc.carbs + (i.carbs || 0)
      }),
      { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 }
    );
  };

  const getDayTotals = (day) => {
    if (!day?.meals) return { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 };
    return Object.values(day.meals).reduce(
      (acc, meal) => {
        if (!Array.isArray(meal)) return acc;
        meal.forEach(i => {
          acc.kcal += i.kcal || 0;
          acc.weight += i.weight || 0;
          acc.protein += i.protein || 0;
          acc.fat += i.fat || 0;
          acc.carbs += i.carbs || 0;
        });
        return acc;
      },
      { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 }
    );
  };

  /* ===== MODAL HANDLERS ===== */
  const openIngredientModal = (dayIndex, mealId, ingredient = null, ingredientIndex = null) => {
    setModalDayIndex(dayIndex);
    setModalMealId(mealId);
    setModalData(ingredient);
    setModalIngredientIndex(ingredientIndex);
    setModalOpen(true);
  };

  /* ===== RENDER ===== */
  return (
    <div className="meals-table">
      {/* HEADER */}
      <div className="table-header" style={{ gridTemplateColumns: columnsTemplate }}>
        <div className="date-column">Data</div>
        {meals.map(meal => (
          <MealHeader
            key={meal.id}
            meal={meal}
            onRenameMeal={onRenameMeal}
            onDeleteMeal={onDeleteMeal}
          />
        ))}
        <div className="meal-column">Razem</div>
        <button
          className="add-meal"
          onClick={onAddMeal}
          disabled={meals.length >= maxMeals}
        >
          + Dodaj posiłek
        </button>
      </div>

      {/* BODY */}
      <div className="table-body">
        {days.map((day, dayIndex) => {
          const dayTotals = getDayTotals(day);

          return (
            <div
              key={day.date}
              className="table-row"
              ref={el => (rowRefs.current[dayIndex] = el)}
              style={{ gridTemplateColumns: columnsTemplate }}
            >
              <div className="date-cell">{day.date}</div>

              {meals.map(meal => {
                const ingredients = Array.isArray(day.meals?.[meal.id])
                  ? day.meals[meal.id]
                  : [];
                const totals = getMealTotals(ingredients);

                return (
                  <div key={meal.id} className="meal-cell">
                    <ul style={{ paddingLeft: "1rem", margin: "0.2rem 0" }}>
                      {ingredients.map((i, idx) => (
                        <li
                          className="ingredient-item"
                          key={idx}
                          onClick={() => openIngredientModal(dayIndex, meal.id, i, idx)}
                          style={{ cursor: "pointer" }}
                          title="Kliknij, aby edytować składnik"
                        >
                          {i.name} ({i.weight}g / {i.kcal} kcal)
                        </li>
                      ))}
                    </ul>

                    {ingredients.length > 0 && (
                      <div style={{ fontWeight: "bold", marginTop: "4px" }}>
                        <div>{totals.weight}g / {totals.kcal} kcal</div>
                        <div>B: {totals.protein.toFixed(1)}g</div>
                        <div>T: {totals.fat.toFixed(1)}g</div>
                        <div>W: {totals.carbs.toFixed(1)}g</div>
                      </div>
                    )}

                    <div
                      onClick={() => openIngredientModal(dayIndex, meal.id)}
                      style={{ cursor: "pointer", color: "#999", marginTop: "4px" }}
                      title="Dodaj składnik"
                    >
                      + Dodaj składnik
                    </div>
                  </div>
                );
              })}

              <DaySummary
                dayTotals={dayTotals}
                deficitLimit={deficitLimit}
                zeroLimit={zeroLimit}
              />

              <div />
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      <IngredientModal
        open={modalOpen}
        initialData={modalData}
        onClose={() => {
          setModalOpen(false);
          setModalData(null);
          setModalIngredientIndex(null);
        }}

        onSave={async (ingredient) => {
          try {
            await onUpdateIngredient(
              modalDayIndex,
              modalMealId,
              modalIngredientIndex,
              ingredient
            );
            setModalData(null);
            setModalIngredientIndex(null);
            setModalOpen(false);
          } catch (err) {
            console.log("Failed to save ingredient:", err);
          }
        }}

        onDelete={async () => {
          try {
            await onUpdateIngredient(
              modalDayIndex,
              modalMealId,
              modalIngredientIndex,
              null
            );
            setModalData(null);
            setModalIngredientIndex(null);
            setModalOpen(false);
          } catch (err) {
            console.log("Failed to delete ingredient:", err);
          }
        }}
      />
    </div>
  );
};

export default MealsTable;