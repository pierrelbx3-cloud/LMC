// src/pages/pro/ProDashboard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function ProDashboard() {
  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">Espace de Gestion Professionnel</h2>
      <p className="lead text-muted">Veuillez choisir votre action :</p>

      <div className="row mt-5 g-4">
        
        {/* CARTE 1 : Gérer l'Agenda des Hangars */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm transition-hover">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold" style={{ color: 'var(--color-primary, #1A237E)' }}>🗓️ Gérer l'Agenda</h3>
              <p className="card-text text-muted mt-3">
                Consultez, ajoutez ou bloquez les créneaux de maintenance dans votre hangar.
              </p>
              <Link 
                to="/pro/agenda" 
                className="btn btn-outline-primary mt-3" 
                style={{ borderColor: 'var(--color-secondary, #4FC3F7)', color: 'var(--color-primary, #1A237E)' }}
              >
                Accéder à l'Agenda
              </Link>
            </div>
          </div>
        </div>

        {/* CARTE 2 : Mettre à Jour les Données */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm transition-hover">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold" style={{ color: 'var(--color-primary, #1A237E)' }}>⚙️ Mettre à Jour mon Hangar</h3>
              <p className="card-text text-muted mt-3">
                Modifiez vos certifications, vos tarifs, vos photos et vos coordonnées.
              </p>
              <Link 
                to="/pro/hangar" 
                className="btn mt-3" 
                style={{ backgroundColor: 'var(--color-accent, #FF7043)', borderColor: 'var(--color-accent, #FF7043)', color: 'white' }}
              >
                Gérer les Données
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}