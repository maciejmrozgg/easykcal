import { useState, useEffect } from "react";
import IngredientModal from "../../modals/IngredientModal";
import DaySummary from "../../DaySummary/DaySummary";
import "./MealsTableMobile.css";

const MealsTableMobile = ({ days, meals, onUpdateIngredient, zeroLimit, deficitLimit, onAddMeal, maxMeals, onDeleteMeal }) => {
  const [dayIndex, setDayIndex] = useState(0);

  const [openMeals, setOpenMeals] = useState(() =>
    Object.fromEntries(meals.map(meal => [meal.id, true]))
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalMealId, setModalMealId] = useState(null);
  const [modalIngredientIndex, setModalIngredientIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setOpenMeals(prev => {
      const updated = { ...prev };
      meals.forEach(meal => {
        if (!(meal.id in updated)) {
          updated[meal.id] = true;
        }
      });
      return updated;
    });
  }, [meals]);

  const day = days[dayIndex];

  const toggleMeal = (mealId) => {
    setOpenMeals(prev => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };

  const openIngredientModal = (mealId, ingredient = null, index = null) => {
    setModalMealId(mealId);
    setModalData(ingredient);
    setModalIngredientIndex(index);
    setModalOpen(true);
  };

  const getMealTotals = (ingredients) => {
    if (!Array.isArray(ingredients)) {
      return { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 };
    }

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

  const getDayTotals = () => {
    if (!day?.meals) return { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 };
    return Object.values(day.meals).flat().reduce(
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

  const dayTotals = getDayTotals();

  return (
    <div className="meals-mobile" style={{ pointerEvents: isDeleting ? "none" : "auto", opacity: isDeleting ? 0.6 : 1 }}>
      <div className="meals-header">
        <button
          className="add-meal"
          onClick={onAddMeal}
          disabled={meals.length >= maxMeals}
        >
          + Dodaj posiłek
        </button>
      </div>


      {/* NAVIGATION */}
      <div className="day-nav">
        <button
          onClick={() => setDayIndex(i => Math.max(0, i - 1))}
          disabled={dayIndex === 0}
        >
          ◀
        </button>

        <select
          value={dayIndex}
          onChange={e => setDayIndex(Number(e.target.value))}
        >
          {days.map((d, idx) => (
            <option key={d.date} value={idx}>
              {d.date}
            </option>
          ))}
        </select>

        <button
          onClick={() => setDayIndex(i => Math.min(days.length - 1, i + 1))}
          disabled={dayIndex === days.length - 1}
        >
          ▶
        </button>
      </div>

      {/* MEALS */}
      {meals.map(meal => {
        const ingredients = day.meals?.[meal.id] || [];
        const mealTotals = getMealTotals(ingredients);
        const isOpen = openMeals[meal.id];

        return (
          <div key={meal.id} className="meal-card">
            <div className="meal-header">
              <span>{meal.name}</span>

              <div className="meal-header-actions">
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

                <span onClick={() => toggleMeal(meal.id)}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {isOpen && (
              <div className="meal-content">
                <ul>
                  {ingredients.map((i, idx) => (
                    <li
                      key={idx}
                      onClick={() => openIngredientModal(meal.id, i, idx)}
                    >
                      {i.name} ({i.weight}g / {i.kcal} kcal)
                    </li>
                  ))}
                </ul>

                {ingredients.length > 0 && (
                  <div className="meal-totals">
                    <div>{mealTotals.weight}g / {mealTotals.kcal} kcal</div>
                    <div>
                      B: {mealTotals.protein.toFixed(1)}g •
                      T: {mealTotals.fat.toFixed(1)}g •
                      W: {mealTotals.carbs.toFixed(1)}g
                    </div>
                  </div>
                )}

                <button
                  className="add-ingredient"
                  onClick={() => openIngredientModal(meal.id)}
                >
                  + Dodaj składnik
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* SUMMARY */}
      <DaySummary
        dayTotals={dayTotals}
        deficitLimit={deficitLimit}
        zeroLimit={zeroLimit}
      />

      {/* MODAL */}
      <IngredientModal
        open={modalOpen}
        initialData={modalData}
        onClose={() => setModalOpen(false)}
        onSave={(ingredient) => {
          onUpdateIngredient(
            dayIndex,
            modalMealId,
            modalIngredientIndex,
            ingredient
          );
          setModalOpen(false);
        }}
        onDelete={() => {
          onUpdateIngredient(
            dayIndex,
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

export default MealsTableMobile;