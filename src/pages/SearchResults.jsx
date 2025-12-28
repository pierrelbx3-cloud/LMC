import React from 'react';
import HangarMap from '../components/HangarMap'; // Importation du nouveau composant Leaflet

export default function SearchResults({ 
  searchPhase, 
  searchResults, 
  selectedModel, 
  selectedService, 
  selectedDate 
}) {
  
  if (searchPhase !== 2) return null;

  return (
    <div className="mt-4">
      {searchResults.length > 0 ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold" style={{ color: 'var(--color-primary)' }}>
              {searchResults.length} Ateliers disponibles
            </h4>
          </div>
          
          <div className="row g-4">
            {searchResults.map(hangar => {
              const lat = hangar.lat || 0;
              const lon = hangar.lon || 0;

              return (
                <div key={hangar.id_hangar} className="col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm transition-hover advantage-card" style={{ borderRadius: '15px' }}>
                    
                    {/* CARTE DYNAMIQUE LEAFLET (Remplace l'image Mapbox) */}
                    <div className="position-relative" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px', overflow: 'hidden' }}>
                      <HangarMap 
                        lat={lat} 
                        lon={lon} 
                        name={hangar.nom_hangar} 
                      />
                      <span className="position-absolute top-0 end-0 m-2 badge" style={{ backgroundColor: 'var(--color-primary)', zIndex: 1000 }}>
                        {hangar.id_icao}
                      </span>
                    </div>

                    <div className="card-body p-4">
                      <h5 className="card-title fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                        {hangar.nom_hangar}
                      </h5>
                      
                      <div className="d-flex flex-column gap-2 mb-3">
                        <div className="small text-muted">
                          <span className="me-2">📍</span>
                          {hangar.ville}, {hangar.pays}
                        </div>
                        <div className="small">
                          <span className="me-2">✈️</span>
                          <span className="fw-semibold">{selectedModel}</span>
                        </div>
                        <div className="small px-2 py-1 rounded bg-light border-start border-3" style={{ borderLeftColor: 'var(--color-secondary) !important' }}>
                          <span className="me-2">🔧</span>
                          {selectedService || "Maintenance générale"}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-top">
                        {selectedDate ? (
                          <button className="btn btn-accent-pro w-100 py-2 fw-bold shadow-sm">
                            Réserver pour le {selectedDate}
                          </button>
                        ) : (
                          <div className="p-2 rounded text-center small" style={{ backgroundColor: 'rgba(200, 117, 105, 0.1)', color: 'var(--color-accent)' }}>
                             Veuillez sélectionner une date
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <div className="display-1 mb-3">🔍</div>
          <h3 className="fw-bold" style={{ color: 'var(--color-primary)' }}>Aucun résultat</h3>
          <p className="text-muted">Essayez de modifier vos filtres ou de choisir une autre date.</p>
        </div>
      )}
    </div>
  );
}