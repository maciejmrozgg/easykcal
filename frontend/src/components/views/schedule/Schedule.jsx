import { useState } from "react";
import "./Schedule.css";

const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień",
  "Maj", "Czerwiec", "Lipiec", "Sierpień",
  "Wrzesień", "Październik", "Listopad", "Grudzień"
];

const Schedule = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleBackToMonths = () => {
    setSelectedMonth(null);
  }

  const getDaysInMonth = (year, monthIndex) => {
    const days = [];
    const date = new Date(year, monthIndex, 1);

    while (date.getMonth() === monthIndex) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  return (
    <section className="component schedule">

      {selectedMonth === null ? (
        <>
          {/* ================== WIDOK WYBORU MIESIĄCA ================== */}
          <div className="year-navigation">
            <button
              type="button"
              className="year-btn"
              onClick={() => setYear(y => y - 1)}
            >
              ◀
            </button>

            <span className="year">{year}</span>

            <button
              type="button"
              className="year-btn"
              onClick={() => setYear(y => y + 1)}
            >
              ▶
            </button>
          </div>

          <div className="months-grid">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                type="button"
                className="month-tile"
                onClick={() => setSelectedMonth(index)}
              >
                {month}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* ================== WIDOK MIESIĄCA ================== */}
          <div className="month-view">

            <button
              type="button"
              className="back-btn"
              onClick={handleBackToMonths}
            >
              ← Wróć do miesięcy
            </button>

            <h3>
              {MONTHS[selectedMonth]} {year}
            </h3>

            <div className="month-layout">
              {/* Lewy panel */}
              <aside className="days-list">
                {getDaysInMonth(year, selectedMonth).map((day) => (
                  <div key={day.toISOString()} className="day-item">
                    {day.toLocaleDateString("pl-PL")}
                  </div>
                ))}
              </aside>

              {/* Prawy panel */}
              <main className="month-content">
                <div className="placeholder">
                  Tu będzie tabela posiłków
                </div>
              </main>
            </div>

          </div>
        </>
      )}

    </section>
  );
};

export default Schedule;