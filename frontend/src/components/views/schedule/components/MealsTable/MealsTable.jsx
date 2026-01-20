import { useState } from "react";
import "./MealsTable.css";
import IngredientModal from "../modals/IngredientModal";

/* ===== HEADER POSIŁKU (rename na blur) ===== */
const MealHeader = ({ meal, onRenameMeal, onDeleteMeal }) => {
  const [value, setValue] = useState(meal.name);

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
        onClick={() => onDeleteMeal(meal.id)}
        title="Usuń posiłek"
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
  maxMeals
}) => {
  const columnsTemplate = `140px repeat(${meals.length}, minmax(180px, 1fr)) 180px 140px`;

  /* ===== MODAL STATE ===== */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalDayIndex, setModalDayIndex] = useState(null);
  const [modalMealId, setModalMealId] = useState(null);
  const [modalIngredientIndex, setModalIngredientIndex] = useState(null);

  /* ===== HELPERS ===== */
  const getMealTotals = (ingredients) => {
    if (!Array.isArray(ingredients)) return { kcal: 0, weight: 0 };
    return ingredients.reduce(
      (acc, i) => ({
        kcal: acc.kcal + (i.kcal || 0),
        weight: acc.weight + (i.weight || 0)
      }),
      { kcal: 0, weight: 0 }
    );
  };

  const getDayTotals = (day) => {
    if (!day?.meals) return { kcal: 0, weight: 0 };
    return Object.values(day.meals).reduce(
      (acc, meal) => {
        if (!Array.isArray(meal)) return acc;
        meal.forEach(i => {
          acc.kcal += i.kcal || 0;
          acc.weight += i.weight || 0;
        });
        return acc;
      },
      { kcal: 0, weight: 0 }
    );
  };

  const getLimitClass = (kcal) => {
    if (kcal > zeroLimit) return "danger";
    if (kcal > deficitLimit) return "warning";
    if (kcal > 0) return "normal";
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
                        {totals.weight}g / {totals.kcal} kcal
                      </div>
                    )}

                    <div
                      onClick={() => openIngredientModal(dayIndex, meal.id)}
                      style={{ cursor: "pointer", color: "#999", marginTop: "4px" }}
                    >
                      + Dodaj składnik
                    </div>
                  </div>
                );
              })}

              <div className={`meal-cell total ${getLimitClass(dayTotals.kcal)}`}>
                <strong>{dayTotals.weight}g / {dayTotals.kcal} kcal</strong>
              </div>

              <div />
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      <IngredientModal
        open={modalOpen}
        initialData={modalData}
        onClose={() => setModalOpen(false)}
        onSave={(ingredient) => {
          onUpdateIngredient(
            modalDayIndex,
            modalMealId,
            modalIngredientIndex,
            ingredient
          );
          setModalOpen(false);
        }}
        onDelete={() => {
          onUpdateIngredient(
            modalDayIndex,
            modalMealId,
            modalIngredientIndex,
            null
          );
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default MealsTable;