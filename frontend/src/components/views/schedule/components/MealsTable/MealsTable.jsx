import "./MealsTable.css";

const MealsTable = ({ meals, days, onAddMeal, onRenameMeal, maxMeals }) => {
  const columnsTemplate = `140px repeat(${meals.length}, minmax(180px, 1fr)) 140px`;

  return (
    <div className="meals-table">
      {/* ===== HEADER ===== */}
      <div className="table-header" style={{ gridTemplateColumns: columnsTemplate }}>
        <div className="date-column">Data</div>

        {meals.map(meal => (
          <div key={meal.id} className="meal-column">
            <input 
              className="meal-name-input"
              type="text" 
              value={meal.name} 
              onChange={e => onRenameMeal(meal.id, e.target.value)}
            />
          </div>
        ))}

        <button 
          className="add-meal" 
          onClick={onAddMeal} 
          disabled={meals.length >= maxMeals}
          title={meals.length >= maxMeals ? "Limit posiłków osiągnięty" : ""}
        >
          + Dodaj posiłek
        </button>
      </div>

      {/* ===== BODY ===== */}
      <div className="table-body">
        {days.map(day => (
          <div key={day.date} className="table-row" style={{ gridTemplateColumns: columnsTemplate }}>
            <div className="date-cell">{day.date}</div>

            {meals.map(meal => (
              <div key={meal.id} className="meal-cell"></div>
            ))}

            <div /> {/* pusta kolumna pod przycisk */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsTable;