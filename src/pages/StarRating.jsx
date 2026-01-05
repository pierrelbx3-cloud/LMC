import React from 'react';

/**
 * Composant StarRating
 * Affiche une notation de 0 à 5 étoiles (gère les demi-étoiles)
 * @param {number} rating - La note extraite de la colonne rating_admin
 */
export default function StarRating({ rating }) {
  // S'assurer que le rating est un nombre
  const value = parseFloat(rating) || 0;

  return (
    <div className="d-flex gap-1 align-items-center" title={`Note: ${value}/5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        // Logique d'affichage de l'étoile
        // Si la valeur est >= star (ex: 4 >= 4) -> Étoile pleine
        // Si la valeur est >= star - 0.5 (ex: 4.5 >= 4.5) -> Demi-étoile
        let icon = "★";
        let color = "#e4e5e9"; // Gris par défaut

        if (value >= star) {
          color = "#FFD700"; // Or plein
        } else if (value >= star - 0.5) {
          // Utilisation d'un dégradé ou d'un caractère spécifique pour la demi-étoile
          // Pour faire simple et propre en CSS pur :
          return (
            <span key={star} style={{ position: 'relative', fontSize: '1.2rem', color: '#e4e5e9' }}>
              <span style={{ 
                position: 'absolute', 
                overflow: 'hidden', 
                width: '50%', 
                color: '#FFD700' 
              }}>★</span>
              ★
            </span>
          );
        }

        return (
          <span
            key={star}
            style={{ 
              color: color,
              fontSize: '1.2rem',
              transition: 'color 0.2s ease'
            }}
          >
            {icon}
          </span>
        );
      })}
      
      {/* Affichage du texte de la note */}
      {value > 0 && (
        <span className="ms-2 small fw-bold" style={{ color: '#888', fontSize: '0.85rem' }}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}