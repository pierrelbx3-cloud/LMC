// Header.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const collapseRef = useRef(null);

  const handleLinkClick = () => {
    // Ferme le menu s'il est ouvert
    const collapseEl = collapseRef.current;
    if (collapseEl && collapseEl.classList.contains('show')) {
      // Utilise l'API Bootstrap Collapse pour le fermer
      const bsCollapse = window.bootstrap.Collapse.getInstance(collapseEl);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar-style shadow-sm sticky-top">
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-white"
          to="/"
          style={{ fontFamily: "'Playfair Display', serif" }}
          onClick={handleLinkClick}
        >
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
              <Link className="nav-link" to="/search" onClick={handleLinkClick}>🔍 Find a MRO</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services" onClick={handleLinkClick}>Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={handleLinkClick}>Contact</Link>
            </li>
          </ul>

          <div className="d-flex">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="btn btn-accent-pro btn-sm ms-2 text-white"
                  to="/login"
                  onClick={handleLinkClick}
                >
                  Espace Pro
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
