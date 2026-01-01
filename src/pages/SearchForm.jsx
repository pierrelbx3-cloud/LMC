import React from 'react';

export default function SearchForm({
  searchPhase,
  selectedCategory, setSelectedCategory,
  selectedTcHolder, setSelectedTcHolder,
  selectedModel, setSelectedModel,
  selectedService, setSelectedService,
  selectedDate, setSelectedDate,
  productCategories, tcHolders, filteredModels, services,
  handleSearch, handleReset, loading, searchResults
}) {
  
  const stepStyle = (step) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: searchPhase === step ? 'var(--color-accent)' : 'var(--color-primary)',
    color: 'white',
    marginRight: '10px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  });

  return (
    <div className="card shadow-lg border-0 p-0 overflow-hidden mb-5" style={{ borderRadius: '15px' }}>
      <div className="p-4 border-bottom" style={{ backgroundColor: '#ffffff' }}>
        <div className="d-flex align-items-center">
          <div style={stepStyle(1)}>1</div>
          <div style={stepStyle(2)}>2</div>
          <h3 className="h5 fw-bold mb-0 ms-2" style={{ color: 'var(--color-primary)' }}>
            {searchPhase === 1 ? "Configuration de l'appareil" : "Détails de l'intervention"}
          </h3>
        </div>
      </div>

      <div className="card-body p-4" style={{ backgroundColor: 'var(--color-light-bg)' }}>
        <form onSubmit={handleSearch}>
          <div className="row g-4">
            {/* Phase 1 : Sélection Appareil */}
            <div className="col-md-4">
              <label className="form-label small fw-bold text-uppercase text-muted">📦 Catégorie</label>
              <select
                className={`form-select form-select-lg border-0 shadow-sm ${searchPhase === 2 ? 'opacity-75' : ''}`}
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                disabled={searchPhase === 2}
                required
              >
                <option value="">Sélectionner...</option>
                {productCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-uppercase text-muted">Constructeur</label>
              <select
                className={`form-select form-select-lg border-0 shadow-sm ${searchPhase === 2 ? 'opacity-75' : ''}`}
                value={selectedTcHolder}
                onChange={e => setSelectedTcHolder(e.target.value)}
                disabled={!selectedCategory || searchPhase === 2}
                required
              >
                <option value="">Sélectionner...</option>
                {tcHolders.map(tc => <option key={tc.id} value={tc.id}>{tc.name}</option>)}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-uppercase text-muted">Modèle</label>
              <select
                className={`form-select form-select-lg border-0 shadow-sm ${searchPhase === 2 ? 'opacity-75' : ''}`}
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                disabled={!selectedTcHolder || searchPhase === 2}
                required
              >
                <option value="">Sélectionner...</option>
                {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {/* Phase 2 : Simplifiée avec Boutons */}
            {searchPhase === 2 && (
              <div className="row g-4 mt-2 animate__animated animate__fadeIn">
                
                {/* Type de Maintenance via Boutons */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted d-block mb-3">🔧 Type de maintenance</label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-lg flex-grow-1 border-0 shadow-sm py-3 ${selectedService === 'Line Maintenance' ? 'btn-accent-pro text-white' : 'btn-white bg-white'}`}
                      onClick={() => setSelectedService('Line Maintenance')}
                    >
                      Line Maintenance
                    </button>
                    <button
                      type="button"
                      className={`btn btn-lg flex-grow-1 border-0 shadow-sm py-3 ${selectedService === 'Base Maintenance' ? 'btn-accent-pro text-white' : 'btn-white bg-white'}`}
                      onClick={() => setSelectedService('Base Maintenance')}
                    >
                      Base Maintenance
                    </button>
                  </div>
                </div>

                {/* Date via Boutons Simplifiés */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted d-block mb-3">📅 Urgence</label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-lg flex-grow-1 border-0 shadow-sm py-3 ${selectedDate === 'AOG' ? 'btn-danger text-white' : 'btn-white bg-white'}`}
                      onClick={() => setSelectedDate('AOG')}
                    >
                      Dès que possible
                    </button>
                    <button
                      type="button"
                      className={`btn btn-lg flex-grow-1 border-0 shadow-sm py-3 ${selectedDate === 'Planned' ? 'btn-accent-pro text-white' : 'btn-white bg-white'}`}
                      onClick={() => setSelectedDate('Planned')}
                    >
                      Planification
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="col-12 text-center mt-5 pt-4 border-top">
              <div className="d-flex justify-content-center align-items-center">
                <button 
                  type="submit" 
                  className="btn btn-accent-pro btn-lg px-5 py-3 rounded-pill shadow"
                  disabled={loading || (searchPhase === 2 && (!selectedService || !selectedDate))}
                  style={{ minWidth: '280px' }}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : '🔍 '}
                  {searchPhase === 1 
                    ? `Voir les ${searchResults.length} ateliers` 
                    : 'Lancer la recherche'}
                </button>

                {searchPhase === 2 && (
                  <button 
                    type="button" 
                    onClick={handleReset} 
                    className="btn btn-link text-decoration-none text-muted ms-3"
                  >
                    🔄 Retour
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}