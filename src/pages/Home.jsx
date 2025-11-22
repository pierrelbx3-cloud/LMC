import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Pour utiliser les couleurs spécifiques, nous devons remplacer les classes de couleur 
  // Bootstrap par des classes personnalisées qui utilisent les variables CSS.
  // Cependant, pour simplifier au maximum le JSX, nous allons utiliser les classes
  // Bootstrap et les surcharger dans le CSS si nécessaire.

  return (
    <div className="container py-5">
      
      {/* 🌌 SECTION HERO (Bannière principale) - Fond Bleu Nuit, Bouton Terre Cuite */}
      <div 
        className="p-5 mb-5 rounded-4 shadow-lg text-white text-center"
        // Style en ligne TEMPORAIRE pour tester le Bleu Nuit directement sur le Hero
        style={{ backgroundColor: 'var(--color-primary, #1A237E)' }} 
      >
        <div className="container-fluid py-5">
          <h1 className="display-4 fw-bolder">Maintenance Aéronautique, Réinventée.</h1>
          <p className="col-md-9 fs-5 mx-auto opacity-75 mt-3">
            La première plateforme de mise en relation entre propriétaires d'avions et **hangars certifiés**. 
            Réservez votre emplacement de maintenance en quelques clics.
          </p>
          <div className="mt-5 d-grid gap-3 d-sm-flex justify-content-sm-center">
            
            {/* Bouton Primaire (Terre Cuite pour l'accent) */}
            <Link 
              to="/search" 
              className="btn btn-lg px-4 me-sm-3 fw-bold shadow"
              // Style en ligne TEMPORAIRE pour le Terre Cuite
              style={{ backgroundColor: 'var(--color-accent, #FF7043)', borderColor: 'var(--color-accent, #FF7043)', color: 'white' }}
            >
              ✈️ Trouver un Hangar
            </Link>
            
            {/* Bouton Secondaire (Blanc sur Bleu Nuit) */}
            <Link to="/services" className="btn btn-outline-light btn-lg px-4">
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
      
      {/* 🌟 SECTION AVANTAGES - Cartes avec icônes Bleu Ciel et ombres */}
      <h2 className="text-center mb-5 fw-bold text-dark">Pourquoi Choisir LMC ?</h2>
      <div className="row g-4 mb-5">
        
        {/* AVANTAGE 1 */}
        <div className="col-md-4">
          <div className="card h-100 p-4 border-0 shadow-sm transition-hover">
            <div className="card-body">
              {/* Icône en Bleu Ciel */}
              <span className="fs-3 mb-3 d-block" style={{ color: 'var(--color-secondary, #4FC3F7)' }}>⚡️</span>
              <h3 className="card-title fw-bold">Disponibilités Instantanées</h3>
              <p className="card-text text-muted">Visualisez et réservez votre créneau en temps réel grâce à notre intégration API.</p>
            </div>
          </div>
        </div>
        
        {/* AVANTAGE 2 */}
        <div className="col-md-4">
          <div className="card h-100 p-4 border-0 shadow-sm transition-hover">
            <div className="card-body">
              {/* Icône en Bleu Ciel */}
              <span className="fs-3 mb-3 d-block" style={{ color: 'var(--color-secondary, #4FC3F7)' }}>🛡️</span>
              <h3 className="card-title fw-bold">Partenaires Certifiés</h3>
              <p className="card-text text-muted">Accédez uniquement aux ateliers vérifiés (PART-145, EASA, etc.).</p>
            </div>
          </div>
        </div>
        
        {/* AVANTAGE 3 */}
        <div className="col-md-4">
          <div className="card h-100 p-4 border-0 shadow-sm transition-hover">
            <div className="card-body">
              {/* Icône en Bleu Ciel */}
              <span className="fs-3 mb-3 d-block" style={{ color: 'var(--color-secondary, #4FC3F7)' }}>🗺️</span>
              <h3 className="card-title fw-bold">Géolocalisation Optimale</h3>
              <p className="card-text text-muted">Trouvez le hangar idéal sur votre trajet. Réduisez les coûts de convoyage.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 💼 SECTION APPEL A L'ACTION PRO - Bouton Terre Cuite */}
      <div className="row mt-5">
        <div 
          className="col-12 p-5 rounded-4 text-center shadow-md"
          // Utilisation du Gris Léger ou Blanc
          style={{ backgroundColor: 'var(--color-light-bg, #f4f7f9)' }} 
        >
          <h3 className="mb-3 fw-bold">Devenez Partenaire Certifié LMC</h3>
          <p className="lead text-muted col-md-8 mx-auto">
            Augmentez votre taux d'occupation, simplifiez votre gestion des réservations et gagnez de nouveaux clients qualifiés.
          </p>
          {/* Bouton CTA Pro (Terre Cuite) */}
          <Link 
            to="/login" 
            className="btn btn-lg mt-3 shadow"
            // Style en ligne TEMPORAIRE pour le Terre Cuite
            style={{ backgroundColor: 'var(--color-accent, #FF7043)', borderColor: 'var(--color-accent, #FF7043)', color: 'white' }}
          >
            🤝 Accéder à l'Espace Pro
          </Link>
        </div>
      </div>
    </div>
  );
}