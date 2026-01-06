import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; 
import { useSearchData } from './useSearchData';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import ResultDetailModal from './ResultDetailModal'; 
import QuoteRequestModal from './QuoteRequestModal'; 

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

  // --- ÉTATS POUR LES MODALES ---
  const [showModal, setShowModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedHangar, setSelectedHangar] = useState(null);

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
    setShowModal(false);
    setShowQuoteModal(false);
  };

  const handleOpenModal = (hangar) => {
    setSelectedHangar(hangar);
    setShowModal(true);
  };

  const handleOpenQuoteRequest = () => {
    setShowModal(false); 
    setShowQuoteModal(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLocalLoading(true);

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
      let finalData = [];

      // Si un service est sélectionné, on passe directement en logique Phase 2, peu importe l'état précédent
      const isServiceSearch = selectedService !== '' || searchPhase === 2;

      if (!isServiceSearch) {
        // --- PHASE 1 : Recherche par Type Avion uniquement ---
        // CORRECTION ICI : Retrait des majuscules et guillemets pour adresse, zip_code, phone
        const { data, error: err } = await supabase
          .from('hangars')
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail, adresse_mail1,
            adresse, zip_code, phone, rating_admin,
            hangar_triple!inner(id_type, maintenance_type),
            airports (lat, lon, name) 
          `)
          .eq('hangar_triple.id_type', typeAvionId);

        if (err) throw err;
        finalData = data;
        setSearchPhase(2); // On prépare la prochaine étape

      } else {
        // --- PHASE 2 : Filtre supplémentaire par Service ---
        const serviceObj = services.find(s => s.name === selectedService);
        
        // Sécurité : si le service n'est pas trouvé (bug UI), on évite de planter la requête
        const serviceId = serviceObj ? serviceObj.id : null;

        let query = supabase
          .from('hangars')
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail, adresse_mail1,
            adresse, zip_code, phone, rating_admin,
            hangar_service!inner(id_service),
            hangar_triple!inner(id_type, maintenance_type),
            airports (lat, lon, name)
          `)
          .eq('hangar_triple.id_type', typeAvionId);

        // On n'applique le filtre service que si on a un ID valide
        if (serviceId) {
            query = query.eq('hangar_service.id_service', serviceId);
        }

        const { data, error: err } = await query;

        if (err) throw err;
        finalData = data;
      }

      setSearchResults(finalData);

      // --- LOGS DE RECHERCHE ---
      await supabase.from('search_logs').insert([{
        category: selectedCategory,
        tc_holder: selectedTcHolder,
        model_avion: selectedModel,
        service_requested: selectedService || 'Initial Search',
        results_count: finalData ? finalData.length : 0
      }]);

    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      alert("Une erreur est survenue lors de la récupération des données.");
    } finally {
      setLocalLoading(false);
    }
  };

  const currentTypeId = modelsRaw.find(m => m.model_avion === selectedModel)?.id_type;

  return (
    <div className="container-fluid py-5 px-lg-5">
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
        onViewDetail={handleOpenModal}
      />

      <ResultDetailModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        hangar={selectedHangar}
        selectedTypeId={currentTypeId}
        onQuoteRequest={handleOpenQuoteRequest} 
      />

      <QuoteRequestModal 
        show={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        hangar={selectedHangar}
        selectedModel={selectedModel}
      />
    </div>
  );
}