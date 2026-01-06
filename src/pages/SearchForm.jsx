import React, { useState, useEffect, useRef } from 'react';

export default function SearchForm({
  searchPhase,
  selectedCategory, setSelectedCategory,
  selectedTcHolder, setSelectedTcHolder,
  selectedModel, setSelectedModel,
  selectedService, setSelectedService,
  selectedDate, setSelectedDate,
  productCategories, tcHolders, 
  filteredModels, // Modèles filtrés par les sélecteurs
  allModels,      // <-- LA LISTE COMPLÈTE (à passer depuis le parent)
  handleSearch, handleReset, loading
}) {
  
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Sync du texte si le modèle change
  useEffect(() => {
    if (!selectedModel) setModelSearchTerm("");
    else setModelSearchTerm(selectedModel);
  }, [selectedModel]);

  // Fermeture des suggestions au clic extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * LOGIQUE DE RECHERCHE DIRECTE (CORRIGÉE)
   * Si l'utilisateur tape sans avoir choisi de filtres, on cherche dans allModels.
   */
  const dataToSearch = (allModels && allModels.length > 0) ? allModels : filteredModels;
  
  const suggestions = (dataToSearch || []).filter(m => {
    const term = modelSearchTerm.toLowerCase().trim();
    return term.length >= 2 && m.name.toLowerCase().includes(term);
  }).slice(0, 8);

  const selectModel = (model) => {
    setSelectedModel(model.name);
    setModelSearchTerm(model.name);
    setShowSuggestions(false);
    // On essaye de pré-remplir les filtres si la donnée est présente
    if (model.id_category) setSelectedCategory(model.id_category);
  };

  const stepStyle = (step) => ({
    width: '28px', height: '28px', borderRadius: '50%',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: searchPhase >= step ? 'var(--color-accent)' : 'var(--color-primary)',
    color: 'white', marginRight: '10px', fontSize: '0.85rem', fontWeight: 'bold'
  });

  return (
    <div className="card shadow-lg border-0 p-0 overflow-hidden mb-4 mx-auto" style={{ borderRadius: '18px', maxWidth: '900px' }}>
      
      {/* HEADER AVEC RAPPEL MODÈLE */}
      <div className="p-3 border-bottom bg-white">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <div style={stepStyle(1)}>1</div>
            <div style={stepStyle(2)}>2</div>
            <h3 className="h6 fw-bold mb-0 ms-1" style={{ color: 'var(--color-primary)' }}>
              {searchPhase === 1 ? "Configuration" : "Intervention"}
            </h3>
          </div>
          {selectedModel && (
            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}>
              ✈️ {selectedModel}
            </span>
          )}
        </div>
      </div>

      <div className="card-body p-3 p-md-4" style={{ backgroundColor: 'var(--color-light-bg)' }}>
        <form onSubmit={handleSearch}>
          <div className="row g-3">
            
            {searchPhase === 1 && (
              <>
                {/* --- 1. RECHERCHE TEXTE (DIRECTE) --- */}
                <div className="col-12" ref={wrapperRef} style={{ position: 'relative' }}>
                  <label className="form-label tiny-label fw-bold text-muted mb-1">🚀 RECHERCHE DIRECTE</label>
                  <div className="input-group shadow-sm rounded-3 overflow-hidden">
                    <span className="input-group-text bg-white border-0 py-2">🔍</span>
                    <input
                      type="text"
                      className="form-control border-0 py-2 shadow-none"
                      placeholder="Tapez le nom de l'avion (ex: A320)..."
                      value={modelSearchTerm}
                      onChange={(e) => { setModelSearchTerm(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      autoComplete="off"
                    />
                    {modelSearchTerm && (
                      <button className="btn bg-white border-0 py-0" type="button" onClick={() => {setSelectedModel(""); setModelSearchTerm("");}}>✕</button>
                    )}
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="list-group shadow-lg position-absolute w-100" 
                         style={{ top: '100%', left: 0, zIndex: 1060, marginTop: '5px', borderRadius: '10px', overflow: 'hidden' }}>
                      {suggestions.map(m => (
                        <button key={m.id} type="button" className="list-group-item list-group-item-action py-2 fw-bold border-0 text-start" onClick={() => selectModel(m)}>
                          ✈️ {m.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-12 text-center py-1">
                   <small className="text-muted fw-bold" style={{ fontSize: '0.65rem', opacity: 0.5 }}>OU PARCOURS GUIDÉ</small>
                </div>

                {/* --- 2. FILTRES CLASSIQUES --- */}
                <div className="col-md-4">
                  <label className="form-label tiny-label fw-bold text-muted">CATÉGORIE</label>
                  <select className="form-select border-0 shadow-sm py-2 small" value={selectedCategory} onChange={e => {setSelectedCategory(e.target.value); setSelectedTcHolder(""); setSelectedModel("");}}>
                    <option value="">Toutes</option>
                    {productCategories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label tiny-label fw-bold text-muted">CONSTRUCTEUR</label>
                  <select className="form-select border-0 shadow-sm py-2 small" value={selectedTcHolder} onChange={e => {setSelectedTcHolder(e.target.value); setSelectedModel("");}} disabled={!selectedCategory}>
                    <option value="">Tous</option>
                    {tcHolders?.map(tc => <option key={tc.id} value={tc.id}>{tc.name}</option>)}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label tiny-label fw-bold text-muted">MODÈLE</label>
                  <select className="form-select border-0 shadow-sm py-2 small" value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={!selectedTcHolder}>
                    <option value="">Sélectionner...</option>
                    {filteredModels?.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
              </>
            )}

            {/* --- PHASE 2 : INTERVENTION --- */}
            {searchPhase === 2 && (
              <div className="row g-3 mt-1 animate__animated animate__fadeIn">
                <div className="col-md-6">
                  <label className="form-label tiny-label fw-bold text-muted mb-2 text-center d-block">🔧 PRESTATION</label>
                  <div className="row g-2">
                    {[{id:'Line',n:'Line',i:'🛠️'},{id:'Base',n:'Base',i:'🏢'}].map(item => (
                      <div className="col-6" key={item.id}>
                        <button type="button" 
                          className={`btn w-100 py-2 border-0 shadow-sm rounded-3 d-flex flex-column align-items-center transition-all ${selectedService === item.id ? 'btn-accent-pro text-white shadow' : 'bg-white'}`}
                          onClick={() => setSelectedService(item.id)}>
                          <span style={{ fontSize: '1.2rem' }}>{item.i}</span><span className="small fw-bold">{item.n}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label tiny-label fw-bold text-muted mb-2 text-center d-block">🚨 URGENCE</label>
                  <div className="row g-2">
                    {[{id:'AOG',n:'AOG',i:'🚨'},{id:'Planned',n:'Planifié',i:'🗓️'}].map(item => (
                      <div className="col-6" key={item.id}>
                        <button key={item.id} type="button" 
                          className={`btn w-100 py-2 border-0 shadow-sm rounded-3 d-flex flex-column align-items-center transition-all ${selectedDate === item.id ? (item.id==='AOG'?'btn-danger text-white shadow':'btn-accent-pro text-white shadow') : 'bg-white'}`}
                          onClick={() => setSelectedDate(item.id)}>
                          <span style={{ fontSize: '1.2rem' }}>{item.i}</span><span className="small fw-bold">{item.n}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER ACTION */}
            <div className="col-12 text-center mt-4 pt-3 border-top">
              <div className="d-flex flex-column align-items-center gap-2">
                <button type="submit" className="btn btn-accent-pro px-5 py-2 fw-bold rounded-pill shadow" 
                  disabled={loading || (searchPhase === 1 && !selectedModel) || (searchPhase === 2 && (!selectedService || !selectedDate))}
                  style={{ minWidth: '240px' }}>
                  {loading ? "..." : (searchPhase === 1 ? 'VÉRIFIER DISPONIBILITÉ' : 'RECHERCHER')}
                </button>
                
                {/* BOUTON RÉINITIALISER BIEN VISIBLE */}
                <button type="button" onClick={handleReset} className="btn btn-link text-muted p-0 text-decoration-none small" style={{ fontSize: '0.8rem' }}>
                  🔄 Recommencer / Changer d'avion
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <style>{`
        .tiny-label { font-size: 0.65rem; letter-spacing: 0.5px; text-transform: uppercase; }
        .list-group-item:hover { background-color: #f8f9fa; color: var(--color-accent) !important; cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
}