import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, pros: 0 });
  const [hangarsByCountry, setHangarsByCountry] = useState([]);
  const [topAircraft, setTopAircraft] = useState([]);
  const [searchLogs, setSearchLogs] = useState([]); // <--- NOUVEAU STATE POUR LES LOGS
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

      // 2. Données de la table hangar_triple (Pays & Avions)
      const { data: junctionData, error: hangarError } = await supabase
        .from('hangar_triple')
        .select(`
          id_hangar,
          id_type,
          hangars ( pays ),
          type_avion ( model_avion )
        `);

      if (hangarError) throw hangarError;

      const countryMap = {}; 
      const aircraftMap = {}; 

      junctionData.forEach(item => {
        const pays = item.hangars?.pays || 'Inconnu';
        const modele = item.type_avion?.model_avion || 'Inconnu';
        const hangarId = item.id_hangar;

        if (!countryMap[pays]) countryMap[pays] = new Set();
        countryMap[pays].add(hangarId);

        if (!aircraftMap[modele]) aircraftMap[modele] = new Set();
        aircraftMap[modele].add(hangarId);
      });

      const formattedCountries = Object.keys(countryMap).map(p => ({
        pays: p,
        count: countryMap[p].size
      })).sort((a, b) => b.count - a.count);

      const formattedAircraft = Object.keys(aircraftMap).map(m => ({
        modele: m,
        occurrence: aircraftMap[m].size 
      }))
      .sort((a, b) => b.occurrence - a.occurrence)
      .slice(0, 10);

      setHangarsByCountry(formattedCountries);
      setTopAircraft(formattedAircraft);

      // 3. --- NOUVEAU : RECUPERATION DES LOGS DE RECHERCHE ---
      const { data: logsData, error: logsError } = await supabase
        .from('search_logs')
        .select('*')
        .order('created_at', { ascending: false }) // Du plus récent au plus ancien
        .limit(50); // On limite aux 50 derniers pour ne pas surcharger

      if (logsError) throw logsError;
      setSearchLogs(logsData || []);

    } catch (err) {
      console.error("Erreur d'extraction dashboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

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

      {/* --- SECTION 1 : CARTES DE STATS --- */}
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
            <h6 className="text-muted small text-uppercase fw-bold">En Attente</h6>
            <h3 className="fw-bold mb-0 text-warning">{stats.pending}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-success border-4" style={{borderRadius: '10px'}}>
            <h6 className="text-muted small text-uppercase fw-bold">Approuvés</h6>
            <h3 className="fw-bold mb-0 text-success">{stats.approved}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* --- SECTION 2 : PAYS --- */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100" style={{borderRadius: '15px', overflow: 'hidden'}}>
            <div className="card-header bg-white py-3 border-0">
              <h5 className="mb-0 fw-bold" style={{color: 'var(--color-primary)'}}>🌍 Capacité par Pays</h5>
            </div>
            <div className="card-body p-0" style={{maxHeight: '400px', overflowY: 'auto'}}>
              <table className="table table-hover mb-0">
                <thead className="table-light small text-uppercase sticky-top">
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

        {/* --- SECTION 3 : TOP AVIONS --- */}
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

      {/* --- SECTION 4 : HISTORIQUE DES RECHERCHES (NOUVEAU) --- */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0" style={{borderRadius: '15px', overflow: 'hidden'}}>
            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{color: 'var(--color-primary)'}}>🔎 Dernières Recherches (Logs)</h5>
              <span className="badge bg-light text-muted border">{searchLogs.length} entrées</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th className="ps-4">Date</th>
                    <th>Utilisateur</th>
                    <th>Modèle Avion</th>
                    <th>Phase</th>
                    <th>Type</th>
                    <th>Urgence</th>
                  </tr>
                </thead>
                <tbody>
                  {searchLogs.length > 0 ? (
                    searchLogs.map((log) => {
                      // Détection de la phase : Si service_type est null, c'est une simple vérification (Phase 1)
                      const isPhase2 = log.service_type && log.urgency_type;

                      return (
                        <tr key={log.id}>
                          <td className="ps-4 text-muted small">{formatDate(log.created_at)}</td>
                          
                          {/* Colonne Utilisateur */}
                          <td>
                            {log.user_id ? (
                              <span className="badge bg-info text-dark">Inscrit</span>
                            ) : (
                              <span className="badge bg-light text-muted border">Anonyme</span>
                            )}
                          </td>

                          {/* Colonne Avion */}
                          <td className="fw-bold" style={{color: 'var(--color-primary)'}}>
                            {log.model_name || <em className="text-muted">Non spécifié</em>}
                          </td>

                          {/* Colonne Phase (Calculée) */}
                          <td>
                            {isPhase2 ? (
                              <span className="badge bg-success bg-opacity-10 text-success border border-success">Recherche Complète</span>
                            ) : (
                              <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">Vérif. Dispo</span>
                            )}
                          </td>

                          {/* Colonne Type Maintenance */}
                          <td>
                             {log.service_type ? (
                               <span className="badge bg-white text-dark border shadow-sm">{log.service_type}</span>
                             ) : '-'}
                          </td>

                          {/* Colonne Urgence */}
                          <td>
                            {log.urgency_type === 'AOG' && <span className="badge bg-danger">AOG 🚨</span>}
                            {log.urgency_type === 'Planned' && <span className="badge bg-primary">Planifié 🗓️</span>}
                            {!log.urgency_type && '-'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Aucune recherche enregistrée pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}