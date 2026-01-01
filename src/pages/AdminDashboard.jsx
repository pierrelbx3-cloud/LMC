import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
        if (p.role === 'pro') acc.pros++; // Compte les utilisateurs PRO
        if (p.role_status === 'pending') acc.pending++;
        if (p.role_status === 'approved') acc.approved++;
        return acc;
      }, { total: 0, pending: 0, approved: 0, pros: 0 }) || {};
      setStats(profileCounts);

      // 2. Données de jonction avec jointures (Hangars et Types d'avion)
      const { data: junctionData, error } = await supabase
        .from('hangar_avion')
        .select(`
          id_hangar,
          id_type,
          hangars ( pays ),
          type_avion ( model_avion )
        `);

      if (error) throw error;

      const countryMap = {};
      const aircraftMap = {};

      junctionData.forEach(item => {
        // Logique Pays
        const pays = item.hangars?.pays || 'Inconnu';
        if (!countryMap[pays]) countryMap[pays] = new Set();
        countryMap[pays].add(item.id_hangar);

        // Logique Avions
        const modele = item.type_avion?.model_avion || 'Inconnu';
        aircraftMap[modele] = (aircraftMap[modele] || 0) + 1;
      });

      // Formatage Tableaux
      const formattedCountries = Object.keys(countryMap).map(p => ({
        pays: p,
        count: countryMap[p].size
      })).sort((a, b) => b.count - a.count);

      const formattedAircraft = Object.keys(aircraftMap).map(m => ({
        modele: m,
        occurrence: aircraftMap[m]
      }))
      .sort((a, b) => b.occurrence - a.occurrence)
      .slice(0, 10);

      setHangarsByCountry(formattedCountries);
      setTopAircraft(formattedAircraft);

    } catch (err) {
      console.error("Erreur d'extraction:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-5 text-center">Chargement des données...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Tableau de Bord Admin</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchData}>🔄 Actualiser</button>
      </div>

      {/* --- CARTES DE STATS --- */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-secondary border-4">
            <h6 className="text-muted small text-uppercase">Total Comptes</h6>
            <h3 className="fw-bold mb-0">{stats.total}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-primary border-4">
            <h6 className="text-muted small text-uppercase">Utilisateurs PRO</h6>
            <h3 className="fw-bold mb-0 text-primary">{stats.pros}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-warning border-4">
            <h6 className="text-muted small text-uppercase">En Attente Approval</h6>
            <h3 className="fw-bold mb-0 text-warning">{stats.pending}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 bg-white border-start border-success border-4">
            <h6 className="text-muted small text-uppercase">Comptes Approuvés</h6>
            <h3 className="fw-bold mb-0 text-success">{stats.approved}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* --- TABLEAU PAYS --- */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">🌍 Hangars actifs par Pays</h5>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Pays</th>
                    <th className="text-center">Nb Hangars</th>
                  </tr>
                </thead>
                <tbody>
                  {hangarsByCountry.map((item, i) => (
                    <tr key={i}>
                      <td className="ps-4">{item.pays}</td>
                      <td className="text-center"><span className="badge bg-primary px-3">{item.count}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- TABLEAU TOP 10 AVIONS --- */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold">🏆 Top 10 Avions (Occurrences)</h5>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Modèle d'avion</th>
                    <th className="text-center">Nb Hangars</th>
                  </tr>
                </thead>
                <tbody>
                  {topAircraft.map((item, i) => (
                    <tr key={i}>
                      <td className="ps-4 fw-medium text-uppercase small">{item.modele}</td>
                      <td className="text-center">
                        <span className="fw-bold text-primary">{item.occurrence}</span>
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