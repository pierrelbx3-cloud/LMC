import React from 'react';

export default function Contact() {
  return (
    <div className="py-5 container">
      {/* Utilisation de la police Playfair via une classe personnalisée si définie, sinon fw-bold suffit */}
      <h1 className="text-center mb-5 fw-bold" style={{ color: 'var(--color-primary)', fontSize: '2.5rem' }}>
        Contactez-nous
      </h1>

      <div className="row justify-content-center">
        {/* --- Colonne Formulaire --- */}
        <div className="col-lg-6 mb-4">
          {/* Ajout de transition-hover pour la cohérence avec vos autres cartes */}
          <div className="card shadow border-0 p-4 transition-hover" style={{ backgroundColor: 'white' }}>
            <h3 className="mb-4" style={{ color: 'var(--color-primary)' }}>Envoyez-nous un message</h3>
            <form>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nom complet</label>
                <input type="text" className="form-control border-0 bg-light" placeholder="Votre nom" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Adresse Email</label>
                <input type="email" className="form-control border-0 bg-light" placeholder="nom@exemple.com" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Sujet</label>
                <select className="form-select border-0 bg-light">
                  <option>Demande d'information générale</option>
                  <option>Support technique</option>
                  <option>Partenariat Hangar</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Message</label>
                <textarea className="form-control border-0 bg-light" rows="4" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>
              {/* Application de votre bouton Terre Cuite (Accent) */}
              <button type="button" className="btn btn-accent-pro w-100 py-2 fw-bold shadow-sm">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>

        {/* --- Colonne Informations --- */}
        <div className="col-lg-4 offset-lg-1">
          <div className="mb-4">
            <h4 style={{ color: 'var(--color-primary)' }}>📍 Adresse</h4>
            <p className="text-muted">
            33 avenue de Wagram<br />
            75017 Paris, France
            </p>
          </div>

          <div className="mb-4">
            <h4 style={{ color: 'var(--color-primary)' }}>📧 Email</h4>
            {/* Utilisation de la couleur secondaire (Bleu Ciel) pour le lien email */}
            <p className="fw-bold" style={{ color: 'var(--color-accent)' }}>
              contact@let-me-check.com
            </p>
          </div>

          <div className="mb-4">
            <h4 style={{ color: 'var(--color-primary)' }}>📞 Téléphone</h4>
            <p className="text-muted">+33 1 23 45 67 89</p>
            <small className="text-muted">Du Lundi au Vendredi, 9h - 18h</small>
          </div>

          {/* Encart Support Urgent avec votre Bleu Nuit (Primary) */}
          <div className="p-4 rounded mt-4 shadow-sm" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <h5 className="fw-bold" style={{ color: 'var(--color-light-bg)' }}>Support Urgent ?</h5>
            <p className="mb-0 small opacity-75">
              Pour les urgences AOG (Aircraft on Ground), utilisez notre ligne dédiée disponible dans votre espace client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}