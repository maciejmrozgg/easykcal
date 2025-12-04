import './styles/Navbar.css';
import { FaMoon, FaSun } from 'react-icons/fa';
import logo from '../../assets/react.svg';

const Navbar = ({ darkMode, setDarkMode, onRegisterClick, onLoginClick, onLogout, user }) => {
  return (
    <div className="navbar">
      <a href="#home" className="logo">
        <img src={logo} alt="Logo" width={32} height={32} />
        Home
      </a>

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
