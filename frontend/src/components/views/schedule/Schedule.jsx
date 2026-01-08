import { useState } from "react";
import "./Schedule.css";
import MonthView from "./components/MonthView/MonthView";

const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień",
  "Maj", "Czerwiec", "Lipiec", "Sierpień",
  "Wrzesień", "Październik", "Listopad", "Grudzień"
];

const Schedule = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <section className="component schedule">

      {selectedMonth === null ? (
        <>
          {/* ===== WIDOK WYBORU MIESIĄCA ===== */}
          <div className="year-navigation">
            <button onClick={() => setYear(y => y - 1)}>◀</button>
            <span className="year">{year}</span>
            <button onClick={() => setYear(y => y + 1)}>▶</button>
          </div>

          <div className="months-grid">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                className="month-tile"
                onClick={() => setSelectedMonth(index)}
              >
                {month}
              </button>
            ))}
          </div>
        </>
      ) : (
        <MonthView
          year={year}
          month={selectedMonth}
          onBack={() => setSelectedMonth(null)}
        />
      )}

    </section>
  );
};

export default Schedule;