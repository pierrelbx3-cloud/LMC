import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; 
import { useSearchData } from './useSearchData';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import ResultDetailModal from './ResultDetailModal'; 
// IMPORT DU NOUVEAU COMPOSANT FORMULAIRE
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

  // Ouverture de la modal de détails
  const handleOpenModal = (hangar) => {
    setSelectedHangar(hangar);
    setShowModal(true);
  };

  // Transition : Ferme les détails et ouvre le formulaire de devis
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
      if (searchPhase === 1) {
        const { data, error: err } = await supabase
          .from('hangars')
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail, adresse_mail1,
            Adresse, Zip_code, Phone,
            hangar_triple!inner(id_type),
            airports (lat, lon, name) 
          `)
          .eq('hangar_triple.id_type', typeAvionId);

        if (err) throw err;
        setSearchResults(data);
        setSearchPhase(2);

      } else {
        const serviceObj = services.find(s => s.name === selectedService);
        
        const { data, error: err } = await supabase
          .from('hangars')
          .select(`
            id_hangar, nom_hangar, pays, ville, id_icao, adresse_mail, adresse_mail1,
            Adresse, Zip_code, Phone,
            hangar_service!inner(id_service),
            hangar_triple!inner(id_type),
            airports (lat, lon, name)
          `)
          .eq('hangar_triple.id_type', typeAvionId)
          .eq('hangar_service.id_service', serviceObj?.id);

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

  // Extraction de l'ID type pour la modal
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

      {/* MODAL 1 : DÉTAILS DU HANGAR ET AGRÉMENTS */}
      <ResultDetailModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        hangar={selectedHangar}
        selectedTypeId={currentTypeId}
        onQuoteRequest={handleOpenQuoteRequest} // La fonction de bascule
      />

      {/* MODAL 2 : FORMULAIRE DE DEVIS (GOOGLE SHEETS) */}
      <QuoteRequestModal 
        show={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        hangar={selectedHangar}
        selectedModel={selectedModel}
      />
    </div>
  );
}