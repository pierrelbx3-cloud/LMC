import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function Header() {
  const collapseRef = useRef(null);
  const { user } = useAuth(); // On récupère l'utilisateur du contexte

  const handleLinkClick = () => {
    const el = collapseRef.current;
    if (el && el.classList.contains('show')) {
      const bsCollapse = window.bootstrap.Collapse.getInstance(el);
      if (bsCollapse) bsCollapse.hide();
    }
  };

  const handleLogout = async () => {
    await supabase.signOut(); // Correction mineure : supabase.auth.signOut() est plus standard selon la version
    handleLinkClick();
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
            {/* --- CAS : UTILISATEUR NON CONNECTÉ --- */}
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
              /* --- CAS : UTILISATEUR CONNECTÉ --- */
              <>
                {/* NOUVEAU BOUTON : Admin Dashboard */}
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