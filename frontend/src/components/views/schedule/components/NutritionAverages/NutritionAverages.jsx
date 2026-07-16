import { getMonthlyAverages, getLast7DaysAverages } from "../../utils/nutritionAverages";
import "./NutritionAverages.css";

const NutritionAverages = ({ days }) => {
  const monthlyAverages = getMonthlyAverages(days);
  const last7DaysAverages = getLast7DaysAverages(days);

  return (
    <div className="nutrition-averages">

      <div className="average-card">
        <h3>Średnia miesiąca</h3>

        <div>{monthlyAverages.kcal.toFixed(0)} kcal</div>
        <div>B: {monthlyAverages.protein.toFixed(1)} g</div>
        <div>T: {monthlyAverages.fat.toFixed(1)} g</div>
        <div>W: {monthlyAverages.carbs.toFixed(1)} g</div>
      </div>

      <div className="average-card">
        <h3>Ostatnie 7 dni</h3>

        <div>{last7DaysAverages.kcal.toFixed(0)} kcal</div>
        <div>B: {last7DaysAverages.protein.toFixed(1)} g</div>
        <div>T: {last7DaysAverages.fat.toFixed(1)} g</div>
        <div>W: {last7DaysAverages.carbs.toFixed(1)} g</div>
      </div>

    </div>
  );
};

export default NutritionAverages;