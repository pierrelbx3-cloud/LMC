import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Composants de structure
import Header from './components/Header'; 
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages Publiques
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Search from './pages/Search'; 

// Pages Authentification
import Login from './pages/Login';
import Register from './pages/Register';

// Pages Pro (Back Office)
import ProDashboard from './pages/pro/ProDashboard'; 
import Agenda from './pages/pro/Agenda';      
import HangarUpdate from './pages/pro/HangarUpdate';
import AdminUpdate from './pages/pro/AdminUpdate';

// --- NOUVEL IMPORT : ADMIN ---
import AdminDashboard from './pages/AdminDashboard'; 

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
          <Route path="/search" element={<div className="container-fluid py-4"><Search /></div>} /> 
          
          {/* --- AUTHENTIFICATION --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- NOUVELLE ROUTE : ADMIN DASHBOARD --- */}
          <Route path="/AdminDashboard" element={
            <ProtectedRoute>
              <div className="container py-4">
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          } />

          {/* --- ROUTES PROTÉGÉES (Accès restreint au 'user' connecté) --- */}
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

          {/* Redirection automatique pour l'URL /pro */}
          <Route path="/pro" element={<Navigate to="/pro/dashboard" replace />} />

          {/* Route 404 (Si aucune route ne correspond) */}
          <Route path="*" element={
            <div className="container text-center py-5">
              <h2 className="mt-5">404 - Page Introuvable</h2>
              <p className="text-muted">Le chemin que vous cherchez n'existe pas.</p>
            </div>
          } />
        </Routes>
      </main> 
      
      <Footer/>
    </div>
  );
}

export default App;