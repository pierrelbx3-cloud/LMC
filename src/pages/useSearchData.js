import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const MODEL_AVION_TABLE = 'type_avion';
const SERVICES_TABLE = 'services';

export function useSearchData(selectedCategory, selectedTcHolder) {
  const [modelsRaw, setModelsRaw] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [tcHolders, setTcHolders] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Chargement initial des données brutes
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: avionData, error: avionError } = await supabase
        .from(MODEL_AVION_TABLE)
        .select('id_type, product_category, tc_holder, model_avion');
      if (avionError) throw avionError;
      
      setModelsRaw(avionData);

      // Extraire les catégories uniques pour le premier menu
      const uniqueCategories = [...new Set(avionData.map(a => a.product_category))].filter(Boolean);
      setProductCategories(uniqueCategories.map(c => ({ id: c, name: c })));

      const { data: serviceData, error: serviceError } = await supabase
        .from(SERVICES_TABLE)
        .select('id_service, description');
      if (serviceError) throw serviceError;
      
      setServices(serviceData.map(s => ({ id: s.id_service, name: s.description })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // 2. LOGIQUE DE FILTRAGE : TC Holders (dépend de la catégorie)
  useEffect(() => {
    if (selectedCategory) {
      const filtered = modelsRaw.filter(m => m.product_category === selectedCategory);
      const uniqueTc = [...new Set(filtered.map(m => m.tc_holder))].filter(Boolean);
      setTcHolders(uniqueTc.map(tc => ({ id: tc, name: tc })));
    } else {
      setTcHolders([]);
    }
  }, [selectedCategory, modelsRaw]);

  // 3. LOGIQUE DE FILTRAGE : Modèles (dépend du constructeur)
  useEffect(() => {
    if (selectedCategory && selectedTcHolder) {
      const filtered = modelsRaw.filter(
        m => m.product_category === selectedCategory && m.tc_holder === selectedTcHolder
      );
      const uniqueModels = [...new Set(filtered.map(m => m.model_avion))].filter(Boolean);
      setFilteredModels(uniqueModels.map(m => ({ id: m, name: m })));
    } else {
      setFilteredModels([]);
    }
  }, [selectedCategory, selectedTcHolder, modelsRaw]);

  return {
    modelsRaw,
    productCategories,
    tcHolders,
    filteredModels,
    services,
    loading,
    error,
  };
}