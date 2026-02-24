import { useState } from "react";
import { loginUser } from "../api/authApi";
import '../styles/Auth.css';

export default function Login({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setMessage("Zalogowano pomyślnie");
      onLoginSuccess(data.user);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Logowanie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="auth-buttons">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj"}
          </button>
          <button type="button" className="btn-danger" onClick={onClose}>
            Anuluj
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}