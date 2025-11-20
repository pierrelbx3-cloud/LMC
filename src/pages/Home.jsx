import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* --- SECTION HERO (Bannière principale) --- */}
      <div className="p-5 mb-4 bg-light rounded-3 border shadow-sm text-center">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold text-primary">Maintenance Aéronautique Simplifiée</h1>
          <p className="col-md-8 fs-4 mx-auto">
            La première plateforme de mise en relation entre propriétaires d'avions et hangars certifiés. 
            Réservez votre emplacement de maintenance en quelques clics.
          </p>
          <div className="mt-4">
            <Link to="/search" className="btn btn-primary btn-lg me-3">Trouver un Hangar</Link>
            <Link to="/contact" className="btn btn-outline-secondary btn-lg">Nous Contacter</Link>
          </div>
        </div>
      </div>

      {/* --- SECTION AVANTAGES --- */}
      <div className="row align-items-md-stretch">
        <div className="col-md-4 mb-4">
          <div className="h-100 p-4 text-white bg-primary rounded-3">
            <h2>🚀 Rapide</h2>
            <p>Ne perdez plus de temps à appeler chaque atelier. Visualisez les disponibilités en temps réel et réservez votre créneau instantanément.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="h-100 p-4 bg-light border rounded-3">
            <h2>✅ Certifié</h2>
            <p>Tous les professionnels présents sur notre plateforme sont vérifiés. Accédez aux certifications (PART-145, etc.) directement sur leur profil.</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="h-100 p-4 text-white bg-dark rounded-3">
            <h2>📍 Localisé</h2>
            <p>Trouvez un hangar proche de votre base ou sur votre trajet. Notre système de géolocalisation optimise vos coûts de convoyage.</p>
          </div>
        </div>
      </div>

      {/* --- SECTION APPEL A L'ACTION --- */}
      <div className="row mt-5 text-center">
        <div className="col-12">
          <h3 className="mb-3">Vous êtes un professionnel de la maintenance ?</h3>
          <p className="lead">Optimisez le taux d'occupation de vos hangars et gagnez de nouveaux clients.</p>
          <Link to="/login" className="btn btn-success">Accéder à l'Espace Pro</Link>
        </div>
      </div>
    </div>
  );
}