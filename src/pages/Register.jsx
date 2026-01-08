import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

export default function Register() {
  const { t } = useTranslation(); // <--- HOOK
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

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setError(t('register.errors.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('register.errors.passwordTooShort'));
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      // Note: Supabase renvoie souvent les erreurs en anglais par défaut.
      // Pour une trad parfaite, il faudrait mapper les codes d'erreur Supabase.
      setError(signUpError.message);
      return;
    }

    const userId = data.user.id;

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          role: requestPro ? 'pro' : 'user',
          role_status: requestPro ? 'pending' : 'approved',
        },
      ]);

    if (profileError) {
      setError(t('register.errors.profileError'));
      return;
    }

    // Message de succès selon le rôle
    setMessage(
      requestPro
        ? t('register.success.pro')
        : t('register.success.user')
    );
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '90vh' }}>
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: 500, width: '100%', borderRadius: '15px' }}>
        
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: 'var(--color-primary)' }}>
            {t('register.title')}
          </h2>
          <p className="text-muted">
            {t('register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label small fw-bold" style={{ color: 'var(--color-primary)' }}>
              {t('register.emailLabel')}
            </label>
            <input
              type="email"
              className="form-control border-0 bg-light shadow-sm"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-primary)' }}>
                {t('register.passwordLabel')}
              </label>
              <input
                type="password"
                className="form-control border-0 bg-light shadow-sm"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-primary)' }}>
                {t('register.confirmLabel')}
              </label>
              <input
                type="password"
                className="form-control border-0 bg-light shadow-sm"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* SECTION PRO MISE EN VALEUR */}
          <div className={`p-3 rounded-3 mb-4 border-start border-4 ${requestPro ? 'border-info bg-light' : 'border-secondary bg-light opacity-75'}`} 
               style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check form-switch">
              <input
                className="form-check-input shadow-none"
                type="checkbox"
                role="switch"
                id="requestPro"
                checked={requestPro}
                onChange={(e) => setRequestPro(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label className="form-check-label fw-bold ms-2" htmlFor="requestPro" style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>
                {t('register.isProLabel')}
              </label>
            </div>
            <small className="d-block text-muted mt-1">
              {requestPro 
                ? t('register.proDescActive')
                : t('register.proDescInactive')}
            </small>
          </div>

          {error && <div className="alert alert-danger py-2 small border-0 mb-3">{error}</div>}
          {message && <div className="alert alert-success py-2 small border-0 mb-3">{message}</div>}

          <button className="btn btn-accent-pro w-100 py-2 fw-bold shadow-sm mb-3">
            {t('register.btnSubmit')}
          </button>

          <div className="text-center">
            <span className="text-muted small">{t('register.alreadyAccount')} </span>
            <Link to="/login" className="text-decoration-none fw-bold" style={{ color: 'var(--color-secondary)' }}>
              {t('register.loginLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}