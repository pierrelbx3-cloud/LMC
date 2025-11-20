import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      title: "Visites Programmées",
      desc: "Planifiez vos visites 50h, 100h ou annuelles. Trouvez des ateliers agréés pour votre type d'appareil spécifique.",
      color: "border-primary"
    },
    {
      title: "Réparations Structurelles",
      desc: "Accédez à des spécialistes de la tôlerie et des composites pour des réparations complexes ou des modifications.",
      color: "border-success"
    },
    {
      title: "Avionique & Moteur",
      desc: "Installation de nouveaux équipements, rétrofit ou révision moteur (Overhaul).",
      color: "border-info"
    },
    {
      title: "Stockage Longue Durée",
      desc: "Besoin d'un abri sécurisé pour l'hiver ? Trouvez des places de hangar disponibles pour le stationnement.",
      color: "border-warning"
    }
  ];

  return (
    <div className="py-4">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Nos Services</h1>
        <p className="text-muted">Une couverture complète pour tous vos besoins aéronautiques.</p>
      </div>

      <div className="row">
        {services.map((service, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className={`card h-100 shadow-sm ${service.color} border-2`}>
              <div className="card-body">
                <h3 className="card-title h4">{service.title}</h3>
                <p className="card-text text-secondary">{service.desc}</p>
              </div>
              <div className="card-footer bg-transparent border-0">
                <Link to="/search" className="btn btn-sm btn-outline-primary">Voir les disponibilités</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info mt-4" role="alert">
        <strong>Note :</strong> Les services spécifiques dépendent des agréments de chaque hangar partenaire. Utilisez les filtres de recherche pour trouver le bon prestataire.
      </div>
    </div>
  );
}