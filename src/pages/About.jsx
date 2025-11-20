import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="py-4">
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <h1 className="fw-bold mb-3">Notre Mission</h1>
          <p className="lead text-muted">
            Fluidifier le marché de la maintenance aéronautique en connectant intelligemment les pilotes et les ateliers.
          </p>
          <p>
            Née du constat que trouver un créneau de maintenance est souvent un parcours du combattant, 
            <strong>AeroMaintenance</strong> a été créée par des passionnés d'aviation pour des passionnés d'aviation.
            Notre objectif est de réduire le temps d'immobilisation des appareils et de simplifier la gestion administrative.
          </p>
        </div>
        <div className="col-lg-6">
          {/* Placeholder visuel (Bloc gris) pour remplacer une image */}
          <div className="bg-secondary opacity-25 rounded w-100 d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
            <span className="h3 text-dark opacity-50">Photo Équipe / Hangar</span>
          </div>
        </div>
      </div>

      <div className="row text-center mt-5">
        <div className="col-md-4">
          <div className="p-3">
            <h2 className="fw-bold text-primary">500+</h2>
            <p>Hangars référencés</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3">
            <h2 className="fw-bold text-primary">1200+</h2>
            <p>Rendez-vous pris</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3">
            <h2 className="fw-bold text-primary">98%</h2>
            <p>Clients satisfaits</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-5">
        <Link to="/contact" className="btn btn-outline-dark">Rejoindre l'aventure</Link>
      </div>
    </div>
  );
}