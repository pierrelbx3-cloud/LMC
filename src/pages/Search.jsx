import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; 
import { useSearchData } from './useSearchData';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import ResultDetailModal from './ResultDetailModal'; 
import QuoteRequestModal from './QuoteRequestModal'; 
import ComparisonModal from './ComparisonModal'; // <--- NOUVEL IMPORT

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

  // --- ÉTATS POUR LE COMPARATEUR (NOUVEAU) ---
  const [compareList, setCompareList] = useState([]); 
  const [showCompareModal, setShowCompareModal] = useState(false);

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
    // Reset du comparateur
    setCompareList([]); // <--- NOUVEAU
    setShowCompareModal(false); // <--- NOUVEAU
  };

  const handleOpenModal = (hangar) => {
    setSelectedHangar(hangar);
    setShowModal(true);
  };

  const handleOpenQuoteRequest = () => {
    setShowModal(false); 
    setShowQuoteModal(true);
  };

  // --- LOGIQUE D'AJOUT/RETRAIT DU COMPARATEUR (NOUVEAU) ---
  const handleToggleCompare = (hangar) => {
    setCompareList((prev) => {
      // On vérifie par id_hangar (selon ton schéma DB)
      const exists = prev.find((p) => p.id_hangar === hangar.id_hangar);
      
      if (exists) {
        // Si déjà présent, on l'enlève
        return prev.filter((p) => p.id_hangar !== hangar.id_hangar);
      } else {
        // Si pas présent, on ajoute (Max 2)
        if (prev.length < 2) {
          return [...prev, hangar];
        } else {
          alert("Vous ne pouvez comparer que 2 résultats à la fois.");
          return prev;
        }
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setCompareList([]); // <--- On vide le comparateur à chaque nouvelle recherche

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
      const isServiceSearch = selectedService !== '' || searchPhase === 2;

      if (!isServiceSearch) {
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
        setSearchPhase(2);

      } else {
        const serviceObj = services.find(s => s.name === selectedService);
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

        if (serviceId) {
            query = query.eq('hangar_service.id_service', serviceId);
        }

        const { data, error: err } = await query;

        if (err) throw err;
        finalData = data;
      }

      setSearchResults(finalData);

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
    <div className="container-fluid py-5 px-lg-5 position-relative"> {/* Ajout position-relative */}
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

      {/* --- MODIFICATION ICI : PASSAGE DES PROPS DE COMPARAISON --- */}
      <SearchResults
        searchPhase={searchPhase}
        searchResults={searchResults}
        selectedModel={selectedModel}
        selectedService={selectedService}
        selectedDate={selectedDate}
        onViewDetail={handleOpenModal}
        // NOUVEAU :
        onToggleCompare={handleToggleCompare}
        compareList={compareList}
      />

      {/* --- BOUTON FLOTTANT (Apparaît si sélection > 0) --- */}
      {compareList.length > 0 && (
         <div className="position-fixed bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 1060 }}>
            <button 
              className="btn btn-accent-pro text-white rounded-pill px-4 py-2 shadow-lg animate__animated animate__fadeInUp"
              onClick={() => setShowCompareModal(true)}
              disabled={compareList.length < 2} // Optionnel : désactiver tant qu'on a pas 2 items
            >
              <i className="bi bi-arrow-left-right me-2"></i>
              Comparateur ({compareList.length}/2)
            </button>
         </div>
      )}

      {/* --- MODALES --- */}
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

      {/* NOUVEAU : LA MODALE DE COMPARAISON */}
      <ComparisonModal 
        show={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        items={compareList}
        selectedTypeId={currentTypeId}
      />
    </div>
  );
}