import { FaExchangeAlt } from 'react-icons/fa';

export default function CalculatorControls({ manualMode, setManualMode, reverseMode, setReverseMode }) {
  return (
    <div className="calc-controls">
      <h2>Kalkulator kalorii</h2>

      <button onClick={() => setManualMode(!manualMode)}>
        {manualMode ? 'Wybierz z listy produktów' : 'Wpisz kalorie ręcznie'}
      </button>

      <button onClick={() => setReverseMode(!reverseMode)} className="swap-btn">
        <FaExchangeAlt /> {reverseMode ? 'Tryb kcal → g' : 'Tryb g → kcal'}
      </button>
    </div>
  );
}
