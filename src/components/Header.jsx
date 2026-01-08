import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

export default function Header() {
  const collapseRef = useRef(null);
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // <--- HOOK

  // Fonction pour changer la langue
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLinkClick(); // Ferme le menu sur mobile après le clic
  };

  const handleLinkClick = () => {
    const el = collapseRef.current;
    if (el && el.classList.contains('show')) {
      const bsCollapse = window.bootstrap?.Collapse?.getInstance(el);
      if (bsCollapse) bsCollapse.hide();
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      handleLinkClick();
      navigate('/'); 
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error.message);
      alert(t('header.logoutError')); // <--- Traduction de l'alerte
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
                {t('header.findMRO')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services" onClick={handleLinkClick}>
                {t('header.services')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={handleLinkClick}>
                {t('header.contact')}
              </Link>
            </li>
          </ul>

          <div className="d-flex gap-2 align-items-center flex-wrap">
            
            {/* --- SÉLECTEUR DE LANGUE --- */}
            <div className="dropdown me-2">
              <button 
                className="btn btn-outline-light btn-sm dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                {i18n.language === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: 'auto' }}>
                <li>
                  <button className="dropdown-item" onClick={() => changeLanguage('fr')}>
                    🇫🇷 FR
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => changeLanguage('en')}>
                    🇬🇧 EN
                  </button>
                </li>
              </ul>
            </div>
            {/* --------------------------- */}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm px-3"
                  onClick={handleLinkClick}
                >
                  {t('header.login')}
                </Link>
                <Link
                  to="/login"
                  className="btn btn-accent-pro btn-sm text-white px-3"
                  onClick={handleLinkClick}
                >
                  {t('header.proSpace')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/AdminDashboard"
                  className="btn btn-info btn-sm px-3 text-white"
                  onClick={handleLinkClick}
                >
                  {t('header.admin')}
                </Link>

                <Link
                  to="/pro/dashboard"
                  className="btn btn-accent-pro btn-sm text-white px-3"
                  onClick={handleLinkClick}
                >
                  {t('header.myDashboard')}
                </Link>

                <button
                  className="btn btn-outline-danger btn-sm px-3"
                  onClick={handleLogout}
                >
                  {t('header.logout')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}