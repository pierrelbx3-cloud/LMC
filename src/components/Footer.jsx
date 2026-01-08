import React from 'react';
import { useTranslation } from 'react-i18next'; // <--- IMPORT

export default function Footer() {
  const { t } = useTranslation(); // <--- HOOK
  const currentYear = new Date().getFullYear(); // Année dynamique

  return (
    <footer className="custom-footer-style text-white text-center py-3 mt-auto">
      <div className="container">
        {/* On passe la variable year à la traduction */}
        <p className="mb-0 small">
          {t('footer.copyright', { year: currentYear })}
        </p>
      </div>
    </footer>
  );
}