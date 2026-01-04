import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, pros: 0 });
  const [hangarsByCountry, setHangarsByCountry] = useState([]);
  const [topAircraft, setTopAircraft] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Stats Profils (Rôles et Status)
      const { data: profiles } = await supabase.from('profiles').select('role, role_status');
      const profileCounts = profiles?.reduce((acc, p) => {
        acc.total++;
        if (p.role === 'pro') acc.pros++;
        if (p.role_status === 'pending') acc.pending++;
        if (p.role_status === 'approved') acc.approved++;
        return acc;
      }, { total: 0, pending: 0, approved: 0, pros: 0 }) || {};
      setStats(profileCounts);

      // 2. Données de la nouvelle table hangar_triple
      // On récupère les pays via les hangars et les modèles via type_avion
      const { data: junctionData, error } = await supabase
        .from('hangar_triple')
        .select(`
          id_hangar,
          id_type,
          hangars ( pays ),
          type_avion ( model_avion )
        `);

      if (error) throw error;

      const countryMap = {}; // Pour compter les hangars uniques par pays
      const aircraftMap = {}; // Pour compter les hangars uniques par modèle d'avion

      junctionData.forEach(item => {
        const pays = item.hangars?.pays || 'Inconnu';
        const modele = item.type_avion?.model_avion || 'Inconnu';
        const hangarId = item.id_hangar;

        // Logique Pays : On stocke les IDs de hangars dans un Set pour garantir l'unicité
        if (!countryMap[pays]) countryMap[pays] = new Set();
        countryMap[pays].add(hangarId);

        // Logique Avions : Un hangar peut avoir plusieurs agréments/maintenances pour 1 avion.
        // On ne veut compter l'avion qu'une fois par hangar.
        if (!aircraftMap[modele]) aircraftMap[modele] = new Set();
        aircraftMap[modele].add(hangarId);
      });

      // Formatage pour l'affichage (Conversion des Sets en nombres)
      const formattedCountries = Object.keys(countryMap).map(p => ({
        pays: p,
        count: countryMap[p].size
      })).sort((a, b) => b.count - a.count);

      const formattedAircraft = Object.keys(aircraftMap).map(m => ({
        modele: m,
        occurrence: aircraftMap[m].size // Nombre de hangars uniques possédant ce modèle
      }))
      .sort((a, b) => b.occurrence - a.occurrence)
      .slice(0, 10);

      setHangarsByCountry(formattedCountries);
      setTopAircraft(formattedAircraft);

    } catch (err) {
      console.error("Erreur d'extraction dashboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
      <div className="spinner-border" style={{color: 'var(--color-accent)'}} role="status"></div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{color: 'var(--color-primary)'}}>Tableau de Bord Admin</h2>
        <button className="btn btn-accent-pro btn-sm text-white rounded-pill px-3" onClick={fetchData}>
          🔄 Actualiser
        </button>
      </div>

      {/* --- CARTES DE STATS --- */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-secondary border-4" style={{borderRadius: '10px'}}>
            <h6 className="text-muted small text-uppercase fw-bold">Total Comptes</h6>
            <h3 className="fw-bold mb-0">{stats.total}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-primary border-4" style={{borderRadius: '10px'}}>
            <h6 className="text-muted small text-uppercase fw-bold">Utilisateurs PRO</h6>
            <h3 className="fw-bold mb-0" style={{color: 'var(--color-primary)'}}>{stats.pros}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-warning border-4" style={{borderRadius: '10px'}}>
            <h6 className="text-muted small text-uppercase fw-bold">En Attente Approval</h6>
            <h3 className="fw-bold mb-0 text-warning">{stats.pending}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-success border-4" style={{borderRadius: '10px'}}>
            <h6 className="text-muted small text-uppercase fw-bold">Comptes Approuvés</h6>
            <h3 className="fw-bold mb-0 text-success">{stats.approved}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* --- TABLEAU PAYS --- */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100" style={{borderRadius: '15px', overflow: 'hidden'}}>
            <div className="card-header bg-white py-3 border-0">
              <h5 className="mb-0 fw-bold" style={{color: 'var(--color-primary)'}}>🌍 Capacité par Pays</h5>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th className="ps-4">Pays</th>
                    <th className="text-center">Nb Ateliers</th>
                  </tr>
                </thead>
                <tbody>
                  {hangarsByCountry.map((item, i) => (
                    <tr key={i} className="align-middle">
                      <td className="ps-4 fw-medium">{item.pays}</td>
                      <td className="text-center">
                        <span className="badge rounded-pill px-3 py-2" style={{backgroundColor: 'var(--color-primary)'}}>
                          {item.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- TABLEAU TOP 10 AVIONS --- */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100" style={{borderRadius: '15px', overflow: 'hidden'}}>
            <div className="card-header py-3 border-0" style={{backgroundColor: 'var(--color-primary)'}}>
              <h5 className="mb-0 fw-bold text-white">🏆 Top 10 Modèles Supportés</h5>
            </div>
            <div className="card-body p-0 bg-white">
              <table className="table table-hover mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th className="ps-4">Modèle d'avion</th>
                    <th className="text-center">Nb Ateliers</th>
                  </tr>
                </thead>
                <tbody>
                  {topAircraft.map((item, i) => (
                    <tr key={i} className="align-middle">
                      <td className="ps-4 fw-bold text-uppercase small" style={{color: '#444'}}>{item.modele}</td>
                      <td className="text-center">
                        <span className="fw-bold" style={{color: 'var(--color-accent)'}}>{item.occurrence}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}