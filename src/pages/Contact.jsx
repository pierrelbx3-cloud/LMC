import React from 'react';
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

export default function Contact() {
  const { t } = useTranslation(); // <--- HOOK

  return (
    <div className="py-5 container">
      {/* Titre Principal */}
      <h1 className="text-center mb-5 fw-bold" style={{ color: 'var(--color-primary)', fontSize: '2.5rem' }}>
        {t('contact.title')}
      </h1>

      <div className="row justify-content-center">
        {/* --- Colonne Formulaire --- */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow border-0 p-4 transition-hover" style={{ backgroundColor: 'white' }}>
            <h3 className="mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('contact.form.title')}
            </h3>
            <form>
              <div className="mb-3">
                <label className="form-label fw-semibold">{t('contact.form.name')}</label>
                <input 
                  type="text" 
                  className="form-control border-0 bg-light" 
                  placeholder={t('contact.form.namePlaceholder')} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">{t('contact.form.email')}</label>
                <input 
                  type="email" 
                  className="form-control border-0 bg-light" 
                  placeholder={t('contact.form.emailPlaceholder')} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">{t('contact.form.subject')}</label>
                <select className="form-select border-0 bg-light">
                  <option>{t('contact.form.subjects.general')}</option>
                  <option>{t('contact.form.subjects.tech')}</option>
                  <option>{t('contact.form.subjects.partnership')}</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">{t('contact.form.message')}</label>
                <textarea 
                  className="form-control border-0 bg-light" 
                  rows="4" 
                  placeholder={t('contact.form.messagePlaceholder')}
                ></textarea>
              </div>
              <button type="button" className="btn btn-accent-pro w-100 py-2 fw-bold shadow-sm">
                {t('contact.form.btnSubmit')}
              </button>
            </form>
          </div>
        </div>

        {/* --- Colonne Informations --- */}
        <div className="col-lg-4 offset-lg-1">
          <div className="mb-4">
            <h4 style={{ color: 'var(--color-primary)' }}>📍 {t('contact.info.address')}</h4>
            <p className="text-muted">
            33 avenue de Wagram<br />
            75017 Paris, France
            </p>
          </div>

          <div className="mb-4">
            <h4 style={{ color: 'var(--color-primary)' }}>📧 {t('contact.info.email')}</h4>
            <p className="fw-bold" style={{ color: 'var(--color-accent)' }}>
              contact@let-me-check.com
            </p>
          </div>

          <div className="mb-4">
            <h4 style={{ color: 'var(--color-primary)' }}>📞 {t('contact.info.phone')}</h4>
            <p className="text-muted">+33 1 23 45 67 89</p>
            <small className="text-muted">{t('contact.info.hours')}</small>
          </div>

          {/* Encart Support Urgent */}
          <div className="p-4 rounded mt-4 shadow-sm" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <h5 className="fw-bold" style={{ color: 'var(--color-light-bg)' }}>
              {t('contact.urgent.title')}
            </h5>
            <p className="mb-0 small opacity-75">
              {t('contact.urgent.text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}