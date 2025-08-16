import { FaMoon, FaSun } from 'react-icons/fa';

export default function ThemeSwitcher({ darkMode, setDarkMode }) {
  return (
    <button className='themeSwitcher' onClick={() => setDarkMode(!darkMode)}>
      
      {darkMode ? <FaSun size={24} /> : <FaMoon size={24}/>}
    </button>
  );
}