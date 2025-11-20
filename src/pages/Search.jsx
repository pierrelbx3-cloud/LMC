import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; 
// REMPLACÉ: Suppression de l'import 'lucide-react'

// --- NOMS DES TABLES SUPABASE ---
const MODEL_AVION_TABLE = 'type_avion'; 
const SERVICES_TABLE = 'services'; 
const HANGARS_TABLE = 'hangars'; 
const HANGAR_SERVICE_TABLE = 'hangar_service';
const HANGAR_AVION_TABLE = 'hangar_avion'; 

export default function SearchComponent() {
  // --- ÉTATS GÉRANT LA LOGIQUE ---
  const [searchPhase, setSearchPhase] = useState(1); // 1: Initial (Modèle), 2: Affinement (Service/Date)
  const [modelsRaw, setModelsRaw] = useState([]); 
  const [tcHolders, setTcHolders] = useState([]); 
  const [filteredModels, setFilteredModels] = useState([]); 
  const [services, setServices] = useState([]); 
  
  // --- ÉTATS GÉRANT LES INPUTS ---
  const [selectedTcHolder, setSelectedTcHolder] = useState(''); 
  const [selectedModel, setSelectedModel] = useState(''); 
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
   
  // --- ÉTATS GÉRANT LES RÉSULTATS ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]); 
  // baseHangarList stocke les résultats de la phase 1 pour pouvoir affiner sans re-requêter
  const [baseHangarList, setBaseHangarList] = useState([]); 

  // Fonction de réinitialisation pour revenir à la phase 1
  const handleReset = () => {
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


  // --- 1. CHARGEMENT INITIAL DES DONNÉES (Fabricants/Services) ---
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Charger Fabricants et Modèles
      const { data: avionData, error: avionError } = await supabase
        .from(MODEL_AVION_TABLE)
        .select('id_type, tc_holder, model_avion') 
        .order('tc_holder');
      
      if (avionError) throw new Error(`Erreur chargement Avions: ${avionError.message}`);
      setModelsRaw(avionData);
      
      // Extraire Fabricants uniques
      const uniqueTcHolderNames = [...new Set(avionData.map(item => item.tc_holder))];
      setTcHolders(uniqueTcHolderNames.map(name => ({ id: name, name: name })));

      // Charger Services
      const { data: serviceData, error: serviceError } = await supabase
        .from(SERVICES_TABLE)
        .select('id_service, description');
      
      if (serviceError) throw new Error(`Erreur chargement Services: ${serviceError.message}`);
      
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

  // --- 2. FILTRAGE DYNAMIQUE DES MODÈLES ---
  useEffect(() => {
    if (selectedTcHolder) {
      const rawFiltered = modelsRaw.filter(item => item.tc_holder === selectedTcHolder);
      const uniqueModelNames = [...new Set(rawFiltered.map(item => item.model_avion))]; 
      setFilteredModels(uniqueModelNames.map(name => ({ id: name, name: name })));
      setSelectedModel(''); 
    } else {
      setFilteredModels([]);
    }
  }, [selectedTcHolder, modelsRaw]);

  // --- 3. RECHERCHE DES HANGARS (LOGIQUE 2-PHASES) ---
  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    const typeAvionId = modelsRaw.find(m => m.model_avion === selectedModel && m.tc_holder === selectedTcHolder)?.id_type;
    
    if (!typeAvionId) {
        setError("Veuillez sélectionner un modèle d'avion valide.");
        setLoading(false);
        return;
    }

    // --- PHASE 1: RECHERCHE INITIALE PAR TYPE D'AVION ---
    if (searchPhase === 1) {
        setSearchResults([]);
        
        try {
            // Requête pour obtenir TOUS les hangars capables de maintenir ce type d'avion
            let query = supabase
                .from(HANGARS_TABLE)
                .select(`
                    id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail,
                    ${HANGAR_AVION_TABLE}!inner(id_type) 
                `)
                .eq(`${HANGAR_AVION_TABLE}.id_type`, typeAvionId)
                .limit(50); // Limite raisonnable pour la recherche initiale

            const { data, error } = await query;
            if (error) throw error;

            // Filtrer les doublons potentiels
            const uniqueResults = [];
            const map = new Map();
            for (const item of data) {
                if(!map.has(item.id_hangar)){
                    map.set(item.id_hangar, true);
                    uniqueResults.push(item);
                }
            }

            setBaseHangarList(uniqueResults); // Stocke la liste de base
            setSearchResults(uniqueResults); // Affiche les résultats
            setSearchPhase(2); // Passe à la phase d'affinement
            setError(null);

        } catch (err) {
            console.error("Erreur Phase 1:", err);
            setError("Erreur lors de la recherche initiale : " + err.message);
        } finally {
            setLoading(false);
        }
        return;
    }

    // --- PHASE 2: AFFINEMENT PAR SERVICE ET DATE ---
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
            // Requête pour filtrer par type d'avion ET service (plus restrictif)
            let query = supabase
                .from(HANGARS_TABLE)
                .select(`
                    id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail,
                    ${HANGAR_SERVICE_TABLE}!inner(id_service), 
                    ${HANGAR_AVION_TABLE}!inner(id_type)
                `)
                .eq(`${HANGAR_AVION_TABLE}.id_type`, typeAvionId)
                .eq(`${HANGAR_SERVICE_TABLE}.id_service`, serviceId)
                .limit(50); 

            const { data, error } = await query;
            if (error) throw error;
            
            // Filtrer les doublons potentiels
            const uniqueResults = [];
            const map = new Map();
            for (const item of data) {
                if(!map.has(item.id_hangar)){
                    map.set(item.id_hangar, true);
                    uniqueResults.push(item);
                }
                // Si la phase 2 est lancée, on vérifie que le hangar est dans la liste initiale (BaseHangarList)
                // Note: La requête Supabase gère déjà le filtre avion. La liste initiale n'est pas nécessaire pour le moment.
            }
            
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

  }, [searchPhase, selectedModel, selectedService, selectedDate, services, modelsRaw, selectedTcHolder]);

  // --- RENDU UI ---

  // Affichage des erreurs et du chargement
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
      
      {/* --- FORMULAIRE --- */}
      <div className="card shadow p-4 bg-light mb-5">
        <h3 className="h5 fw-bold mb-4">{currentPhaseTitle}</h3>
        <form onSubmit={handleSearch}>
          <div className="row g-3">
            
            {/* -------------------- PHASE 1: SÉLECTION AVION -------------------- */}
            <div className="col-md-4">
              <label className="form-label fw-bold">✈️ Fabricant</label>
              <select 
                className="form-select" 
                value={selectedTcHolder} 
                onChange={(e) => setSelectedTcHolder(e.target.value)} 
                disabled={searchPhase === 2}
                required
              >
                <option value="">Choisir...</option>
                {tcHolders.map(tc => <option key={tc.id} value={tc.id}>{tc.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">✈️ Modèle</label>
              <select 
                className="form-select" 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)} 
                disabled={!selectedTcHolder || searchPhase === 2} 
                required
              >
                <option value="">Choisir...</option>
                {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {/* -------------------- PHASE 2: AFFINEMENT (Affiché seulement en Phase 2) -------------------- */}
            {searchPhase === 2 && (
              <>
                <div className="col-md-4">
                  <label className="form-label fw-bold">🔧 Service Requis</label>
                  <select 
                    className="form-select" 
                    value={selectedService} 
                    onChange={(e) => setSelectedService(e.target.value)} 
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
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]} 
                    required 
                  />
                </div>
                <div className="col-md-4">
                    {/* Placeholder pour un filtre de localisation futur (Ville/Pays) */}
                    <label className="form-label fw-bold">📍 Emplacement</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: Paris (Optionnel)"
                    />
                </div>
              </>
            )}

            {/* -------------------- BOUTONS -------------------- */}
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

      {/* --- RÉSULTATS --- */}
      {searchPhase === 2 && searchResults.length > 0 ? (
        <div className="row g-4">
            <h3 className="mb-4">
                Hangars Disponibles : {searchResults.length} trouvé{searchResults.length > 1 ? 's' : ''} 
                <small className="text-muted fs-6 d-block mt-1">
                    {searchPhase === 1 
                      ? "Affiche tous les hangars pouvant entretenir ce modèle."
                      : `Affiche les hangars compatibles avec ${selectedModel} et offrant le service "${selectedService}".`}
                </small>
            </h3>
            
            {searchResults.map(hangar => (
                <div key={hangar.id_hangar} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-success transition-all duration-300 hover:shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title text-success fw-bold">{hangar.nom_hangar}</h5>
                            <p className="mb-1 text-muted small">
                                ✈️ Appareil : {selectedModel}
                            </p>
                            <p className="mb-2 text-primary small">
                                🔧 Service : {selectedService || "Tous Services"}
                            </p>
                            <p className="mb-1">📍 {hangar.ville}, {hangar.pays} (ICAO: {hangar.id_icao})</p>
                            
                            <div className="mt-3 pt-2 border-top">
                                {selectedDate ? (
                                    <button className="btn btn-success w-100 btn-sm">
                                        Réserver le {selectedDate}
                                    </button>
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
        searchPhase === 2 && !loading && <div className="alert alert-warning text-center">Aucun hangar trouvé pour ces critères d'affinement.</div>
      )}

      {/* Message initial en Phase 1 */}
      {searchPhase === 1 && !loading && (
          <div className="alert alert-info text-center">
              Veuillez choisir un fabricant et un modèle d'avion ci-dessus pour lancer la première étape de la recherche.
          </div>
      )}
    </div>
  );
}