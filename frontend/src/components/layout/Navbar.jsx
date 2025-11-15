import './styles/Navbar.css';
import { FaMoon, FaSun } from 'react-icons/fa';
import logo from '../../assets/react.svg';

const Navbar = ({ darkMode, setDarkMode, onRegisterClick }) => {
  return (
    <div className="navbar">
      <a href="#home" className="logo">
        <img src={logo} alt="Logo" width={32} height={32} />
        Home
      </a>

      <div className="nav-actions">
        <nav className="nav-links">
          <a href="#login" className="btn btn-login">Zaloguj się</a>
          <a href="#register" className="btn btn-register" onClick={onRegisterClick}>Zarejestruj się</a>
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
