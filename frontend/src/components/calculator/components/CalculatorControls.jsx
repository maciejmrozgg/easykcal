export default function CalculatorControls({ manualMode, setManualMode, reverseMode, setReverseMode }) {
  return (
    <div className="calc-controls">
      <h2>Kalkulator kalorii</h2>

      {!reverseMode && (
        <button onClick={() => setManualMode(!manualMode)}>
          {manualMode ? 'Wybierz z listy produktów' : 'Wpisz kalorie ręcznie'}
        </button>
      )}

      <button
        onClick={() => setReverseMode(!reverseMode)}
        className={`swap-btn ${reverseMode ? "active" : ""}`}>
        {reverseMode ? '↩ Powrót do kalkulatora' : '⇄ Kalkulator odwrotny'}
      </button>
    </div>
  );
}
