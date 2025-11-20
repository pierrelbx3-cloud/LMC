// src/components/Button.jsx

import React from 'react';
import styles from './Button.module.css'; // ✅ Étape 1 : Importation du module

function Button({ children }) {
  return (
    // 🛑 VÉRIFIEZ ICI : Le nom de la classe doit être appliqué via l'objet 'styles'
    <button className={styles.primaryButton}> 
      {children}
    </button>
  );
}
// ...