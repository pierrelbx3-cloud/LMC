import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Search from './pages/Search';

import Login from './pages/Login';
import Register from './pages/Register';

import ProDashboard from './pages/pro/ProDashboard';
import Agenda from './pages/pro/Agenda';
import HangarUpdate from './pages/pro/HangarUpdate';
import AdminUpdate from './pages/pro/AdminUpdate';

function App() {
  return (
    <AuthProvider>
      <div className="App d-flex flex-column min-vh-100">
        <Header />

        <main className="flex-grow-1 w-100">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/services" element={<div className="container py-4"><Services /></div>} />
            <Route path="/about" element={<div className="container py-4"><About /></div>} />
            <Route path="/contact" element={<div className="container py-4"><Contact /></div>} />
            <Route path="/search" element={<div className="container py-4"><Search /></div>} />

            <Route path="/login" element={<div className="container py-4"><Login /></div>} />
            <Route path="/register" element={<div className="container py-4"><Register /></div>} />

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

            <Route path="*" element={<h2 className="text-center mt-5">404</h2>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
