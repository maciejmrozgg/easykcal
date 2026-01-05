const DaysList = ({ year, month }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <aside className="days-list">
      {Array.from({ length: daysInMonth }, (_, i) => (
        <div key={i} className="day-item">
          {String(i + 1).padStart(2, "0")}.{String(month + 1).padStart(2, "0")}.{year}
        </div>
      ))}
    </aside>
  );
};

export default DaysList;