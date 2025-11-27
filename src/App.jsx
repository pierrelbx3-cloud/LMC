import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Assurez-vous d'avoir bien créé ce composant dans src/components/
import Header from './components/Header'; 
// Assurez-vous d'avoir bien créé ce composant dans src/components/
import Footer from './components/Footer';

// Importation des Pages de Présentation (Front Office)
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

// Importation des Pages Client
import Search from './pages/Search'; 

// Importation des Pages Professionnelles (Back Office)
import ProDashboard from './pages/pro/ProDashboard'; 
import Agenda from './pages/pro/Agenda';      
import HangarUpdate from './pages/pro/HangarUpdate';
import AdminUpdate from './pages/pro/AdminUpdate';


function App() {
  return (
    // 'd-flex flex-column min-vh-100' assure que le footer reste toujours en bas de l'écran (layout flexible)
    <div className="App d-flex flex-column min-vh-100">
      <Header /> {/* Le Header est visible sur toutes les pages */}
      
      {/* CORRECTION : Suppression de 'container' et de 'py-4'. 
         L'élément main prend 100% de la largeur du parent. */}
      <main className="flex-grow-1 w-100"> 
        <Routes>
          {/* --- ROUTE HOME : PAS DE PADDING (la bannière gère son propre espacement) --- */}
          <Route path="/" element={<Home />} />
          
          {/* --- AUTRES ROUTES : AJOUT DU PADDING INTERNE (container py-4) --- */}
          {/* Le container gère l'alignement centré et le py-4 ajoute l'espacement requis. */}
          
          <Route path="/services" element={<div className="container py-4"><Services /></div>} />
          <Route path="/about" element={<div className="container py-4"><About /></div>} />
          <Route path="/contact" element={<div className="container py-4"><Contact /></div>} />
          <Route path="/search" element={<div className="container py-4"><Search /></div>} /> 
          
          <Route path="/login" element={<div className="container py-4"><ProDashboard /></div>} />

          {/* --- ROUTES PROTÉGÉES (PROFESSIONNELS) AVEC PADDING --- */}
          <Route path="/pro/agenda" element={<div className="container py-4"><Agenda /></div>} />
          <Route path="/pro/hangar" element={<div className="container py-4"><HangarUpdate /></div>} />
          <Route path="/pro/admin" element={<div className="container py-4"><AdminUpdate /></div>} />
          {/* Route 404 (Attrape toutes les autres routes) */}
          <Route path="*" element={<h2 className="text-center mt-5">404 - Page Introuvable</h2>} />
        </Routes>
      </main> 
      
      <Footer/>
    </div>
  );
}

export default App;