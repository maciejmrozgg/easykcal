import "./styles/GuestBanner.css";

export default function GuestBanner({ onLoginClick, onRegisterClick }) {
  return (
    <div className="guest-banner">
      <p>
        <em>
          Aby korzystać z <strong>przepisów</strong> i{" "}
          <strong>harmonogramu posiłków</strong>, załóż darmowe konto
          lub zaloguj się.
        </em>
      </p>
      <div className="guest-banner-actions">
        <button onClick={onRegisterClick} className="primary">
          Załóż konto
        </button>
        <button onClick={onLoginClick} className="secondary">
          Zaloguj się
        </button>
      </div>
    </div>
  );
}