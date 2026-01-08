import React from 'react';
import { Link } from 'react-router-dom'; // <--- ON RÉTABLIT LINK
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

export default function ProDashboard() {
  const { t } = useTranslation(); // <--- HOOK

  // Vos variables de style (conservées)
  const primaryColor = 'var(--color-primary, #1A237E)';
  const secondaryColor = 'var(--color-secondary, #4FC3F7)';
  const accentColor = 'var(--color-accent, #FF7043)';

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">
        {t('proDashboard.title')}
      </h2>
      <p className="lead text-muted">
        {t('proDashboard.subtitle')}
      </p>

      <div className="row mt-5 g-4">
        
        {/* CARTE 1 : Agenda */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm transition-hover">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold" style={{ color: primaryColor }}>
                🗓️ {t('proDashboard.cards.agenda.title')}
              </h3>
              <p className="card-text text-muted mt-3">
                {t('proDashboard.cards.agenda.desc')}
              </p>
              <Link 
                to="/pro/agenda" 
                className="btn btn-outline-primary mt-3" 
                style={{backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' }}
              >
                {t('proDashboard.cards.agenda.btn')}
              </Link>
            </div>
          </div>
        </div>

        {/* CARTE 2 : Technique Hangar */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm transition-hover">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold" style={{ color: primaryColor }}>
                ⚙️ {t('proDashboard.cards.tech.title')}
              </h3>
              <p className="card-text text-muted mt-3">
                {t('proDashboard.cards.tech.desc')}
              </p>
              <Link 
                to="/pro/hangar" 
                className="btn mt-3" 
                style={{ backgroundColor: accentColor, borderColor: accentColor, color: 'white' }}
              >
                {t('proDashboard.cards.tech.btn')}
              </Link>
            </div>
          </div>
        </div>

        {/* CARTE 3 : Administratif */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm transition-hover">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold" style={{ color: primaryColor }}>
                🏛️ {t('proDashboard.cards.admin.title')}
              </h3>
              <p className="card-text text-muted mt-3">
                {t('proDashboard.cards.admin.desc')}
              </p>
              <Link 
                to="/pro/admin" 
                className="btn mt-3" 
                style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' }}
              >
                {t('proDashboard.cards.admin.btn')}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}