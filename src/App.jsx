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
import Login from './pages/Login';
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
          {/* --- ROUTES PUBLIQUES et CLIENTS (Pas de login) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} /> 
          <Route path="/login" element={<Login />} />

          {/* --- ROUTES PROTÉGÉES (PROFESSIONNELS) --- */}
          {/* Si non connecté, ProtectedRoute redirige vers /login */}
          <Route path="/pro/agenda" element={
            <ProtectedRoute>
              <Agenda />
            </ProtectedRoute>
          } />
          
          <Route path="/pro/hangar" element={
            <ProtectedRoute>
              <HangarUpdate />
            </ProtectedRoute>
          } />

          {/* Route 404 (Attrape toutes les autres routes) */}
          <Route path="*" element={<h2 className="text-center mt-5">404 - Page Introuvable</h2>} />
        </Routes>
      </main> 
      <Footer/>
    </div>
  );
}

export default App;