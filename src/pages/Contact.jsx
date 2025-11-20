import React from 'react';

export default function Contact() {
  return (
    <div className="py-4">
      <h1 className="text-center mb-5 fw-bold">Contactez-nous</h1>

      <div className="row justify-content-center">
        {/* --- Colonne Formulaire --- */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0 p-4 bg-light">
            <h3 className="mb-4">Envoyez-nous un message</h3>
            <form>
              <div className="mb-3">
                <label className="form-label">Nom complet</label>
                <input type="text" className="form-control" placeholder="Votre nom" />
              </div>
              <div className="mb-3">
                <label className="form-label">Adresse Email</label>
                <input type="email" className="form-control" placeholder="nom@exemple.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Sujet</label>
                <select className="form-select">
                  <option>Demande d'information générale</option>
                  <option>Support technique</option>
                  <option>Partenariat Hangar</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows="4" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>
              <button type="button" className="btn btn-primary w-100">Envoyer le message</button>
            </form>
          </div>
        </div>

        {/* --- Colonne Informations --- */}
        <div className="col-lg-4 offset-lg-1">
          <div className="mb-4">
            <h4>📍 Adresse</h4>
            <p className="text-muted">
              Aéroport de Toussus-le-Noble<br />
              Batiment 24<br />
              78117 Toussus-le-Noble, France
            </p>
          </div>

          <div className="mb-4">
            <h4>📧 Email</h4>
            <p className="text-primary fw-bold">contact@aeromaintenance.com</p>
          </div>

          <div className="mb-4">
            <h4>📞 Téléphone</h4>
            <p className="text-muted">+33 1 23 45 67 89</p>
            <small className="text-muted">Du Lundi au Vendredi, 9h - 18h</small>
          </div>

          <div className="p-4 bg-primary text-white rounded mt-4">
            <h5>Support Urgent ?</h5>
            <p className="mb-0 small">Pour les urgences AOG (Aircraft on Ground), utilisez notre ligne dédiée disponible dans votre espace client.</p>
          </div>
        </div>
      </div>
    </div>
  );
}