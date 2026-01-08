import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

export default function Services() {
  const { t } = useTranslation(); // <--- HOOK

  // Le tableau est défini DANS le composant pour accéder à la fonction t()
  const services = [
    {
      title: t('services.items.scheduled.title'),
      desc: t('services.items.scheduled.desc'),
      icon: "🛠️"
    },
    {
      title: t('services.items.structural.title'),
      desc: t('services.items.structural.desc'),
      icon: "✈️"
    },
    {
      title: t('services.items.avionics.title'),
      desc: t('services.items.avionics.desc'),
      icon: "📟"
    },
    {
      title: t('services.items.storage.title'),
      desc: t('services.items.storage.desc'),
      icon: "🏠"
    }
  ];

  return (
    <div className="py-5 container">
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: 'var(--color-primary)', fontSize: '2.8rem' }}>
          {t('services.title')}
        </h1>
        <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-accent)', margin: '1rem auto' }}></div>
        <p className="lead text-muted">
          {t('services.subtitle')}
        </p>
      </div>

      <div className="row">
        {services.map((service, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm transition-hover advantage-card" style={{ borderRadius: '12px' }}>
              <div className="card-body p-4">
                <div className="mb-3 fs-2">{service.icon}</div>
                <h3 className="card-title h4 fw-bold" style={{ color: 'var(--color-primary)' }}>
                  {service.title}
                </h3>
                <p className="card-text text-muted" style={{ lineHeight: '1.6' }}>
                  {service.desc}
                </p>
              </div>
              <div className="card-footer bg-transparent border-0 pb-4 px-4">
                <Link to="/search" className="btn btn-accent-pro btn-sm px-4 rounded-pill">
                  {t('services.btnAvailability')}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerte Information Réglementaire */}
      <div className="mt-5 p-4 rounded-3 border-start border-4 border-info shadow-sm" 
           style={{ backgroundColor: 'white', borderLeftColor: 'var(--color-secondary) !important' }}>
        <div className="d-flex align-items-center">
          <div className="me-3 fs-4">ℹ️</div>
          <div>
            <strong style={{ color: 'var(--color-primary)' }}>
              {t('services.regulation.title')}
            </strong>
            <p className="mb-0 text-muted small">
              {t('services.regulation.text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}