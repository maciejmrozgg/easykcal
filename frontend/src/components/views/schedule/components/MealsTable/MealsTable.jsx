import "./MealsTable.css";

const MealsTable = ({
  meals,
  days,
  onAddMeal,
  onRenameMeal,
  onAddIngredient,
  maxMeals
}) => {
  // Data | posiłki | Razem | +
  const columnsTemplate = `140px repeat(${meals.length}, minmax(180px, 1fr)) 180px 140px`;

  /* ===== HELPERS ===== */

  const getMealTotals = (ingredients) => {
    if (!Array.isArray(ingredients)) {
      return { kcal: 0, weight: 0 };
    }

    return ingredients.reduce(
      (acc, i) => ({
        kcal: acc.kcal + (i.kcal || 0),
        weight: acc.weight + (i.weight || 0)
      }),
      { kcal: 0, weight: 0 }
    );
  };

  const getDayTotals = (day) => {
    if (!day?.meals) {
      return { kcal: 0, weight: 0 };
    }

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

  const handleAddIngredient = (dayIndex, mealId) => {
    const name = prompt("Nazwa składnika:");
    if (!name) return;

    const weight = Number(prompt("Waga (g):")) || 0;
    const kcal = Number(prompt("Kalorie:")) || 0;

    onAddIngredient(dayIndex, mealId, { name, weight, kcal });
  };

  /* ===== RENDER ===== */

  return (
    <div className="meals-table">
      {/* ===== HEADER ===== */}
      <div className="table-header" style={{ gridTemplateColumns: columnsTemplate }}>
        <div className="date-column">Data</div>

        {meals.map(meal => (
          <div key={meal.id} className="meal-column">
            <input
              className="meal-name-input"
              value={meal.name}
              onChange={e => onRenameMeal(meal.id, e.target.value)}
            />
          </div>
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

      {/* ===== BODY ===== */}
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
                  <div
                    key={meal.id}
                    className="meal-cell"
                    onClick={() => handleAddIngredient(dayIndex, meal.id)}
                    title="Kliknij, aby dodać składnik"
                    style={{ cursor: "pointer" }}
                  >
                    {ingredients.map((i, idx) => (
                      <div key={idx}>
                        {i.name} ({i.weight}g / {i.kcal} kcal)
                      </div>
                    ))}

                    {ingredients.length > 0 && (
                      <div style={{ fontWeight: "bold", marginTop: "4px" }}>
                        {totals.weight}g / {totals.kcal} kcal
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ===== RAZEM ===== */}
              <div className="meal-cell total">
                <strong>
                  {dayTotals.weight}g / {dayTotals.kcal} kcal
                </strong>
              </div>

              <div /> {/* kolumna pod przycisk + */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealsTable;
