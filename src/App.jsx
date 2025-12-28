import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Search from './pages/Search'; 
import Login from './pages/Login';

// Pages Pro
import ProDashboard from './pages/pro/ProDashboard'; 
import Agenda from './pages/pro/Agenda';      
import HangarUpdate from './pages/pro/HangarUpdate';
import AdminUpdate from './pages/pro/AdminUpdate';

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Header />
      
      <main className="flex-grow-1 w-100"> 
        <Routes>
          {/* --- ROUTES PUBLIQUES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<div className="container py-4"><Services /></div>} />
          <Route path="/about" element={<div className="container py-4"><About /></div>} />
          <Route path="/contact" element={<div className="container py-4"><Contact /></div>} />
          <Route path="/search" element={<div className="container py-4"><Search /></div>} /> 
          
          {/* --- LOGIN : Page d'entrée --- */}
          <Route path="/login" element={<div className="container py-4"><Login /></div>} />

          {/* --- ROUTES PROTÉGÉES (PROFESSIONNELS) --- */}
          {/* On utilise ProtectedRoute pour chaque page sensible */}
          <Route path="/pro/dashboard" element={
            <ProtectedRoute>
              <div className="container py-4"><ProDashboard /></div>
            </ProtectedRoute>
          } />

          <Route path="/pro/agenda" element={
            <ProtectedRoute>
              <div className="container py-4"><Agenda /></div>
            </ProtectedRoute>
          } />

          <Route path="/pro/hangar" element={
            <ProtectedRoute>
              <div className="container py-4"><HangarUpdate /></div>
            </ProtectedRoute>
          } />

          <Route path="/pro/admin" element={
            <ProtectedRoute>
              <div className="container py-4"><AdminUpdate /></div>
            </ProtectedRoute>
          } />

          {/* Redirection automatique vers /pro/dashboard si l'utilisateur tape juste /pro */}
          <Route path="/pro" element={<Navigate to="/pro/dashboard" replace />} />

          {/* Route 404 */}
          <Route path="*" element={<h2 className="text-center mt-5">404 - Page Introuvable</h2>} />
        </Routes>
      </main> 
      
      <Footer/>
    </div>
  );
}

export default App;