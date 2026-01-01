import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// 1. Correction du rendu initial (évite les bugs d'affichage)
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

// 2. Composant pour recentrer la carte
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
  onViewDetail // Reçu du parent SearchComponent
}) {
  const [activeCoords, setActiveCoords] = useState(null);

  if (searchPhase !== 2) return null;

  return (
    <div className="container-fluid mt-4 mt-lg-5 px-0">
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
                          className="btn btn-primary btn-sm w-100"
                          onClick={() => onViewDetail(hangar)}
                        >
                          Détails
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
        <div className="col-lg-7 px-4" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0" style={{ color: 'var(--color-primary)' }}>
              {searchResults.length} Ateliers disponibles
            </h4>
            <span className="badge bg-light text-dark border p-2">{selectedModel}</span>
          </div>
          
          <div className="d-flex flex-column gap-3 mb-5">
            {searchResults.map(hangar => {
              const lat = hangar.airports?.lat;
              const lon = hangar.airports?.lon;
              const hasCoords = lat && lon;

              return (
                <div 
                  key={hangar.id_hangar} 
                  className="card border-0 shadow-sm transition-hover" 
                  style={{ 
                    borderRadius: '15px', 
                    cursor: 'pointer',
                    border: activeCoords?.[0] === lat ? '2px solid var(--color-primary)' : 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onClick={() => hasCoords && setActiveCoords([lat, lon])}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>{hangar.nom_hangar}</h5>
                        <p className="text-muted small mb-2">📍 {hangar.ville}, {hangar.pays}</p>
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                        {hangar.id_icao}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-2 my-2">
                      <span className="small px-2 py-1 rounded bg-light border-start border-3" style={{ borderLeftColor: 'var(--color-secondary)' }}>
                        🔧 {selectedService || "Maintenance générale"}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                      <div className="text-success small fw-bold">
                        <span className="me-1">●</span> Disponible
                      </div>
                      <div className="d-flex gap-2">
                        {/* Bouton Détails qui ouvre la Modal */}
                        <button 
                          className="btn btn-outline-secondary btn-sm px-3" 
                          style={{ borderRadius: '8px' }}
                          onClick={(e) => {
                            e.stopPropagation(); // Empêche le clic de recentrer la carte
                            onViewDetail(hangar);
                          }}
                        >
                          Détails
                        </button>
                        <button className="btn btn-primary btn-sm px-3" style={{ borderRadius: '8px' }}>
                          Réserver
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