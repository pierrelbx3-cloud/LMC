// Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  /* NOTE : Les imports 'useNavigate' et 'useAuth' ne sont plus nécessaires 
     puisque la logique de déconnexion/connexion a été retirée.
  */
  
  return (
    // 🚨 MODIFICATION ICI : AJOUT de la classe "sticky-top" 🚨
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar-style shadow-sm sticky-top">
      <div className="container">
        {/* Marque LMC */}
        <Link className="navbar-brand fw-bold text-white" to="/">Let Me Check</Link>
        
        {/* Bouton Hamburger */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenu du Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Liens Publics (à gauche) */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/search">🔍 Find a MRO</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/services">Services</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
          </ul>

          {/* Lien Espace Pro (à droite) */}
          <div className="d-flex">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="btn btn-accent-pro btn-sm ms-2 text-white" to="/login">Espace Pro</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}