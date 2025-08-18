import '../styles/Footer.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // ikony z react-icons

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="social-icons">
          <a href="https://github.com/maciejmrozgg/" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/maciej-mr%C3%B3z-programmer/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Maciej Mróz. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
}