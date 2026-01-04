import React, { useState } from 'react';

export default function QuoteRequestModal({ show, onClose, hangar, selectedModel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const GOOGLE_SHEET_URL = "VOTRE_URL_GOOGLE_APPS_SCRIPT";

    const dataToSend = {
      ...formData,
      hangar_name: hangar.nom_hangar,
      aircraft_model: selectedModel,
      date: new Date().toLocaleString()
    };

    try {
      // Envoi via fetch (mode no-cors souvent nécessaire pour Google Apps Script)
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      setStatus('success');
      setTimeout(() => { onClose(); setStatus('idle'); }, 2000);
    } catch (error) {
      alert("Erreur lors de l'envoi");
      setStatus('idle');
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1060 }}></div>
      <div className="modal fade show d-block" style={{ zIndex: 1070 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
            <div className="modal-header border-0 p-4">
              <h5 className="fw-bold mb-0">Demande de devis - {hangar.nom_hangar}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4 pt-0">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="h1">✅</div>
                  <p className="fw-bold">Demande envoyée avec succès !</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Modèle d'avion</label>
                    <input type="text" className="form-control bg-light" value={selectedModel} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Nom complet</label>
                    <input type="text" className="form-control" required onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Email professionnel</label>
                    <input type="email" className="form-control" required onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Description des travaux</label>
                    <textarea className="form-control" rows="3" placeholder="Ex: C-Check, Réparation structure..." onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-accent-pro w-100 text-white rounded-pill py-3 shadow-sm" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Envoi...' : 'Envoyer la demande'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}