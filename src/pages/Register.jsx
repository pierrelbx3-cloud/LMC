import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestPro, setRequestPro] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation mot de passe
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          requested_role: requestPro ? 'professional' : 'user',
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        requestPro
          ? 'Compte créé. Votre demande de rôle professionnel sera examinée.'
          : 'Compte créé. Vérifiez votre email pour confirmer.'
      );
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="mx-auto"
      style={{ maxWidth: 450 }}
    >
      <h3 className="mb-3">Créer un compte</h3>

      <input
        type="email"
        className="form-control mb-2"
        placeholder="Adresse email"
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

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      {/* DEMANDE ROLE PRO */}
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="requestPro"
          checked={requestPro}
          onChange={(e) => setRequestPro(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="requestPro">
          Demander un rôle professionnel
        </label>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <button className="btn btn-success w-100">
        Créer le compte
      </button>
    </form>
  );
}
