import React from 'react';
// Remplacement de 'Link' par une balise standard 'a' pour éviter les erreurs de contexte de routeur (BrowserRouter/HashRouter)
// import { Link } from 'react-router-dom';

export default function ProDashboard() {
  // Styles réutilisés pour la cohérence
  const primaryColor = 'var(--color-primary, #1A237E)';
  const secondaryColor = 'var(--color-secondary, #4FC3F7)';
  const accentColor = 'var(--color-accent, #FF7043)';

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">Espace de Gestion Professionnel</h2>
      <p className="lead text-muted">Veuillez choisir votre action :</p>

      <div className="row mt-5 g-4">
        
        {/* CARTE 1 : Gérer l'Agenda des Hangars */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm transition-hover">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold" style={{ color: primaryColor }}>🗓️ Gérer l'Agenda</h3>
              <p className="card-text text-muted mt-3">
                Consultez, ajoutez ou bloquez les créneaux de maintenance dans votre hangar.
              </p>
              <a 
                href="/pro/agenda" 
                className="btn btn-outline-primary mt-3" 
                style={{backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' }}
              >
                Accéder à l'Agenda
              </a>
            </div>
          </div>
        </div>

        {/* CARTE 2 : Mettre à Jour les Données Techniques du Hangar */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm transition-hover">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold" style={{ color: primaryColor }}>⚙️ Mettre à Jour mon Hangar</h3>
              <p className="card-text text-muted mt-3">
                Modifiez vos certifications, vos tarifs, vos photos et vos coordonnées.
              </p>
              <a 
                href="/pro/hangar" 
                className="btn mt-3" 
                style={{ backgroundColor: accentColor, borderColor: accentColor, color: 'white' }}
              >
                Gérer les Données
              </a>
            </div>
          </div>
        </div>

        {/* NOUVELLE CARTE 3 : Modification des Données Administratives */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm transition-hover">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold" style={{ color: primaryColor }}>🏛️ Modification des Données Administratives</h3>
              <p className="card-text text-muted mt-3">
                Gérez les informations légales, le SIRET, et les détails de facturation de votre entreprise.
              </p>
              <a 
                href="/pro/admin" 
                className="btn mt-3" 
                style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' }}
              >
                Modifier les Informations
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}