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
    else navigate('/pro/ProDashboard');
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: 450, width: '100%', borderRadius: '15px' }}>
        
        <div className="text-center mb-4">
          {/* Logo ou Icone */}
          <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" 
               style={{ width: '60px', height: '60px', backgroundColor: 'var(--color-light-bg)', borderRadius: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>✈️</span>
          </div>
          <h2 className="fw-bold" style={{ color: 'var(--color-primary)' }}>Espace Professionnel</h2>
          <p className="text-muted small">Connectez-vous pour gérer vos hangars et services</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold" style={{ color: 'var(--color-primary)' }}>Email Professionnel</label>
            <input
              type="email"
              className="form-control form-control-lg border-0 shadow-sm"
              style={{ backgroundColor: '#f8f9fa', fontSize: '1rem' }}
              placeholder="nom@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-primary)' }}>Mot de passe</label>
              <Link to="/forgot-password" size="sm" className="text-decoration-none small" style={{ color: 'var(--color-secondary)' }}>
                Oublié ?
              </Link>
            </div>
            <input
              type="password"
              className="form-control form-control-lg border-0 shadow-sm"
              style={{ backgroundColor: '#f8f9fa', fontSize: '1rem' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 small border-0" style={{ borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <button className="btn btn-accent-pro w-100 py-2 fw-bold mb-3 shadow-sm" style={{ fontSize: '1.1rem' }}>
            Se connecter
          </button>

          <div className="text-center">
            <span className="text-muted small">Pas encore de compte ?</span>
            <Link
              to="/register"
              className="d-block mt-2 text-decoration-none fw-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              Créer un compte partenaire
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}