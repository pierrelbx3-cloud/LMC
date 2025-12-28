import React, { useState } from 'react';
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

// Composant pour recentrer la carte
function RecenterMap({ coords }) {
  const map = useMap();
  if (coords) map.setView(coords, 12, { animate: true });
  return null;
}

export default function SearchResults({ searchPhase, searchResults, selectedModel, selectedService, selectedDate }) {
  const [activeCoords, setActiveCoords] = useState(null);

  if (searchPhase !== 2) return null;

  return (
    <div className="container-fluid mt-5 px-0">
      <div className="row g-0" style={{ minHeight: '80vh' }}>
        
        {/* === LISTE DES RÉSULTATS (GAUCHE) === */}
        <div className="col-lg-7 px-4" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          <h4 className="fw-bold mb-4" style={{ color: 'var(--color-primary)' }}>
            {searchResults.length} Ateliers disponibles pour {selectedModel}
          </h4>
          
          <div className="d-flex flex-column gap-3">
            {searchResults.map(hangar => {
              // Extraction des données de la jointure
              const lat = hangar.airports?.lat;
              const lon = hangar.airports?.lon;
              const hasCoords = lat && lon;

              return (
                <div 
                  key={hangar.id_hangar} 
                  className="card border-0 shadow-sm transition-hover" 
                  style={{ borderRadius: '15px', border: activeCoords?.[0] === lat ? '2px solid var(--color-primary)' : 'none' }}
                  onClick={() => hasCoords && setActiveCoords([lat, lon])}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1">{hangar.nom_hangar}</h5>
                        <p className="text-muted small">📍 {hangar.ville}, {hangar.pays} ({hangar.id_icao})</p>
                      </div>
                      <span className="badge bg-primary-subtle text-primary">{hangar.id_icao}</span>
                    </div>

                    <div className="d-flex gap-2 my-2">
                      <span className="badge bg-light text-dark border">🔧 {selectedService}</span>
                    </div>

                    <div className="mt-3 d-flex justify-content-between align-items-center">
                      <button className="btn btn-outline-primary btn-sm">Détails</button>
                      {selectedDate && <button className="btn btn-primary btn-sm">Réserver</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === CARTE DYNAMIQUE (DROITE) === */}
        <div className="col-lg-5 position-relative d-none d-lg-block">
          <div className="sticky-top" style={{ top: '100px', height: '80vh', padding: '0 20px' }}>
            <div className="h-100 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <MapContainer 
                center={[46.6, 2.2]} 
                zoom={5} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {searchResults.map(hangar => (
                  hangar.airports?.lat && (
                    <Marker 
                      key={hangar.id_hangar} 
                      position={[hangar.airports.lat, hangar.airports.lon]} 
                      icon={DefaultIcon}
                    >
                      <Popup>
                        <strong>{hangar.nom_hangar}</strong><br/>
                        {hangar.airports.name}
                      </Popup>
                    </Marker>
                  )
                ))}

                <RecenterMap coords={activeCoords} />
              </MapContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}