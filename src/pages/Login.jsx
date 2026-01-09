import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

export default function Login() {
  const { t } = useTranslation(); // <--- HOOK
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Message d'erreur traduit
      setError(t('login.errorCredential'));
      setLoading(false);
    } else if (data.user) {
      navigate('/pro/dashboard');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '90vh' }}>
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: 450, width: '100%', borderRadius: '15px' }}>
        
        {/* EN-TÊTE HARMONISÉ */}
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: 'var(--color-primary)' }}>
            {t('login.title')}
          </h2>
          <p className="text-muted">
            {t('login.subtitle')}
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* EMAIL STYLE LIGHT */}
          <div className="mb-3">
            <label className="form-label small fw-bold" style={{ color: 'var(--color-primary)' }}>
              {t('login.emailLabel')}
            </label>
            <input
              type="email"
              className="form-control border-0 bg-light shadow-sm"
              placeholder={t('login.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '0.75rem' }}
            />
          </div>

          {/* MOT DE PASSE STYLE LIGHT */}
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-primary)' }}>
                {t('login.passwordLabel')}
              </label>
              <Link to="/forgot-password" alt="Oublié" className="text-decoration-none small opacity-75" style={{ color: 'var(--color-primary)' }}>
                {t('login.forgotPassword')}
              </Link>
            </div>
            <input
              type="password"
              className="form-control border-0 bg-light shadow-sm"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '0.75rem' }}
            />
          </div>

          {/* GESTION DES ERREURS STYLISÉE */}
          {error && (
            <div className="alert alert-danger py-2 small border-0 mb-3 shadow-sm" style={{ borderRadius: '10px' }}>
              {error}
            </div>
          )}

          {/* BOUTON CONNEXION ACCENT-PRO */}
          <button 
            type="submit" 
            className="btn btn-accent-pro w-100 py-2 fw-bold shadow-sm mb-4"
            disabled={loading}
          >
            {loading ? t('login.btnLoading') : t('login.btnLogin')}
          </button>

          {/* SÉPARATEUR POUR LE BOUTON D'INSCRIPTION */}
          <div className="d-flex align-items-center mb-4">
            <hr className="flex-grow-1 opacity-25" />
            <span className="mx-3 text-muted small">{t('login.newHere')}</span>
            <hr className="flex-grow-1 opacity-25" />
          </div>

          {/* BOUTON CRÉER COMPTE (Style bouton secondaire) */}
          <div className="text-center">
            <Link 
              to="/register" 
              className="btn btn-outline-light btn-sm w-100 py-2 border shadow-sm text-dark fw-bold" 
              style={{ borderRadius: '10px', transition: 'all 0.3s ease' }}
            >
              {t('login.btnRegister')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}