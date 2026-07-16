import { getMonthlyAverages, getLast7DaysAverages } from "../../utils/nutritionAverages";
import "./NutritionAverages.css";

const NutritionAverages = ({ days, isCurrentMonth, onHighlightDays, onJumpToDate }) => {
    /* ===== CALCULATED AVERAGES ===== */
    const monthly = getMonthlyAverages(days);
    const last7 = getLast7DaysAverages(days);

    /* ===== RENDER ===== */
    return (
        <div className="nutrition-averages">

            <div className="average-card">
                <h3>📅 Średnia miesiąca</h3>

                <div>{monthly.averages.kcal.toFixed(0)} kcal</div>
                <div>B: {monthly.averages.protein.toFixed(1)} g</div>
                <div>T: {monthly.averages.fat.toFixed(1)} g</div>
                <div>W: {monthly.averages.carbs.toFixed(1)} g</div>

                <div className="average-days-label">
                    Liczone z dni:
                </div>
                <div className="average-days">
                    {monthly.days.map(day => (
                        <span
                            key={day.date}
                            className="average-day"
                            onClick={() => onJumpToDate(day.date)}
                            title="Przewiń do tego dnia"
                        >
                            {day.date.split("-")[2]}
                        </span>
                    ))}
                </div>
            </div>

            {isCurrentMonth && (
                <div
                    className="average-card"
                    onMouseEnter={() => onHighlightDays(last7.days)}
                    onMouseLeave={() => onHighlightDays([])}
                >
                    <h3>📈 Ostatnie 7 dni</h3>
                    <div className="average-hint">
                        Najedź, aby podświetlić dni
                    </div>

                    <div>{last7.averages.kcal.toFixed(0)} kcal</div>
                    <div>B: {last7.averages.protein.toFixed(1)} g</div>
                    <div>T: {last7.averages.fat.toFixed(1)} g</div>
                    <div>W: {last7.averages.carbs.toFixed(1)} g</div>

                    <div className="average-days-label">
                        Liczone z dni:
                    </div>
                    <div className="average-days">
                        {last7.days.map(day => (
                            <span
                                key={day.date}
                                className="average-day"
                                onClick={() => onJumpToDate(day.date)}
                                title="Przewiń do tego dnia"
                            >
                                {day.date.split("-")[2]}
                            </span>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default NutritionAverages;