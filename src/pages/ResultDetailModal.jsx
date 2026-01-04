import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// AJOUT DE onQuoteRequest DANS LES PROPS CI-DESSOUS
export default function ResultDetailModal({ show, onClose, hangar, selectedTypeId, onQuoteRequest }) {
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
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            
            <div className="p-4 border-bottom" style={{ backgroundColor: '#ffffff' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  {hangar.nom_hangar}
                </h3>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>

              <div className="d-flex gap-3 border-bottom-0">
                <button 
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-bold transition-all ${activeTab === 'admin' ? 'btn-accent-pro text-white shadow' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('admin')}
                >
                  📍 Informations
                </button>
                <button 
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-bold transition-all ${activeTab === 'agreements' ? 'active btn-accent-pro text-white shadow' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('agreements')}
                >
                  📜 Agréments
                </button>
              </div>
            </div>

            <div className="modal-body p-4" style={{ backgroundColor: 'var(--color-light-bg)', minHeight: '300px' }}>
              
              {activeTab === 'admin' ? (
                <div className="row g-4 animate__animated animate__fadeIn">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-uppercase text-muted d-block">Adresse Physique</label>
                      <p className="fw-medium mb-0">{hangar.Adresse || 'N/A'}</p>
                      <p className="text-muted small">{hangar.Zip_code} {hangar.ville}, {hangar.pays}</p>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-uppercase text-muted d-block">Contact Email</label>
                      <span className="fw-bold" style={{ color: 'var(--color-accent)' }}>{hangar.adresse_mail}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-uppercase text-muted d-block">Téléphone</label>
                      <p className="fw-medium">{hangar.Phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-uppercase text-muted d-block">Code ICAO</label>
                      <span className="badge bg-primary px-3 py-2" style={{ borderRadius: '8px' }}>{hangar.id_icao}</span>
                    </div>
                  </div>
                </div>
              ) : (
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
                            <th className="px-3 py-3">Numéro</th>
                            <th>Autorité</th>
                            <th>Pays</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certifications.map((cert, index) => (
                            <tr key={index}>
                              <td className="px-3 py-3 fw-bold" style={{ color: 'var(--color-primary)' }}>{cert.agreement?.numero_agrement}</td>
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
                    <div className="text-center py-5 bg-white rounded-3">
                      <p className="text-muted mb-0">Aucun agrément spécifique trouvé.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer border-top-0 p-4 pt-0" style={{ backgroundColor: 'var(--color-light-bg)' }}>
              <button className="btn btn-link text-decoration-none text-muted fw-bold" onClick={onClose}>Fermer</button>
              
              {/* CE BOUTON APPELLE MAINTENANT LA PROP CORRECTEMENT */}
              <button 
                className="btn btn-accent-pro btn-lg px-5 text-white shadow-sm rounded-pill"
                style={{ fontSize: '0.9rem' }}
                onClick={onQuoteRequest} 
              >
                Demander un devis
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}