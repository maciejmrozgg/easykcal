import { useState } from "react";
import { useToast } from "../../ui/toast/hooks/useToast";
import "./Schedule.css";
import MonthView from "./components/MonthView/MonthView";
import ScheduleInfoBanner from "./components/ScheduleInfoBanner/ScheduleInfoBanner";

const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień",
  "Maj", "Czerwiec", "Lipiec", "Sierpień",
  "Wrzesień", "Październik", "Listopad", "Grudzień"
];

const Schedule = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [scrollToDate, setScrollToDate] = useState(null);
  const { showToast } = useToast();

  const handleGoToToday = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setSelectedMonth(today.getMonth());

    const todayString =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setScrollToDate(todayString);

    showToast(
      `Przeniesiono do ${todayString}`,
      "success"
    );
  };

  return (
    <section className="component schedule">

      {selectedMonth === null ? (
        <>
          <ScheduleInfoBanner />
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
          onTodayButton={handleGoToToday}
          scrollToDate={scrollToDate}
          onScrollComplete={() => setScrollToDate(null)}
        />
      )}

    </section>
  );
};

export default Schedule;