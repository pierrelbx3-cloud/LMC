import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

// --- NOMS DES TABLES SUPABASE ---
const MODEL_AVION_TABLE = 'type_avion';
const SERVICES_TABLE = 'services';
const HANGARS_TABLE = 'hangars';
const HANGAR_SERVICE_TABLE = 'hangar_service';
const HANGAR_AVION_TABLE = 'hangar_avion';

export default function SearchComponent() {
  // --- ÉTATS GÉRANT LA LOGIQUE ---
  const [searchPhase, setSearchPhase] = useState(1);
  const [modelsRaw, setModelsRaw] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [tcHolders, setTcHolders] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [services, setServices] = useState([]);

  // --- ÉTATS GÉRANT LES INPUTS ---
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTcHolder, setSelectedTcHolder] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // --- ÉTATS GÉRANT LES RÉSULTATS ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [baseHangarList, setBaseHangarList] = useState([]);

  // --- Réinitialisation ---
  const handleReset = () => {
    setSelectedCategory('');
    setSelectedTcHolder('');
    setSelectedModel('');
    setSelectedService('');
    setSelectedDate('');
    setSearchResults([]);
    setBaseHangarList([]);
    setSearchPhase(1);
    setError(null);
    setLoading(false);
  };

  // --- 1. CHARGEMENT INITIAL DES DONNÉES ---
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Charger toutes les lignes de type_avion
      const { data: avionData, error: avionError } = await supabase
        .from(MODEL_AVION_TABLE)
        .select('id_type, product_category, tc_holder, model_avion');
      if (avionError) throw avionError;
      setModelsRaw(avionData);

      // Extraire les product_categories uniques
      const uniqueCategories = [...new Set(avionData.map(a => a.product_category))].filter(Boolean);
      setProductCategories(uniqueCategories.map(c => ({ id: c, name: c })));

      // Charger Services
      const { data: serviceData, error: serviceError } = await supabase
        .from(SERVICES_TABLE)
        .select('id_service, description');
      if (serviceError) throw serviceError;

      setServices(serviceData.map(s => ({ id: s.id_service, name: s.description })));

    } catch (err) {
      console.error("Erreur init:", err);
      setError("Erreur de chargement initial : " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // --- 2. FILTRAGE DYNAMIQUE DES TC HOLDERS ---
  useEffect(() => {
    if (selectedCategory) {
      const filtered = modelsRaw.filter(m => m.product_category === selectedCategory);
      const uniqueTc = [...new Set(filtered.map(m => m.tc_holder))].filter(Boolean);
      setTcHolders(uniqueTc.map(tc => ({ id: tc, name: tc })));
      setSelectedTcHolder('');
      setFilteredModels([]);
      setSelectedModel('');
    } else {
      setTcHolders([]);
      setFilteredModels([]);
      setSelectedTcHolder('');
      setSelectedModel('');
    }
  }, [selectedCategory, modelsRaw]);

  // --- 3. FILTRAGE DYNAMIQUE DES MODELS ---
  useEffect(() => {
    if (selectedCategory && selectedTcHolder) {
      const filtered = modelsRaw.filter(
        m => m.product_category === selectedCategory && m.tc_holder === selectedTcHolder
      );
      const uniqueModels = [...new Set(filtered.map(m => m.model_avion))].filter(Boolean);
      setFilteredModels(uniqueModels.map(m => ({ id: m, name: m })));
      setSelectedModel('');
    } else {
      setFilteredModels([]);
      setSelectedModel('');
    }
  }, [selectedCategory, selectedTcHolder, modelsRaw]);

  // --- 4. RECHERCHE DES HANGARS ---
  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    const typeAvionId = modelsRaw.find(
      m => m.model_avion === selectedModel &&
           m.tc_holder === selectedTcHolder &&
           m.product_category === selectedCategory
    )?.id_type;

    if (!typeAvionId) {
      setError("Veuillez sélectionner un modèle d'avion valide.");
      setLoading(false);
      return;
    }

    // PHASE 1
    if (searchPhase === 1) {
      try {
        const { data, error } = await supabase
          .from(HANGARS_TABLE)
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail,
            ${HANGAR_AVION_TABLE}!inner(id_type)
          `)
          .eq(`${HANGAR_AVION_TABLE}.id_type`, typeAvionId)
          .limit(50);
        if (error) throw error;

        const uniqueResults = [];
        const map = new Map();
        data.forEach(item => {
          if (!map.has(item.id_hangar)) {
            map.set(item.id_hangar, true);
            uniqueResults.push(item);
          }
        });

        setBaseHangarList(uniqueResults);
        setSearchResults(uniqueResults);
        setSearchPhase(2);
        setError(null);
      } catch (err) {
        console.error("Erreur Phase 1:", err);
        setError("Erreur lors de la recherche initiale : " + err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // PHASE 2
    if (searchPhase === 2) {
      if (!selectedService || !selectedDate) {
        setLoading(false);
        return;
      }

      const serviceId = services.find(s => s.name === selectedService)?.id;
      if (!serviceId) {
        setError("Service sélectionné invalide.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from(HANGARS_TABLE)
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail,
            ${HANGAR_SERVICE_TABLE}!inner(id_service),
            ${HANGAR_AVION_TABLE}!inner(id_type)
          `)
          .eq(`${HANGAR_AVION_TABLE}.id_type`, typeAvionId)
          .eq(`${HANGAR_SERVICE_TABLE}.id_service`, serviceId)
          .limit(50);
        if (error) throw error;

        const uniqueResults = [];
        const map = new Map();
        data.forEach(item => {
          if (!map.has(item.id_hangar)) {
            map.set(item.id_hangar, true);
            uniqueResults.push(item);
          }
        });

        setSearchResults(uniqueResults);
        setError(null);
      } catch (err) {
        console.error("Erreur Phase 2:", err);
        setError("Erreur lors de l'affinement de la recherche : " + err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

  }, [searchPhase, selectedCategory, selectedTcHolder, selectedModel, selectedService, selectedDate, services, modelsRaw]);

  // --- RENDU UI ---
  if (error) return <div className="alert alert-danger m-5">{error}</div>;
  if (loading && !selectedDate) return <div className="text-center m-5"><div className="spinner-border text-primary"></div></div>;

  const currentPhaseTitle = searchPhase === 1
    ? "1. Sélectionner votre Appareil"
    : "2. Affiner par Service et Disponibilité";

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4 text-center">
        Trouver un Créneau de Maintenance
        <span className="badge bg-secondary ms-3">Phase {searchPhase}</span>
      </h1>

      {/* FORMULAIRE */}
      <div className="card shadow p-4 bg-light mb-5">
        <h3 className="h5 fw-bold mb-4">{currentPhaseTitle}</h3>
        <form onSubmit={handleSearch}>
          <div className="row g-3">
            {/* Product Category */}
            <div className="col-md-4">
              <label className="form-label fw-bold">📦 Product Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                disabled={searchPhase === 2}
                required
              >
                <option value="">Choisir...</option>
                {productCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* TC Holder */}
            <div className="col-md-4">
              <label className="form-label fw-bold">✈️ TC Holder</label>
              <select
                className="form-select"
                value={selectedTcHolder}
                onChange={e => setSelectedTcHolder(e.target.value)}
                disabled={!selectedCategory || searchPhase === 2}
                required
              >
                <option value="">Choisir...</option>
                {tcHolders.map(tc => <option key={tc.id} value={tc.id}>{tc.name}</option>)}
              </select>
            </div>

            {/* Model Avion */}
            <div className="col-md-4">
              <label className="form-label fw-bold">✈️ Modèle</label>
              <select
                className="form-select"
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                disabled={!selectedTcHolder || searchPhase === 2}
                required
              >
                <option value="">Choisir...</option>
                {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {/* PHASE 2 */}
            {searchPhase === 2 && (
              <>
                <div className="col-md-4">
                  <label className="form-label fw-bold">🔧 Service Requis</label>
                  <select
                    className="form-select"
                    value={selectedService}
                    onChange={e => setSelectedService(e.target.value)}
                    required
                  >
                    <option value="">Choisir...</option>
                    {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">📅 Date Souhaitée</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">📍 Emplacement</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Paris (Optionnel)"
                  />
                </div>
              </>
            )}

            {/* BOUTONS */}
            <div className="col-12 text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-5"
                disabled={
                  loading ||
                  (searchPhase === 1 && !selectedModel) ||
                  (searchPhase === 2 && (!selectedService || !selectedDate))
                }
              >
                🔎
                {loading
                  ? ' Recherche...'
                  : searchPhase === 1
                    ? ` 1/2. Trouver ${searchResults.length > 0 ? searchResults.length : ''} Hangars Compatibles`
                    : ' 2/2. Affiner la Recherche'}
              </button>
              {searchPhase === 2 && (
                <button type="button" onClick={handleReset} className="btn btn-link ms-3 text-danger">
                  Nouvelle Recherche (Réinitialiser)
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* RÉSULTATS */}
      {searchPhase === 2 && searchResults.length > 0 ? (
        <div className="row g-4">
          <h3 className="mb-4">
            Hangars Disponibles : {searchResults.length} trouvé{searchResults.length > 1 ? 's' : ''}
            <small className="text-muted fs-6 d-block mt-1">
              {`Affiche les hangars compatibles avec ${selectedModel} et offrant le service "${selectedService}".`}
            </small>
          </h3>

          {searchResults.map(hangar => (
            <div key={hangar.id_hangar} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-success transition-all duration-300 hover:shadow-lg">
                <div className="card-body">
                  <h5 className="card-title text-success fw-bold">{hangar.nom_hangar}</h5>
                  <p className="mb-1 text-muted small">✈️ Appareil : {selectedModel}</p>
                  <p className="mb-2 text-primary small">🔧 Service : {selectedService || "Tous Services"}</p>
                  <p className="mb-1">📍 {hangar.ville}, {hangar.pays} (ICAO: {hangar.id_icao})</p>
                  <div className="mt-3 pt-2 border-top">
                    {selectedDate ? (
                      <button className="btn btn-success w-100 btn-sm">Réserver le {selectedDate}</button>
                    ) : (
                      <span className="text-warning small d-block text-center">
                        Entrez une date pour finaliser la réservation
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        searchPhase === 2 && !loading && (
          <div className="alert alert-warning text-center">Aucun hangar trouvé pour ces critères d'affinement.</div>
        )
      )}

      {/* Message initial Phase 1 */}
      {searchPhase === 1 && !loading && (
        <div className="alert alert-info text-center">
          Veuillez choisir une catégorie, un fabricant et un modèle d'avion ci-dessus pour lancer la première étape de la recherche.
        </div>
      )}
    </div>
  );
}
