import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      title: "Visites Programmées",
      desc: "Planifiez vos visites 50h, 100h ou annuelles. Trouvez des ateliers agréés pour votre type d'appareil spécifique.",
      icon: "🛠️"
    },
    {
      title: "Réparations Structurelles",
      desc: "Accédez à des spécialistes de la tôlerie et des composites pour des réparations complexes ou des modifications.",
      icon: "✈️"
    },
    {
      title: "Avionique & Moteur",
      desc: "Installation de nouveaux équipements, rétrofit ou révision moteur (Overhaul).",
      icon: "📟"
    },
    {
      title: "Stockage Longue Durée",
      desc: "Besoin d'un abri sécurisé pour l'hiver ? Trouvez des places de hangar disponibles pour le stationnement.",
      icon: "🏠"
    }
  ];

  return (
    <div className="py-5 container">
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: 'var(--color-primary)', fontSize: '2.8rem' }}>Nos Services</h1>
        <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-accent)', margin: '1rem auto' }}></div>
        <p className="lead text-muted">Une expertise technique et logistique pour votre flotte aéronautique.</p>
      </div>

      <div className="row">
        {services.map((service, index) => (
          <div key={index} className="col-md-6 mb-4">
            {/* Utilisation de vos classes CSS : transition-hover et advantage-card */}
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
                  Voir les disponibilités
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerte stylisée avec le Bleu Nuit */}
      <div className="mt-5 p-4 rounded-3 border-start border-4 border-info shadow-sm" 
           style={{ backgroundColor: 'white', borderLeftColor: 'var(--color-secondary) !important' }}>
        <div className="d-flex align-items-center">
          <div className="me-3 fs-4">ℹ️</div>
          <div>
            <strong style={{ color: 'var(--color-primary)' }}>Information réglementaire :</strong>
            <p className="mb-0 text-muted small">
              Les interventions techniques sont soumises aux agréments PART-145 ou PART-ML des ateliers. 
              Vérifiez les certificats de navigabilité directement sur les profils des prestataires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}