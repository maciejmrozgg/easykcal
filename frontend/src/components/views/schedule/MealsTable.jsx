const MealsTable = () => {
  return (
    <div className="meals-table">
      <div className="table-header">
        <div className="meal-column">Śniadanie</div>
        <div className="meal-column">Obiad</div>
        <div className="meal-column">Kolacja</div>
        <button className="add-meal">+</button>
      </div>

      <div className="table-body">
        {/* Tu później będą wiersze dni */}
      </div>
    </div>
  );
};

export default MealsTable;