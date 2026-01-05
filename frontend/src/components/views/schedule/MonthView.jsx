import DaysList from "./DaysList";
import MealsTable from "./MealsTable";

const MonthView = ({ year, month, onBack }) => {
  return (
    <div className="month-view">
      <button className="back-btn" onClick={onBack}>
        ← Wybierz miesiąc
      </button>

      <div className="month-layout">
        <DaysList year={year} month={month} />
        <MealsTable />
      </div>
    </div>
  );
};

export default MonthView;