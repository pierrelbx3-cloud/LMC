import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import FaqSection from '../components/FaqSection'; 
import { useTranslation } from 'react-i18next'; // <--- IMPORT

const BACKGROUND_IMAGE_URL = '/background.png'; 
const CAROUSEL_IMAGE_1 = '/home1.png';
const CAROUSEL_IMAGE_2 = '/home2.png';
const CAROUSEL_IMAGE_3 = '/home3.png';

export default function Home() {
  const { t } = useTranslation(); // <--- HOOK
  const currentYear = new Date().getFullYear(); // Année dynamique

  // Style de base pour les items du carrousel
  const carouselItemStyle = {
    height: '400px', 
    backgroundSize: 'cover', 
    backgroundPosition: 'center center',
  };

  // --- CONFIGURATION DES ANIMATIONS (VARIANTS) ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <> 
      {/* 🖼️ SECTION HERO : BANNIÈRE PLEINE LARGEUR */}
      <div 
        className="p-0 shadow-lg text-white text-center position-relative overflow-hidden" 
        style={{ 
          height: '50vh', 
          minHeight: '400px', 
          backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center center', 
          width: '100vw', 
          marginLeft: 'calc(50% - 50vw)', 
        }} 
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', zIndex: 1 }}
        ></div>

        <motion.div 
          className="container-fluid py-5 h-100 d-flex flex-column justify-content-end align-items-center position-relative" 
          style={{ zIndex: 2 }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="mb-5 d-grid gap-3 d-sm-flex justify-content-sm-center">
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/search" 
                className="btn btn-lg px-4 me-sm-3 fw-bold shadow"
                style={{ backgroundColor: 'var(--color-accent, #FF7043)', borderColor: 'var(--color-accent, #FF7043)', color: 'white' }}
              >
                {t('home.hero.ctaSearch')}
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/services" className="btn btn-outline-light btn-lg px-4">
                {t('home.hero.ctaLearnMore')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* --- CARTE HERO CAPTION --- */}
      <div className="container mt-5">
        <motion.div 
          className="card p-5 border-0 shadow-lg text-center" 
          style={{ backgroundColor: 'var(--color-primary)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <p 
            className="text-uppercase fw-bold mb-2" 
            style={{ color: 'var(--color-accent, #4FC3F7)', letterSpacing: '0.1em' }}
          >
             {t('home.hero.label', { year: currentYear })}
          </p>
          
          <h1 className="display-4 fw-bolder text-light mb-4">{t('home.hero.title')}</h1>
          <p className="col-md-10 fs-5 mx-auto opacity-75 text-light">
            {t('home.hero.subtitle')}
          </p>
        </motion.div>
      </div>
      
      {/* 🎠 CARROUSEL */}
      <motion.div 
        className="container my-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-center mb-4 fw-bold text-dark display-6">{t('home.carousel.title')}</h2>
        
        <div id="carouselExampleIndicators" className="carousel slide shadow-lg rounded-3 overflow-hidden" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          
          <div className="carousel-inner">
            <div className="carousel-item active" style={{ ...carouselItemStyle, backgroundImage: `url(${CAROUSEL_IMAGE_1})` }}>
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4">
                <h5 className="fw-bolder">{t('home.carousel.slide1.title')}</h5>
                <p>{t('home.carousel.slide1.text')}</p>
              </div>
            </div>

            <div className="carousel-item" style={{ ...carouselItemStyle, backgroundImage: `url(${CAROUSEL_IMAGE_2})` }}>
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4">
                <h5 className="fw-bolder">{t('home.carousel.slide2.title')}</h5>
                <p>{t('home.carousel.slide2.text')}</p>
              </div>
            </div>

            <div className="carousel-item" style={{ ...carouselItemStyle, backgroundImage: `url(${CAROUSEL_IMAGE_3})` }}>
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded-3 p-3 mb-4">
                <h5 className="fw-bolder">{t('home.carousel.slide3.title')}</h5>
                <p>{t('home.carousel.slide3.text')}</p>
              </div>
            </div>
          </div>
          
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">{t('home.carousel.prev')}</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">{t('home.carousel.next')}</span>
          </button>
        </div>
      </motion.div>

      {/* --- SECTION AVANTAGES --- */}
      <div className="container mt-5 py-5">
        <motion.h2 
          className="text-center mb-5 fw-bold text-dark display-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('home.advantages.title')}
        </motion.h2>
        
        <motion.div 
          className="row g-4 mb-5"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          {/* AVANTAGE 1 */}
          <motion.div className="col-md-4" variants={itemFadeIn}>
            <motion.div 
              className="card h-100 p-4 border-0 shadow-lg text-center transition-hover advantage-card"
              whileHover={{ y: -10 }} 
            >
              <div className="card-body">
                <span className="fs-1 mb-3 d-block" style={{ color: 'var(--color-secondary)' }}>
                  <i className="fas fa-bolt"></i>
                </span>
                <h3 className="card-title fw-bolder mb-3">{t('home.advantages.card1.title')}</h3>
                <p className="card-text text-muted fs-5">{t('home.advantages.card1.text')}</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* AVANTAGE 2 */}
          <motion.div className="col-md-4" variants={itemFadeIn}>
            <motion.div 
              className="card h-100 p-4 border-0 shadow-lg text-center transition-hover advantage-card"
              whileHover={{ y: -10 }}
            >
              <div className="card-body">
                <span className="fs-1 mb-3 d-block" style={{ color: 'var(--color-secondary, #4FC3F7)' }}>
                  <i className="fas fa-shield-alt"></i>
                </span>
                <h3 className="card-title fw-bolder mb-3">{t('home.advantages.card2.title')}</h3>
                <p className="card-text text-muted fs-5">{t('home.advantages.card2.text')}</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* AVANTAGE 3 */}
          <motion.div className="col-md-4" variants={itemFadeIn}>
            <motion.div 
              className="card h-100 p-4 border-0 shadow-lg text-center transition-hover advantage-card"
              whileHover={{ y: -10 }}
            >
              <div className="card-body">
                <span className="fs-1 mb-3 d-block" style={{ color: 'var(--color-secondary, #4FC3F7)' }}>
                  <i className="fas fa-map-marker-alt"></i> 
                </span>
                <h3 className="card-title fw-bolder mb-3">{t('home.advantages.card3.title')}</h3>
                <p className="card-text text-muted fs-5">{t('home.advantages.card3.text')}</p>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>

      {/* ❓ SECTION FAQ (NOUVELLE INTÉGRATION) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <FaqSection />
      </motion.div>
        
      {/* 💼 SECTION APPEL A L'ACTION PRO */}
      <div className="container my-5">
        <motion.div className="row"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="col-12 p-5 rounded-4 text-center shadow-lg"
            style={{ backgroundColor: 'var(--color-light-bg, #f4f7f9)' }} 
          >
            <h3 className="mb-3 fw-bold display-6">{t('home.proCTA.title')}</h3>
            <p className="lead text-muted col-md-8 mx-auto fs-5">
              {t('home.proCTA.text')}
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login" 
                className="btn btn-lg mt-3 shadow"
                style={{ backgroundColor: 'var(--color-accent, #FF7043)', borderColor: 'var(--color-accent, #FF7043)', color: 'white' }}
              >
                {t('home.proCTA.button')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}