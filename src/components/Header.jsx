import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/'); // Retour accueil après déconnexion
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">AeroMaintenance</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Liens Publics */}
            <li className="nav-item"><Link className="nav-link" to="/">Accueil</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/search">🔍 Trouver un Hangar</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/services">Services</Link></li>
          </ul>

          <div className="d-flex">
            {user ? (
              // Menu si Connecté (Pro)
              <ul className="navbar-nav">
                <li className="nav-item"><Link className="nav-link fw-bold" to="/pro/agenda">Mon Agenda</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/pro/hangar">Mon Hangar</Link></li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm ms-2">Déconnexion</button>
                </li>
              </ul>
            ) : (
              // Menu si Invité
              <ul className="navbar-nav">
                <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                <li className="nav-item"><Link className="btn btn-primary btn-sm ms-2 text-white" to="/login">Espace Pro</Link></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}