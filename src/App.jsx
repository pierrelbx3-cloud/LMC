import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Assurez-vous d'avoir bien créé ce composant dans src/components/
import Header from './components/Header'; 
// Assurez-vous d'avoir bien créé ce composant dans src/components/
import ProtectedRoute from './components/ProtectedRoute'; 
import Footer from './components/Footer';

// Importation des Pages de Présentation (Front Office)
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

// Importation des Pages Client
import Search from './pages/Search'; 

// Importation des Pages Professionnelles (Back Office)
// REMPLACÉ : On importe le Dashboard à la place du Login de la page
// NOUVEAU : Importation du composant de tableau de bord
import ProDashboard from './pages/pro/ProDashboard'; 
import Agenda from './pages/pro/Agenda';      
import HangarUpdate from './pages/pro/HangarUpdate';


function App() {
  return (
    // 'd-flex flex-column min-vh-100' assure que le footer reste toujours en bas de l'écran (layout flexible)
    <div className="App d-flex flex-column min-vh-100">
      <Header /> {/* Le Header est visible sur toutes les pages */}
      
      {/* Le conteneur main prend l'espace restant et centre le contenu */}
      <main className="container flex-grow-1 py-4">
        <Routes>
          {/* --- ROUTES PUBLIQUES et CLIENTS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} /> 
          
          {/* MODIFICATION : La route /login affiche maintenant directement le Dashboard Pro 
             (en attendant la réactivation du login) */}
          <Route path="/login" element={<ProDashboard />} />

          {/* --- ROUTES PROTÉGÉES (PROFESSIONNELS) --- */}
          {/* NOTE : La protection a été retirée temporairement pour permettre l'accès 
             aux pages de gestion via le Dashboard tant que le Login est inactif. */}
          
          {/* Ancienne route /pro/agenda (maintenant accessible directement) */}
          <Route path="/pro/agenda" element={<Agenda />} />
          
          {/* Ancienne route /pro/hangar (maintenant accessible directement) */}
          <Route path="/pro/hangar" element={<HangarUpdate />} />

          {/* Route 404 (Attrape toutes les autres routes) */}
          <Route path="*" element={<h2 className="text-center mt-5">404 - Page Introuvable</h2>} />
        </Routes>
      </main> 
      
      {/* CORRECTION : Utilisation de la balise du composant React Footer (avec la majuscule) */}
      <Footer/>
    </div>
  );
}

export default App;