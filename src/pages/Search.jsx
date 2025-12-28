import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Import indispensable pour handleSearch
import { useSearchData } from './useSearchData';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

export default function SearchComponent() {
  // États de sélection
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTcHolder, setSelectedTcHolder] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // États de gestion de recherche
  const [searchPhase, setSearchPhase] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // ON PASSE LES SÉLECTIONS AU HOOK pour qu'il filtre tcHolders et filteredModels
  const {
    modelsRaw, 
    productCategories, 
    tcHolders, 
    filteredModels, 
    services, 
    loading: dataLoading, 
    error 
  } = useSearchData(selectedCategory, selectedTcHolder); // <--- Passage des dépendances ici

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedTcHolder('');
    setSelectedModel('');
    setSelectedService('');
    setSelectedDate('');
    setSearchResults([]);
    setSearchPhase(1);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLocalLoading(true);

    // 1. Trouver l'ID technique (UUID) du type d'avion
    const typeAvionId = modelsRaw.find(
      m => m.model_avion === selectedModel &&
           m.tc_holder === selectedTcHolder &&
           m.product_category === selectedCategory
    )?.id_type;

    if (!typeAvionId) {
      alert("Erreur : Modèle d'avion introuvable.");
      setLocalLoading(false);
      return;
    }

    try {
      if (searchPhase === 1) {
        // --- PHASE 1 : HANGARS COMPATIBLES AVION ---
        const { data, error: err } = await supabase
          .from('hangars')
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail,
            hangar_avion!inner(id_type)
          `)
          .eq('hangar_avion.id_type', typeAvionId);

        if (err) throw err;

        // Optionnel : Récupération des coordonnées ICAO si nécessaire ici
        setSearchResults(data);
        setSearchPhase(2);
      } else {
        // --- PHASE 2 : AFFINER PAR SERVICE ---
        const serviceObj = services.find(s => s.name === selectedService);
        
        const { data, error: err } = await supabase
          .from('hangars')
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail,
            hangar_service!inner(id_service),
            hangar_avion!inner(id_type)
          `)
          .eq('hangar_avion.id_type', typeAvionId)
          .eq('hangar_service.id_service', serviceObj.id);

        if (err) throw err;
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="container py-5">
      {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
      
      <SearchForm
        searchPhase={searchPhase}
        selectedCategory={selectedCategory} 
        setSelectedCategory={(val) => { setSelectedCategory(val); setSelectedTcHolder(''); setSelectedModel(''); }}
        selectedTcHolder={selectedTcHolder} 
        setSelectedTcHolder={(val) => { setSelectedTcHolder(val); setSelectedModel(''); }}
        selectedModel={selectedModel} 
        setSelectedModel={setSelectedModel}
        selectedService={selectedService} 
        setSelectedService={setSelectedService}
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate}
        productCategories={productCategories}
        tcHolders={tcHolders}
        filteredModels={filteredModels}
        services={services}
        handleSearch={handleSearch}
        handleReset={handleReset}
        loading={dataLoading || localLoading}
        searchResults={searchResults}
      />

      <SearchResults
        searchPhase={searchPhase}
        searchResults={searchResults}
        selectedModel={selectedModel}
        selectedService={selectedService}
        selectedDate={selectedDate}
        mapboxToken={mapboxToken}
      />
    </div>
  );
}