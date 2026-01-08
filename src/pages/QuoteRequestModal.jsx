import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

export default function QuoteRequestModal({ show, onClose, hangar, selectedModel }) {
  const { t } = useTranslation(); // <--- HOOK
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxyZleqjoN2rD-Bh7O94QnL_eOvMnK8ly7NrPiZ3QpcAuwDkvGZjqvCqljoGnSP_nL81w/exec";

    const dataToSend = {
      ...formData,
      token: "mysecretPIERRE", 
      hangar_name: hangar?.nom_hangar,
      aircraft_model: selectedModel,
      date: new Date().toLocaleString()
    };

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      setStatus('success');
      setTimeout(() => { 
        onClose(); 
        setStatus('idle'); 
        setFormData({ name: '', email: '', phone: '', description: '' });
      }, 2000);
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert(t('quoteModal.error')); // <--- Traduction de l'alerte
      setStatus('idle');
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1060 }} onClick={onClose}></div>
      <div className="modal fade show d-block" style={{ zIndex: 1070 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
            <div className="modal-header border-0 p-4">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                {/* Utilisation de variable dans la traduction */}
                {t('quoteModal.title', { hangarName: hangar?.nom_hangar })}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4 pt-0">
              {status === 'success' ? (
                <div className="text-center py-4 animate__animated animate__zoomIn">
                  <div className="display-1 mb-3">✅</div>
                  <h4 className="fw-bold" style={{ color: 'var(--color-primary)' }}>
                    {t('quoteModal.success.title')}
                  </h4>
                  <p className="text-muted">
                    {t('quoteModal.success.message')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                      {t('quoteModal.form.aircraft')}
                    </label>
                    <input type="text" className="form-control bg-light border-0" value={selectedModel} disabled />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        {t('quoteModal.form.name')}
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        {t('quoteModal.form.phone')}
                      </label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                      {t('quoteModal.form.email')}
                    </label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">
                      {t('quoteModal.form.description')}
                    </label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      required
                      placeholder={t('quoteModal.form.placeholder')}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-accent-pro w-100 text-white rounded-pill py-3 shadow" 
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : t('quoteModal.btnSend')}
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