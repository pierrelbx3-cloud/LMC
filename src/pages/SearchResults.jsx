import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';

// Fix pour les icônes Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

/**
 * Composant interne pour les étoiles Or
 */
const AdminStarRating = ({ rating }) => {
  const value = parseFloat(rating) || 0;
  return (
    <div className="d-flex gap-1 align-items-center mb-1">
      {[1, 2, 3, 4, 5].map((star) => {
        if (value >= star) {
          return <span key={star} style={{ color: '#FFD700', fontSize: '1rem' }}>★</span>;
        } else if (value >= star - 0.5) {
          return (
            <span key={star} style={{ position: 'relative', fontSize: '1rem', color: '#e4e5e9' }}>
              <span style={{ position: 'absolute', overflow: 'hidden', width: '50%', color: '#FFD700' }}>★</span>
              ★
            </span>
          );
        }
        return <span key={star} style={{ color: '#e4e5e9', fontSize: '1rem' }}>★</span>;
      })}
    </div>
  );
};

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 12, { animate: true });
    }
  }, [coords, map]);
  return null;
}

export default function SearchResults({ 
  searchPhase, 
  searchResults, 
  selectedModel, 
  selectedService, 
  selectedDate,
  onViewDetail,
  onToggleCompare, // <--- Props Comparateur
  compareList      // <--- Props Comparateur
}) {
  const { t } = useTranslation();
  const [activeCoords, setActiveCoords] = useState(null);

  if (searchPhase !== 2) return null;

  return (
    <div className="container-fluid mt-4 mt-lg-5 px-0 animate__animated animate__fadeIn">
      <div className="row g-0">
        
        {/* === COLONNE CARTE (DROITE) === */}
        <div className="col-lg-5 order-first order-lg-last px-2 px-lg-3 mb-4 mb-lg-0">
          <div 
            className="sticky-top shadow-sm" 
            style={{ 
              top: '90px', 
              height: '45vh',
              minHeight: '350px', 
              borderRadius: '20px', 
              overflow: 'hidden',
              zIndex: 10 
            }}
          >
            <MapContainer 
              center={[46.6, 2.2]} 
              zoom={5} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {searchResults.map(hangar => (
                hangar.airports?.lat && (
                  <Marker 
                    key={hangar.id_hangar} 
                    position={[hangar.airports.lat, hangar.airports.lon]} 
                    icon={DefaultIcon}
                  >
                    <Popup>
                      <div className="text-center p-1">
                        <strong className="d-block mb-2">{hangar.nom_hangar}</strong>
                        <button 
                          className="btn btn-accent-pro btn-sm w-100 text-white"
                          onClick={() => onViewDetail(hangar)}
                        >
                          {t('searchResults.mapPopup.viewDetails')}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}

              <MapResizer />
              <RecenterMap coords={activeCoords} />
            </MapContainer>
          </div>
        </div>

        {/* === COLONNE LISTE DES RÉSULTATS (GAUCHE) === */}
        <div className="col-lg-7 px-3 px-lg-4" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <h4 className="fw-bold m-0" style={{ color: 'var(--color-primary)' }}>
              {t('searchResults.headerCount', { count: searchResults.length })}
            </h4>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-light text-dark border p-2 shadow-sm">{selectedModel}</span>
              {selectedService && (
                 <span className="badge bg-primary-subtle text-primary border p-2 shadow-sm">{selectedService}</span>
              )}
            </div>
          </div>
          
          <div className="d-flex flex-column gap-3 mb-5">
            {searchResults.map(hangar => {
              const lat = hangar.airports?.lat;
              const lon = hangar.airports?.lon;
              const hasCoords = lat && lon;
              const specMaintenance = hangar.hangar_triple?.[0]?.maintenance_type;

              // --- LOGIQUE DE SÉLECTION ---
              const isSelected = compareList?.some(item => item.id_hangar === hangar.id_hangar);
              const isActiveOnMap = activeCoords?.[0] === lat;
              
              // Gestion de la couleur de bordure (Priorité : Map > Compare > Rien)
              // Ici on utilise ta variable CSS accent pour le comparateur
              let borderColor = 'transparent';
              
              if (isActiveOnMap) {
                  // Optionnel: Garder bleu nuit pour la carte ou utiliser accent
                  borderColor = 'var(--color-primary)'; 
              } else if (isSelected) {
                  // BORDURE TERRE CUITE SI SÉLECTIONNÉ
                  borderColor = 'var(--color-accent)'; 
              }

              return (
                <div 
                  key={hangar.id_hangar} 
                  className={`card shadow-sm transition-hover`} 
                  style={{ 
                    borderRadius: '15px', 
                    cursor: 'pointer',
                    border: `2px solid ${borderColor}`,
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: '#fff'
                  }}
                  onClick={() => hasCoords && setActiveCoords([lat, lon])}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <AdminStarRating rating={hangar.rating_admin} />
                        
                        <h5 className="fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                          {hangar.nom_hangar}
                        </h5>
                        <p className="text-muted small mb-2">📍 {hangar.ville}, {hangar.pays}</p>
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
                        {hangar.id_icao}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-2 my-2">
                      <span className="small px-2 py-1 rounded bg-light border-start border-3" style={{ borderLeftColor: 'var(--color-secondary)' }}>
                        🔧 {specMaintenance || selectedService || t('searchResults.tags.certifiedMaintenance')}
                      </span>
                      {selectedDate === 'AOG' && (
                        <span className="small px-2 py-1 rounded bg-danger-subtle text-danger border-start border-3 border-danger">
                          ⚡ {t('searchResults.tags.aogSupport')}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                      <div className="text-success small fw-bold">
                        <span className="me-1">●</span> {t('searchResults.status.approvedStation')}
                      </div>

                      <div className="d-flex flex-wrap gap-2 w-100 w-sm-auto justify-content-end align-items-center">
                        
                        {/* --- SWITCH COMPARER STYLE CUSTOM --- */}
                        <div 
                          className="form-check form-switch me-2" 
                          onClick={(e) => e.stopPropagation()} 
                        >
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch"
                            id={`compare-${hangar.id_hangar}`}
                            checked={isSelected}
                            onChange={() => onToggleCompare(hangar)}
                            style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                          />
                          <label 
                            className={`form-check-label small ms-1 ${isSelected ? 'form-check-label-active' : 'text-muted'}`}
                            htmlFor={`compare-${hangar.id_hangar}`}
                            style={{ cursor: 'pointer' }}
                          >
                            {isSelected ? 'Comparé' : 'Comparer'}
                          </label>
                        </div>

                        <button 
                          className="btn btn-outline-secondary btn-sm px-3 flex-grow-1 flex-sm-grow-0" 
                          style={{ borderRadius: '20px', fontWeight: '600' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(hangar);
                          }}
                        >
                          {t('searchResults.buttons.details')}
                        </button>
                        <button 
                          className="btn btn-accent-pro btn-sm px-3 text-white flex-grow-1 flex-sm-grow-0 shadow-sm" 
                          style={{ borderRadius: '20px', fontWeight: '600' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(hangar); 
                          }}
                        >
                          {t('searchResults.buttons.contact')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}