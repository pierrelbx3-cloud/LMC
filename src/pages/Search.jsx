import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; 
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

  // Hook pour récupérer les données de filtrage
  const {
    modelsRaw, 
    productCategories, 
    tcHolders, 
    filteredModels, 
    services, 
    loading: dataLoading, 
    error 
  } = useSearchData(selectedCategory, selectedTcHolder);

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
        // --- PHASE 1 : HANGARS COMPATIBLES AVION + COORDONNÉES GPS ---
        const { data, error: err } = await supabase
          .from('hangars')
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail,
            hangar_avion!inner(id_type),
            airports (lat, lon, name) 
          `) // Jointure cruciale pour Leaflet
          .eq('hangar_avion.id_type', typeAvionId);

        if (err) throw err;
        setSearchResults(data);
        setSearchPhase(2);

      } else {
        // --- PHASE 2 : AFFINER PAR SERVICE + COORDONNÉES GPS ---
        const serviceObj = services.find(s => s.name === selectedService);
        
        const { data, error: err } = await supabase
          .from('hangars')
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail,
            hangar_service!inner(id_service),
            hangar_avion!inner(id_type),
            airports (lat, lon, name)
          `) // Jointure cruciale pour Leaflet
          .eq('hangar_avion.id_type', typeAvionId)
          .eq('hangar_service.id_service', serviceObj.id);

        if (err) throw err;
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      alert("Une erreur est survenue lors de la récupération des données.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 px-lg-5">
      {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
      
      {/* Formulaire de recherche */}
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

      {/* Affichage des résultats avec le nouveau Layout Split-Screen */}
      <SearchResults
        searchPhase={searchPhase}
        searchResults={searchResults}
        selectedModel={selectedModel}
        selectedService={selectedService}
        selectedDate={selectedDate}
      />
    </div>
  );
}