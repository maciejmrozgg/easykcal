import { useState } from "react";
import { registerUser } from "./authApi";
import './Register.css';

export default function Register({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const _res = await registerUser(email, password);
      setMessage("Konto zostało utworzone");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="auth-container">
      <h2>Rejestracja</h2>
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
        <button type="submit" className="btn-register">Zarejestruj</button>
        <button type="button" className="btn-register" onClick={onClose}>Anuluj</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}