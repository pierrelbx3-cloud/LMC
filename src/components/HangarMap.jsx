import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Correction d'un bug connu : les icônes Leaflet ne s'affichent pas bien avec Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function HangarMap({ lat, lon, name }) {
  // Coordonnées par défaut (ex: centre de la France) si lat/lon sont absents
  const position = [lat || 46.6033, lon || 1.8883];

  return (
    <div style={{ height: '180px', width: '100%', overflow: 'hidden' }}>
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Désactivé pour les petites cartes de résultats
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={DefaultIcon}>
          {name && <Popup>{name}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}