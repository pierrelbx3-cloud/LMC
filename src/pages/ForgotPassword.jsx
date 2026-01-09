import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div 
      className="container d-flex justify-content-center align-items-center animate__animated animate__fadeIn" 
      style={{ minHeight: '70vh' }} // Centre verticalement sur la page
    >
      <div 
        className="card border-0 shadow-lg p-4 p-lg-5 text-center" 
        style={{ maxWidth: '500px', borderRadius: '20px', backgroundColor: '#fff' }}
      >
        {/* Icône Cadenas */}
        <div className="mb-4">
          <div 
            className="d-inline-flex justify-content-center align-items-center rounded-circle"
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: 'rgba(200, 117, 105, 0.1)' // Couleur accent très claire
            }}
          >
            <i className="bi bi-shield-lock-fill" style={{ fontSize: '2.5rem', color: 'var(--color-accent)' }}></i>
          </div>
        </div>

        {/* Titre */}
        <h2 className="fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
          Mot de passe oublié ?
        </h2>

        {/* Texte explicatif */}
        <p className="text-muted mb-4">
          Pour des raisons de sécurité, la réinitialisation automatique est temporairement désactivée.
          <br /><br />
          Pas de panique ! Cliquez sur le bouton ci-dessous pour contacter notre équipe technique. Nous vous aiderons à récupérer l'accès à votre compte rapidement.
        </p>

        {/* Bouton vers Contact */}
        <Link 
          to="/contact" 
          className="btn btn-accent-pro text-white btn-lg rounded-pill px-5 shadow-sm mb-4 w-100"
          style={{ fontWeight: '600' }}
        >
          <i className="bi bi-envelope-fill me-2"></i>
          Contacter le Support
        </Link>

        {/* Lien retour */}
        <div>
          <Link to="/login" className="text-decoration-none small text-muted fw-bold">
            <i className="bi bi-arrow-left me-1"></i> Retour à la connexion
          </Link>
        </div>

      </div>
    </div>
  );
}