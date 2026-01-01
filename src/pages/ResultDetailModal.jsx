// src/components/ResultDetailModal.jsx
import React from 'react';

export default function ResultDetailModal({ show, onClose, hangar }) {
  // Si show est false ou si aucun hangar n'est sélectionné, on ne renvoie rien
  if (!show || !hangar) return null;

  return (
    <>
      {/* Overlay (Arrière-plan sombre) */}
      <div 
        className="modal-backdrop fade show" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1060 }}
        onClick={onClose} // Ferme la modal si on clique à côté
      ></div>

      {/* Fenêtre Modal */}
      <div className="modal d-block" style={{ zIndex: 1070 }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            
            {/* Header avec dégradé léger ou couleur primaire */}
            <div className="modal-header border-bottom-0 p-4 d-flex align-items-start">
              <div className="flex-grow-1">
                <h3 className="modal-title fw-bold text-primary mb-1">{hangar.nom_hangar}</h3>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-light text-dark border px-2 py-1 small">
                    ICAO: {hangar.id_icao || 'N/A'}
                  </span>
                  <span className="text-muted small">
                    📍 {hangar.ville}, {hangar.pays}
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close shadow-none" 
                onClick={onClose} 
                aria-label="Close"
              ></button>
            </div>

            {/* Corps de la Modal */}
            <div className="modal-body p-4 pt-0">
              <div className="row g-4">
                
                {/* Colonne de Gauche : Localisation */}
                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-light border-0 h-100">
                    <h6 className="fw-bold text-uppercase small text-muted mb-3">
                      <i className="bi bi-geo-alt-fill me-2"></i>Coordonnées
                    </h6>
                    <p className="mb-1 text-dark fw-medium">
                      {hangar.Adresse || "Adresse non renseignée"}
                    </p>
                    <p className="mb-0 text-dark">
                      {hangar.Zip_code ? `${hangar.Zip_code} ` : ''} 
                      <span className="text-uppercase fw-bold">{hangar.ville}</span>
                    </p>
                    <p className="text-primary mb-0">{hangar.pays}</p>
                  </div>
                </div>

                {/* Colonne de Droite : Contact */}
                <div className="col-md-6">
                  <div className="p-3 rounded-4 bg-light border-0 h-100">
                    <h6 className="fw-bold text-uppercase small text-muted mb-3">
                      <i className="bi bi-telephone-fill me-2"></i>Contact
                    </h6>
                    <div className="mb-3">
                      <p className="small text-muted mb-0">Téléphone</p>
                      <a href={`tel:${hangar.Phone}`} className="text-decoration-none text-dark fw-bold">
                        {hangar.Phone || "Non renseigné"}
                      </a>
                    </div>
                    <div>
                      <p className="small text-muted mb-0">E-mail de contact</p>
                      <a href={`mailto:${hangar.adresse_mail}`} className="text-decoration-none d-block text-truncate fw-bold">
                        {hangar.adresse_mail}
                      </a>
                      {hangar.adresse_mail1 && (
                        <small className="text-muted d-block mt-1">
                          Alt: {hangar.adresse_mail1}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Information de mise à jour (Optionnel) */}
                <div className="col-12 mt-3 text-center">
                  <hr className="my-3 opacity-10" />
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Dernière mise à jour : {new Date(hangar.date_maj).toLocaleDateString()}
                  </p>
                </div>

              </div>
            </div>

            {/* Footer avec boutons d'actions */}
            <div className="modal-footer border-top-0 p-4 pt-0 d-flex justify-content-between">
              <button 
                type="button" 
                className="btn btn-light px-4 py-2 fw-medium rounded-pill" 
                onClick={onClose}
              >
                Retour
              </button>
              <div className="d-flex gap-2">
                <a 
                  href={`mailto:${hangar.adresse_mail}?subject=Demande d'informations - Let Me Check`} 
                  className="btn btn-accent-pro px-4 py-2 fw-bold text-white rounded-pill shadow-sm"
                >
                  ✉️ Contacter l'atelier
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}