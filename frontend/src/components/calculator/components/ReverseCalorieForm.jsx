import '../styles/ReverseCalorieForm.css';

export default function ReverseCalorieForm({
  reverseCalories,
  setReverseCalories,
  reverseKcalPer100g,
  setReverseKcalPer100g,
  reverseResult,
  lastReverseKcalPer100g,
  handleReverseCalc,
}) {
  return (
    <form onSubmit={handleReverseCalc} className="reverse-calculator" style={{ marginTop: '1rem' }}>
      <h3>Przelicz kalorie na gramy</h3>

      <div>
        <label>Kalorie:</label>
        <input
          type="number"
          placeholder="Wpisz liczbę kalorii..."
          value={reverseCalories}
          onChange={(e) => setReverseCalories(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Kcal na 100g:</label>
        <input
          type="number"
          placeholder="Wpisz kalorie na 100g..."
          value={reverseKcalPer100g}
          onChange={(e) => setReverseKcalPer100g(e.target.value)}
          required
        />
      </div>

      <button type="submit">Oblicz</button>

      {reverseResult !== null && (
        <div className="reverse-result">
          {reverseResult.toFixed(2)} g{' '}
          <span>(dla {lastReverseKcalPer100g} kcal/100g)</span>
        </div>
      )}
    </form>
  );
}