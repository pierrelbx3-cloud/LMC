// src/App.jsx

import React from 'react';
// Importations de React Router DOM
import { Routes, Route, Link } from 'react-router-dom'; 

// Importations de vos pages (Assurez-vous que ces chemins sont corrects)
import Home from './pages/Home'; 
import About from './pages/About'; 

function App() {
  return (
    <div className="App">
      {/* 🧭 LES LIENS DE NAVIGATION */}
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Accueil</Link> | {' '}
        <Link to="/about">À Propos</Link>
      </nav>
      
      <h1>Mon Application avec React Router</h1> 
      
      {/* ✅ DEBUT DU CONTENEUR DE ROUTES */}
      <Routes>
        {/* Définition des routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes> 
      {/* 🛑 FIN DU CONTENEUR DE ROUTES (La balise fermante était manquante/incorrecte) */}
      
    </div>
  );
}

export default App;