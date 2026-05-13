import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useToast } from "../../ui/toast/hooks/useToast";
import '../styles/Auth.css';

export default function Login({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      showToast("Zalogowano pomyślnie", "success");
      onLoginSuccess(data.user);
    } catch (err) {
      showToast(err.message, "error");
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
    </div>
  );
}