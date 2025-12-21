import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    else navigate('/pro/agenda');
  };

  return (
    <form onSubmit={handleLogin} className="mx-auto" style={{ maxWidth: 400 }}>
      <h3 className="mb-3">Connexion Pro</h3>

      <input
        type="email"
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-primary w-100">
        Se connecter
      </button>

      <p className="mt-3 text-center">
        Pas encore de compte ?
      </p>

      <Link
        to="/register"
        className="btn btn-outline-secondary w-100"
      >
        Créer un compte
      </Link>
    </form>
  );
}
