import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

/**
 * Composant interne StarRating optimisé (Couleur Or + Demi-étoiles)
 */
const StarRating = ({ rating, noteLabel }) => {
  const value = parseFloat(rating) || 0;

  return (
    <div className="d-flex gap-1 align-items-center" title={`Note: ${value}/5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (value >= star) {
          return <span key={star} style={{ color: '#FFD700', fontSize: '1.5rem' }}>★</span>;
        } else if (value >= star - 0.5) {
          return (
            <span key={star} style={{ position: 'relative', fontSize: '1.5rem', color: '#e4e5e9' }}>
              <span style={{ position: 'absolute', overflow: 'hidden', width: '50%', color: '#FFD700' }}>★</span>
              ★
            </span>
          );
        }
        return <span key={star} style={{ color: '#e4e5e9', fontSize: '1.5rem' }}>★</span>;
      })}
      {value > 0 && <span className="ms-2 fw-bold text-muted small">({value}/5)</span>}
    </div>
  );
};

export default function ResultDetailModal({ show, onClose, hangar, selectedTypeId, onQuoteRequest }) {
  const { t } = useTranslation(); // <--- HOOK
  const [activeTab, setActiveTab] = useState('admin'); 
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && hangar && selectedTypeId) {
      fetchCertifications();
    }
  }, [show, hangar, selectedTypeId]);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hangar_triple')
        .select(`
          maintenance_type,
          agreement (
            id_agreement,
            numero_agrement,
            authorities (
              name,
              country,
              parent_authority
            )
          )
        `)
        .eq('id_hangar', hangar.id_hangar)
        .eq('id_type', selectedTypeId);

      if (error) throw error;
      setCertifications(data || []);
    } catch (err) {
      console.error("Erreur chargement agréments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!show || !hangar) return null;

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose} 
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1040 }}
      ></div>

      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered px-3">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            
            <div className="p-4 border-bottom bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  {hangar.nom_hangar}
                </h3>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>

              <div className="d-flex gap-2 overflow-auto pb-2">
                <button 
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-bold transition-all whitespace-nowrap ${activeTab === 'admin' ? 'btn-accent-pro text-white shadow' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('admin')}
                >
                  📍 {t('modal.tabs.info')}
                </button>
                <button 
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-bold transition-all whitespace-nowrap ${activeTab === 'agreements' ? 'btn-accent-pro text-white shadow' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('agreements')}
                >
                  📜 {t('modal.tabs.agreements')}
                </button>
                <button 
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-bold transition-all whitespace-nowrap ${activeTab === 'rating' ? 'btn-accent-pro text-white shadow' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('rating')}
                >
                  ⭐ {t('modal.tabs.rating')}
                </button>
              </div>
            </div>

            <div className="modal-body p-4" style={{ backgroundColor: 'var(--color-light-bg)', minHeight: '320px' }}>
              
              {/* ONGLET 1 : ADMIN */}
              {activeTab === 'admin' && (
                <div className="row g-4 animate__animated animate__fadeIn">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-uppercase text-muted d-block">
                        {t('modal.info.address')}
                      </label>
                      <p className="fw-medium mb-0">{hangar.adresse || 'N/A'}</p>
                      <p className="text-muted small">{hangar.zip_code} {hangar.ville}, {hangar.pays}</p>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-uppercase text-muted d-block">
                        {t('modal.info.email')}
                      </label>
                      <span className="fw-bold" style={{ color: 'var(--color-accent)' }}>{hangar.adresse_mail}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-uppercase text-muted d-block">
                        {t('modal.info.phone')}
                      </label>
                      <p className="fw-medium">{hangar.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-uppercase text-muted d-block">
                        {t('modal.info.icao')}
                      </label>
                      <span className="badge bg-primary px-3 py-2" style={{ borderRadius: '8px' }}>{hangar.id_icao}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET 2 : AGRÉMENTS */}
              {activeTab === 'agreements' && (
                <div className="animate__animated animate__fadeIn">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status"></div>
                    </div>
                  ) : certifications.length > 0 ? (
                    <div className="table-responsive rounded-3 bg-white shadow-sm">
                      <table className="table table-hover align-middle mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr className="small text-uppercase text-muted">
                            <th className="px-3 py-3">{t('modal.agreements.table.number')}</th>
                            <th>{t('modal.agreements.table.authority')}</th>
                            <th>{t('modal.agreements.table.country')}</th>
                            <th>{t('modal.agreements.table.type')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certifications.map((cert, index) => (
                            <tr key={index}>
                              <td className="px-3 py-3 fw-bold" style={{ color: 'var(--color-primary)' }}>
                                {cert.agreement?.numero_agrement}
                              </td>
                              <td>
                                <div className="fw-medium">{cert.agreement?.authorities?.name}</div>
                                <div className="small text-muted">{cert.agreement?.authorities?.parent_authority}</div>
                              </td>
                              <td>{cert.agreement?.authorities?.country}</td>
                              <td><span className="badge bg-light text-dark border small">{cert.maintenance_type}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                      <p className="text-muted mb-0">{t('modal.agreements.noData')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ONGLET 3 : ÉVALUATION ADMIN */}
              {activeTab === 'rating' && (
                <div className="animate__animated animate__fadeIn">
                  <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4">
                    <label className="form-label small fw-bold text-uppercase text-muted d-block mb-3">
                      {t('modal.rating.label')}
                    </label>
                    <div className="d-flex justify-content-center mb-4">
                      <StarRating rating={hangar.rating_admin} />
                    </div>
                    <p className="text-muted px-lg-4 mb-0">
                      {t('modal.rating.description')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer border-top-0 p-4 pt-0 bg-light-bg justify-content-between">
              <button className="btn btn-link text-decoration-none text-muted fw-bold" onClick={onClose}>
                {t('modal.buttons.close')}
              </button>
              <button 
                className="btn btn-accent-pro btn-lg px-5 text-white shadow-sm rounded-pill animate__animated animate__pulse animate__infinite"
                style={{ fontSize: '0.95rem' }}
                onClick={onQuoteRequest} 
              >
                {t('modal.buttons.quote')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}