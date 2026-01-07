import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function FaqSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null); // ID de la question ouverte
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [categories, setCategories] = useState(['Tous']);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      // Récupérer les items visibles triés par ordre
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setItems(data);

      // Extraire les catégories uniques dynamiquement
      const uniqueCats = ['Tous', ...new Set(data.map(item => item.category))];
      setCategories(uniqueCats);
    } catch (err) {
      console.error("Erreur FAQ:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les items affichés
  const filteredItems = selectedCategory === 'Tous' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  if (loading) return <div className="text-center py-5">Chargement...</div>;

  return (
    <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>Questions Fréquentes</h2>
          <p className="text-muted">Tout ce que vous devez savoir sur nos services.</p>
        </div>

        {/* Filtres par Catégorie */}
        <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm rounded-pill px-3 fw-bold transition-all`}
              style={{
                backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'white',
                color: selectedCategory === cat ? 'white' : 'var(--color-primary)',
                border: '1px solid var(--color-primary)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Liste Accordéon */}
        <div className="d-flex flex-column gap-3">
          {filteredItems.map((item) => {
            const isOpen = activeId === item.id;
            return (
              <div 
                key={item.id} 
                className="card border-0 shadow-sm overflow-hidden" 
                style={{ borderRadius: '12px', transition: 'all 0.3s ease' }}
              >
                {/* Question (Clickable) */}
                <div 
                  className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleAccordion(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h6 className="mb-0 fw-bold" style={{ color: isOpen ? 'var(--color-accent)' : '#333' }}>
                    {item.question}
                  </h6>
                  <span 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.3s',
                      fontSize: '1.2rem',
                      color: 'var(--color-primary)'
                    }}
                  >
                    ▼
                  </span>
                </div>

                {/* Réponse (Animation CSS simple via max-height) */}
                <div 
                  style={{ 
                    maxHeight: isOpen ? '500px' : '0', 
                    overflow: 'hidden', 
                    transition: 'max-height 0.4s ease-in-out',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div className="card-body px-4 pb-4 pt-0 text-muted" style={{ lineHeight: '1.6' }}>
                    <div className="border-top pt-3">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center text-muted py-5">
            Aucune question dans cette catégorie.
          </div>
        )}

      </div>
    </section>
  );
}