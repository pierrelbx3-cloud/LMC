import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function Header() {
  const collapseRef = useRef(null);
  const { user } = useAuth(); 
  const navigate = useNavigate(); // Pour rediriger après le logout

  const handleLinkClick = () => {
    const el = collapseRef.current;
    if (el && el.classList.contains('show')) {
      // Vérification sécurisée de l'instance Bootstrap
      const bsCollapse = window.bootstrap?.Collapse?.getInstance(el);
      if (bsCollapse) bsCollapse.hide();
    }
  };

  const handleLogout = async () => {
    try {
      // CORRECTION : Utilisation de supabase.auth.signOut()
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      // Fermer le menu mobile
      handleLinkClick();
      
      // Rediriger l'utilisateur vers l'accueil ou la page login
      navigate('/'); 
      
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error.message);
      alert("Erreur lors de la déconnexion");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar-style shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to="/" onClick={handleLinkClick}>
          Let Me Check
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav" ref={collapseRef}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/search" onClick={handleLinkClick}>
                🔍 Find a MRO
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services" onClick={handleLinkClick}>
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={handleLinkClick}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="d-flex gap-2 align-items-center">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm px-3"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="btn btn-accent-pro btn-sm text-white px-3"
                  onClick={handleLinkClick}
                >
                  Espace Pro
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/AdminDashboard"
                  className="btn btn-info btn-sm px-3 text-white"
                  onClick={handleLinkClick}
                >
                  ⚙️ Admin
                </Link>

                <Link
                  to="/pro/dashboard"
                  className="btn btn-accent-pro btn-sm text-white px-3"
                  onClick={handleLinkClick}
                >
                  Mon Dashboard
                </Link>

                <button
                  className="btn btn-outline-danger btn-sm px-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}