import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Vérifie ton chemin d'import
import { useTranslation } from 'react-i18next';

/**
 * Réutilisation de ton composant StarRating pour la cohérence
 */
const StarRating = ({ rating }) => {
  const value = parseFloat(rating) || 0;
  return (
    <div className="d-flex justify-content-center gap-1 align-items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        if (value >= star) return <span key={star} style={{ color: '#FFD700', fontSize: '1.2rem' }}>★</span>;
        else if (value >= star - 0.5) return <span key={star} style={{ color: '#FFD700', fontSize: '1.2rem' }}>★</span>; // Simplifié pour l'affichage tableau
        return <span key={star} style={{ color: '#e4e5e9', fontSize: '1.2rem' }}>★</span>;
      })}
      {value > 0 && <span className="ms-1 fw-bold text-muted small">({value})</span>}
    </div>
  );
};

export default function ComparisonModal({ show, onClose, items, selectedTypeId }) {
  const { t } = useTranslation();
  const [details, setDetails] = useState({ item1: [], item2: [] });
  const [loading, setLoading] = useState(false);

  // On s'assure d'avoir 2 slots
  const h1 = items[0];
  const h2 = items[1] || null;

  useEffect(() => {
    if (show && items.length > 0 && selectedTypeId) {
      fetchBothDetails();
    }
  }, [show, items, selectedTypeId]);

  // Fonction pour récupérer les infos techniques (Agréments) des deux hangars en parallèle
  const fetchBothDetails = async () => {
    setLoading(true);
    try {
      const fetchAgreements = async (hangarId) => {
        if (!hangarId) return [];
        const { data, error } = await supabase
          .from('hangar_triple')
          .select(`
            maintenance_type,
            agreement (
              numero_agrement,
              authorities (
                name,
                country,
                parent_authority
              )
            )
          `)
          .eq('id_hangar', hangarId)
          .eq('id_type', selectedTypeId); // On filtre par le type d'avion recherché
        
        if (error) throw error;
        return data || [];
      };

      // Exécution parallèle pour la performance
      const [res1, res2] = await Promise.all([
        fetchAgreements(h1?.id_hangar),
        h2 ? fetchAgreements(h2?.id_hangar) : Promise.resolve([])
      ]);

      setDetails({ item1: res1, item2: res2 });

    } catch (err) {
      console.error("Erreur chargement comparateur:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!show || items.length === 0) return null;

  // Helpers pour extraire les données uniques (évite les doublons d'affichage)
  const getAuthorities = (dataList) => {
    if (!dataList || dataList.length === 0) return "-";
    // On map pour récupérer les noms d'autorités uniques
    const auths = [...new Set(dataList.map(d => d.agreement?.authorities?.name).filter(Boolean))];
    return auths.join(', ');
  };

  const getCountries = (dataList) => {
    if (!dataList || dataList.length === 0) return "-";
    const countries = [...new Set(dataList.map(d => d.agreement?.authorities?.country).filter(Boolean))];
    return countries.map((c, i) => <span key={i} className="badge bg-light text-dark border me-1">{c}</span>);
  };

  return (
    <>
      {/* Backdrop similaire à ta modale existante */}
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose} 
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1040 }}
      ></div>

      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-xl modal-dialog-centered px-3">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            
            {/* HEADER */}
            <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
              <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                <i className="bi bi-arrow-left-right me-2"></i> 
                {t('comparison.title', 'Comparateur Technique')}
              </h3>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <div className="modal-body p-0" style={{ backgroundColor: 'var(--color-light-bg)' }}>
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 text-center align-middle">
                  <thead className="bg-white border-bottom">
                    <tr>
                      <th className="w-25 py-4 text-uppercase text-muted small">Critères</th>
                      {/* HANGAR 1 */}
                      <th className="w-37 py-4">
                        <h5 className="fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>{h1.nom_hangar}</h5>
                        <div className="small text-muted">{h1.ville}</div>
                      </th>
                      {/* HANGAR 2 */}
                      <th className="w-37 py-4 border-start">
                        {h2 ? (
                          <>
                            <h5 className="fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>{h2.nom_hangar}</h5>
                            <div className="small text-muted">{h2.ville}</div>
                          </>
                        ) : (
                          <span className="text-muted fst-italic">Vide</span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {/* 1. LOCALISATION (Donnée statique) */}
                    <tr>
                      <td className="fw-bold text-start ps-4 text-muted small text-uppercase">Pays / Zone</td>
                      <td className="fw-medium">{h1.pays}</td>
                      <td className="fw-medium border-start">{h2?.pays || '-'}</td>
                    </tr>

                    {/* 2. NOTE ADMIN (Donnée statique) */}
                    <tr>
                      <td className="fw-bold text-start ps-4 text-muted small text-uppercase">Note Admin</td>
                      <td><StarRating rating={h1.rating_admin} /></td>
                      <td className="border-start">{h2 ? <StarRating rating={h2.rating_admin} /> : '-'}</td>
                    </tr>

                    {/* 3. AGRÉMENT PAYS (Donnée fetchée) */}
                    <tr>
                      <td className="fw-bold text-start ps-4 text-muted small text-uppercase">Pays d'agrément</td>
                      <td>
                        {loading ? <div className="spinner-border spinner-border-sm text-primary"></div> : getCountries(details.item1)}
                      </td>
                      <td className="border-start">
                         {loading ? (h2 && <div className="spinner-border spinner-border-sm text-primary"></div>) : getCountries(details.item2)}
                      </td>
                    </tr>

                    {/* 4. AUTORITÉ PARENTE (Donnée fetchée) */}
                    <tr>
                      <td className="fw-bold text-start ps-4 text-muted small text-uppercase">Autorités (EASA/FAA...)</td>
                      <td className="small">
                        {loading ? '...' : getAuthorities(details.item1)}
                      </td>
                      <td className="small border-start">
                        {loading ? '...' : getAuthorities(details.item2)}
                      </td>
                    </tr>

                    {/* 5. ACTIONS */}
                    <tr className="bg-white">
                      <td className="text-start ps-4"></td>
                      <td className="py-4">
                        <button className="btn btn-accent-pro text-white rounded-pill px-4 shadow-sm btn-sm">
                          Demander Devis
                        </button>
                      </td>
                      <td className="py-4 border-start">
                        {h2 && (
                           <button className="btn btn-accent-pro text-white rounded-pill px-4 shadow-sm btn-sm">
                             Demander Devis
                           </button>
                        )}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}