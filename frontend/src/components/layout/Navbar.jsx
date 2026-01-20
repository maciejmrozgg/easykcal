import './styles/Navbar.css';
import { FaMoon, FaSun } from 'react-icons/fa';

const Navbar = ({ darkMode, setDarkMode, onRegisterClick, onLoginClick, onLogout, user, setActiveView }) => {
  return (
    <div className="navbar">
      <button className="home" onClick={() => setActiveView("home")}>
        <span className="home-text">🏠 Home</span>
      </button>

      <div className="nav-actions">
        <nav className="nav-links">
          {user ? (
            <>
              <span className="user-email">Witaj, {user.email}</span>
              <button className="btn btn-logout" onClick={onLogout}>Wyloguj</button>
            </>
          ) : (
            <>
              <button className="btn btn-login" onClick={onLoginClick}>Zaloguj się</button>
              <button className="btn btn-register" onClick={onRegisterClick}>Zarejestruj się</button>
            </>
          )}
        </nav>

        {/* Theme switcher */}
        <button
          className="themeSwitcher"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Zmień motyw"
          type="button"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;