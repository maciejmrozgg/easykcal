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

  return (
    <section className="component schedule">

      {/* Nawigacja roku */}
      <div className="year-navigation">
        <button
          type="button"
          className="year-btn"
          aria-label="Poprzedni rok"
          onClick={() => setYear(y => y - 1)}
        >
          ◀
        </button>

        <span className="year" aria-live="polite">{year}</span>

        <button
          type="button"
          className="year-btn"
          aria-label="Następny rok"
          onClick={() => setYear(y => y + 1)}
        >
          ▶
        </button>
      </div>

      {/* Siatka miesięcy */}
      <div className="months-grid">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            type="button"
            className={`month-tile ${selectedMonth === index ? "active" : ""}`}
            onClick={() => setSelectedMonth(index)}
            aria-pressed={selectedMonth === index}
          >
            {month}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Schedule;