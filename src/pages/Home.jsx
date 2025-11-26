import React from 'react';
import { Link } from 'react-router-dom';

const BACKGROUND_IMAGE_URL = '/background.png'; 
// Assurez-vous d'avoir ces images pour le carrousel, ou remplacez-les par du texte.
const CAROUSEL_IMAGE_1 = '/home1.png';
const CAROUSEL_IMAGE_2 = '/home2.png';
const CAROUSEL_IMAGE_3 = '/home3.png';

export default function Home() {

  // Style de base pour les items du carrousel
  const carouselItemStyle = {
    height: '400px', // Hauteur fixe pour le carrousel
    backgroundSize: 'cover', 
    backgroundPosition: 'center center',
  };

  return (
    <> 
      {/* 🖼️ SECTION HERO : BANNIÈRE PLEINE LARGEUR */}
      <div 
        className="p-0 shadow-lg text-white text-center position-relative overflow-hidden" 
        style={{ 
          height: '50vh', 
          minHeight: '400px', 
          backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center center', 
          width: '100vw', 
          marginLeft: 'calc(50% - 50vw)', 
        }} 
      >
        {/* 🎨 CALQUE D'OVERLAY */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)', 
            zIndex: 1, 
          }}
        ></div>

        {/* 📝 CONTENU : BOUTONS ANCRÉS EN BAS */}
        <div 
          className="container-fluid py-5 h-100 d-flex flex-column justify-content-end align-items-center position-relative" 
          style={{ zIndex: 2 }}
        >
          <div className="mb-5 d-grid gap-3 d-sm-flex justify-content-sm-center">
            
            <Link 
              to="/search" 
              className="btn btn-lg px-4 me-sm-3 fw-bold shadow"
              style={{ backgroundColor: 'var(--color-accent, #FF7043)', borderColor: 'var(--color-accent, #FF7043)', color: 'white' }}
            >
              ✈️ Trouver un Hangar
            </Link>
            
            <Link to="/services" className="btn btn-outline-light btn-lg px-4">
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
      
      {/* --- CARTE AVEC CAPTIONS ET STYLE ÉLÉGANT --- */}
      <div className="container mt-5">
        <div className="card p-5 border-0 shadow-lg text-center" style={{ backgroundColor: 'var(--color-primary)' }}>
          <p 
            className="text-uppercase fw-bold mb-2" 
            style={{ color: 'var(--color-accent, #4FC3F7)', letterSpacing: '0.1em' }}
          >
            LA MAINTENANCE AÉRONAUTIQUE EN 2025
          </p>
          
          <h1 className="display-4 fw-bolder text-light mb-4">Maintenance Aéronautique, Réinventée.</h1>
          <p className="col-md-10 fs-5 mx-auto opacity-75 text-light">
            La première plateforme de mise en relation entre propriétaires d'avions et **hangars certifiés**. 
            Réservez votre emplacement de maintenance en quelques clics.
          </p>
        </div>
      </div>
      
      {/* 🎠 CARROUSEL D'IMAGES/PRODUITS (Nouveau) */}
      <div className="container my-5">
        <h2 className="text-center mb-4 fw-bold text-dark display-6">Découvrez nos Partenaires Premium</h2>
        
        <div id="carouselExampleIndicators" className="carousel slide shadow-lg rounded-3 overflow-hidden" data-bs-ride="carousel">
          
          {/* Indicateurs (les petits points en bas) */}
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          
          {/* Contenu des slides */}
          <div className="carousel-inner">
            
            {/* ITEM 1 (Actif) */}
            <div className="carousel-item active" style={{ ...carouselItemStyle, backgroundImage: `url(${CAROUSEL_IMAGE_1})` }}>
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4">
                <h5 className="fw-bolder">Hangar AéroTech - Paris Le Bourget</h5>
                <p>Spécialisé dans la maintenance lourde des jets d'affaires.</p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="carousel-item" style={{ ...carouselItemStyle, backgroundImage: `url(${CAROUSEL_IMAGE_2})` }}>
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4">
                <h5 className="fw-bolder">Atelier SkyFix - Lyon</h5>
                <p>Certification PART-145 pour l'entretien des turbopropulseurs régionaux.</p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="carousel-item" style={{ ...carouselItemStyle, backgroundImage: `url(${CAROUSEL_IMAGE_3})` }}>
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4">
                <h5 className="fw-bolder">Global MRO - Cannes</h5>
                <p>Services de rénovation intérieure et peinture. Prise de rendez-vous immédiate.</p>
              </div>
            </div>
          </div>
          
          {/* Contrôles (flèches gauche/droite) */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Précédent</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Suivant</span>
          </button>
        </div>
      </div>

      {/* --- SECTION AVANTAGES AMÉLIORÉE AVEC COULEUR --- */}
      <div className="container mt-5 py-5">
        <h2 className="text-center mb-5 fw-bold text-dark display-6">Pourquoi Choisir LMC ?</h2>
        <div className="row g-4 mb-5">
          
          {/* AVANTAGE 1 (inchangé) */}
          <div className="col-md-4">
            <div className="card h-100 p-4 border-0 shadow-lg text-center transition-hover advantage-card">
              <div className="card-body">
                <span className="fs-1 mb-3 d-block" style={{ color: 'var(--color-secondary)' }}>
                  <i className="fas fa-bolt"></i>
                </span>
                <h3 className="card-title fw-bolder mb-3">⚡️ Disponibilités Instantanées</h3>
                <p className="card-text text-muted fs-5">Visualisez et réservez votre créneau en temps réel grâce à notre intégration API.</p>
              </div>
            </div>
          </div>
          
          {/* AVANTAGE 2 (inchangé) */}
          <div className="col-md-4">
            <div className="card h-100 p-4 border-0 shadow-lg text-center transition-hover advantage-card">
              <div className="card-body">
                <span className="fs-1 mb-3 d-block" style={{ color: 'var(--color-secondary, #4FC3F7)' }}>
                  <i className="fas fa-shield-alt"></i>
                </span>
                <h3 className="card-title fw-bolder mb-3">🛡️ Partenaires Certifiés</h3>
                <p className="card-text text-muted fs-5">Accédez uniquement aux ateliers vérifiés (PART-145, EASA, etc.).</p>
              </div>
            </div>
          </div>
          
          {/* AVANTAGE 3 (inchangé) */}
          <div className="col-md-4">
            <div className="card h-100 p-4 border-0 shadow-lg text-center transition-hover advantage-card">
              <div className="card-body">
                <span className="fs-1 mb-3 d-block" style={{ color: 'var(--color-secondary, #4FC3F7)' }}>
                  <i className="fas fa-map-marker-alt"></i> 
                </span>
                <h3 className="card-title fw-bolder mb-3">🗺️ Géolocalisation Optimale</h3>
                <p className="card-text text-muted fs-5">Trouvez le hangar idéal sur votre trajet. Réduisez les coûts de convoyage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      {/* 💼 SECTION APPEL A L'ACTION PRO */}
      <div className="container my-5">
        <div className="row">
          <div 
            className="col-12 p-5 rounded-4 text-center shadow-lg"
            style={{ backgroundColor: 'var(--color-light-bg, #f4f7f9)' }} 
          >
            <h3 className="mb-3 fw-bold display-6">Devenez Partenaire Certifié LMC</h3>
            <p className="lead text-muted col-md-8 mx-auto fs-5">
              Augmentez votre taux d'occupation, simplifiez votre gestion des réservations et gagnez de nouveaux clients qualifiés.
            </p>
            <Link 
              to="/login" 
              className="btn btn-lg mt-3 shadow"
              style={{ backgroundColor: 'var(--color-accent, #FF7043)', borderColor: 'var(--color-accent, #FF7043)', color: 'white' }}
            >
              🤝 Accéder à l'Espace Pro
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}