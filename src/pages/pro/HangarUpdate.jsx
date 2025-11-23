// src/pages/pro/HangarUpdate.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Assurez-vous que le chemin est correct

// =========================================================
// Composant Annexe: Éditeur de Relations pour les SERVICES (Simple Tag List)
// =========================================================
const RelationEditor = ({ title, options, currentIds, onUpdate, idKey, nameKey, junctionTable, hangarId }) => {
    const [selectedIds, setSelectedIds] = useState(currentIds);

    useEffect(() => {
        setSelectedIds(currentIds);
    }, [currentIds]);

    const handleToggle = (id) => {
        let newIds;
        if (selectedIds.includes(id)) {
            newIds = selectedIds.filter(item => item !== id);
        } else {
            newIds = [...selectedIds, id];
        }
        setSelectedIds(newIds);
        onUpdate(junctionTable, newIds);
    };

    if (!options || options.length === 0) return <p className="text-muted">Aucune option disponible.</p>;

    // Filtrer les options pour afficher UNIQUEMENT celles qui ne sont PAS déjà sélectionnées
    const availableOptions = options.filter(option => !selectedIds.includes(option[idKey]));

    // Afficher les options sélectionnées en premier
    const selectedOptions = options.filter(option => selectedIds.includes(option[idKey]));


    return (
        <div className="mb-4 p-4 border rounded-3 shadow-sm">
            <h4 className="mb-3" style={{ color: 'var(--color-primary, #1A237E)' }}>{title}</h4>
            
            {/* Tags Actuellement Sélectionnés (pour Suppression rapide) */}
            <div className="mb-3">
                <p className="fw-bold small mb-1">Services Actuellement Proposés :</p>
                <div className="d-flex flex-wrap gap-2">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((option) => (
                            <div 
                                key={option[idKey]} 
                                className="badge p-2 bg-success text-white"
                                onClick={() => handleToggle(option[idKey])}
                                style={{ cursor: 'pointer' }}
                            >
                                {option[nameKey]} ✖️
                            </div>
                        ))
                    ) : (
                        <p className="text-muted small">Aucun service sélectionné.</p>
                    )}
                </div>
            </div>

            {/* Tags Disponibles (pour Ajout) */}
            <p className="fw-bold small mb-1 mt-3">Services Disponibles :</p>
            <div className="d-flex flex-wrap gap-2">
                {availableOptions.map((option) => (
                    <div 
                        key={option[idKey]} 
                        className="badge p-2 bg-light text-dark border"
                        onClick={() => handleToggle(option[idKey])}
                        style={{ cursor: 'pointer' }}
                    >
                        {option[nameKey]} ➕
                    </div>
                ))}
            </div>
            
            <p className="mt-3 small text-muted">Cliquez sur un tag pour l'ajouter ou le retirer.</p>
        </div>
    );
};


// =========================================================
// NOUVEAU Composant: Éditeur d'Avions (avec Recherche/Filtre)
// =========================================================
const HangarAvionEditor = ({ title, options, currentIds, onUpdate, idKey, nameKey, junctionTable, hangarId }) => {
    const [selectedIds, setSelectedIds] = useState(currentIds);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOptionId, setSelectedOptionId] = useState('');

    useEffect(() => {
        setSelectedIds(currentIds);
        setSelectedOptionId(''); // Réinitialiser l'option sélectionnée lors du changement de hangar
    }, [currentIds]);

    // Filtrer la liste des options disponibles (qui ne sont pas déjà sélectionnées)
    const availableOptions = options.filter(option => 
        !selectedIds.includes(option[idKey]) && 
        option[nameKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Options sélectionnées pour l'affichage des tags
    const selectedOptions = options.filter(option => selectedIds.includes(option[idKey]));

    const handleAdd = () => {
        if (!selectedOptionId) return;
        
        // S'assurer que l'ID n'est pas déjà dans la liste
        if (!selectedIds.includes(parseInt(selectedOptionId))) {
            const newIds = [...selectedIds, parseInt(selectedOptionId)];
            setSelectedIds(newIds);
            onUpdate(junctionTable, newIds);
            setSearchTerm(''); // Réinitialiser la recherche
        }
    };

    const handleRemove = (id) => {
        const newIds = selectedIds.filter(item => item !== id);
        setSelectedIds(newIds);
        onUpdate(junctionTable, newIds);
    };

    return (
        <div className="mb-4 p-4 border rounded-3 shadow-sm">
            <h4 className="mb-3" style={{ color: 'var(--color-primary, #1A237E)' }}>{title}</h4>
            
            {/* Champ de Recherche et Ajout */}
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Rechercher par Modèle ou TC Holder..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedOptionId(''); // Désélectionner l'option lors de la saisie
                    }}
                />
                
                <select 
                    className="form-select" 
                    value={selectedOptionId}
                    onChange={(e) => setSelectedOptionId(e.target.value)}
                    style={{ maxWidth: '40%' }} // Limiter la largeur du select
                >
                    <option value="" disabled>{availableOptions.length > 0 ? 'Sélectionner un modèle...' : 'Aucun modèle trouvé...'}</option>
                    {availableOptions.slice(0, 50).map((option) => ( // Limiter l'affichage à 50
                        <option key={option[idKey]} value={option[idKey]}>
                            {option[nameKey]}
                        </option>
                    ))}
                </select>
                <button 
                    className="btn btn-success" 
                    type="button" 
                    onClick={handleAdd}
                    disabled={!selectedOptionId}
                >
                    Ajouter
                </button>
            </div>
            
            {/* Tags Actuellement Sélectionnés */}
            <p className="fw-bold small mb-1 mt-3">Modèles Supportés :</p>
            <div className="d-flex flex-wrap gap-2">
                {selectedOptions.length > 0 ? (
                    selectedOptions.map((option) => (
                        <div 
                            key={option[idKey]} 
                            className="badge p-2 bg-success text-white"
                            onClick={() => handleRemove(option[idKey])}
                            style={{ cursor: 'pointer' }}
                        >
                            {option[nameKey]} ✖️
                        </div>
                    ))
                ) : (
                    <p className="text-muted small">Aucun modèle d'avion sélectionné.</p>
                )}
            </div>
            
            <p className="mt-3 small text-muted">Utilisez la recherche pour ajouter un modèle. Cliquez sur un tag vert pour le retirer.</p>
        </div>
    );
};


// =========================================================
// Composant Principal: HangarUpdate
// =========================================================
export default function HangarUpdate() {
    // ... (Reste de votre composant HangarUpdate inchangé: useState, useEffect, handleSimpleFieldChange, handleSubmit, etc.)

    // --- MISE À JOUR DES DONNÉES SIMPLES DU FORMULAIRE ---
    const handleSimpleFieldChange = (e) => {
        setHangarData({ ...hangarData, [e.target.name]: e.target.value });
    };

    // --- MISE À JOUR DES RELATIONS MANY-TO-MANY (Ajout/Suppression) ---
    const handleRelationUpdate = async (junctionTable, newIds) => {
        if (!selectedHangarId) return;
        setUpdateStatus(`Mise à jour de ${junctionTable}...`);

        const key = junctionTable === 'hangar_avion' ? 'id_type' : 'id_service';

        try {
             // 1. Supprimer TOUS les anciens liens pour ce hangar
            const { error: deleteError } = await supabase
                .from(junctionTable)
                .delete()
                .eq('id_hangar', selectedHangarId);

            if (deleteError) throw deleteError;
            
            // 2. Insérer tous les nouveaux liens (s'il y en a)
            if (newIds.length > 0) {
                const newRelations = newIds.map(id => ({
                    id_hangar: selectedHangarId,
                    [key]: id
                }));
                const { error: insertError } = await supabase.from(junctionTable).insert(newRelations);
                if (insertError) throw insertError;
            }
            
            setUpdateStatus(`Mise à jour de ${junctionTable} réussie !`);
            
            // Mise à jour de l'état local pour refléter les changements
            setHangarData(prev => ({ 
                ...prev, 
                [junctionTable === 'hangar_avion' ? 'avion_ids' : 'service_ids']: newIds 
            }));

        } catch (error) {
            setUpdateStatus(`Erreur lors de la mise à jour: ${error.message}`);
            console.error(error);
        }
    };


    // --- ENREGISTREMENT DES CHAMPS SIMPLES ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatus('Sauvegarde des données du hangar...');

        const updatePayload = {
            nom_hangar: hangarData.nom_hangar, 
            numero_agrement: hangarData.numero_agrement,
            pays: hangarData.pays,
            ville: hangarData.ville,
            adresse_mail: hangarData.adresse_mail,
            adresse_mail1: hangarData.adresse_mail1,
            id_icao: hangarData.id_icao,
            date_maj: new Date().toISOString()
        };

        const { error } = await supabase
            .from('hangars')
            .update(updatePayload)
            .eq('id_hangar', selectedHangarId);

        if (error) {
            setUpdateStatus('Erreur de sauvegarde des données principales !');
            console.error(error);
        } else {
            setUpdateStatus('Données principales mises à jour avec succès !');
        }
    };


    // --- Chargements et Rendu ---
    const [hangars, setHangars] = useState([]);
    const [selectedHangarId, setSelectedHangarId] = useState(null);
    const [hangarData, setHangarData] = useState({});
    const [allAvionTypes, setAllAvionTypes] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState('');
    // (J'ai conservé le useEffect pour le chargement initial ici pour la complétude)
    // --- 1. CHARGEMENT INITIAL (Hangars, Types Avions, Services) ---
    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            
            try {
                // 1. Charger tous les hangars gérés (ID et Nom)
                const { data: hData, error: hError } = await supabase.from('hangars').select('id_hangar, nom_hangar');
                if (hError) throw hError;
                
                // 2. Charger tous les types d'avions disponibles
                const { data: tData, error: tError } = await supabase.from('type_avion').select('id_type, model_avion, tc_holder');
                if (tError) throw tError;
                
                // 3. Charger tous les services disponibles
                const { data: sData, error: sError } = await supabase.from('services').select('id_service, description');
                if (sError) throw sError;

                // On combine le Modèle et le TC Holder pour l'affichage de l'avion
                const mappedAvions = tData.map(t => ({ 
                    ...t, 
                    displayName: `${t.model_avion} (${t.tc_holder})` 
                }));

                setHangars(hData);
                setAllAvionTypes(mappedAvions);
                setAllServices(sData);

                // Sélectionner le premier hangar par défaut si existant
                if (hData.length > 0) {
                    setSelectedHangarId(hData[0].id_hangar);
                }
            } catch (error) {
                console.error("Erreur de chargement initial:", error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchInitialData();
    }, []);

    // (J'ai conservé le useEffect pour les détails du hangar ici pour la complétude)
    // --- 2. CHARGEMENT DES DÉTAILS DU HANGAR SÉLECTIONNÉ ---
    useEffect(() => {
        if (!selectedHangarId) return;

        async function fetchHangarDetails() {
            setLoading(true);
            
            try {
                // Détails du hangar (colonnes simples)
                const { data: dData, error: dError } = await supabase
                    .from('hangars')
                    .select('*')
                    .eq('id_hangar', selectedHangarId)
                    .single();
                if (dError) throw dError;

                // Modèles d'avions associés (Jonction hangar_avion)
                const { data: aData, error: aError } = await supabase
                    .from('hangar_avion')
                    .select('id_type')
                    .eq('id_hangar', selectedHangarId);
                if (aError) throw aError;
                
                // Services associés (Jonction hangar_service)
                const { data: sData, error: sError } = await supabase
                    .from('hangar_service')
                    .select('id_service')
                    .eq('id_hangar', selectedHangarId);
                if (sError) throw sError;
                
                setHangarData({
                    ...dData,
                    avion_ids: aData.map(item => item.id_type),
                    service_ids: sData.map(item => item.id_service),
                });
            } catch (error) {
                console.error("Erreur de chargement des détails du hangar:", error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchHangarDetails();
    }, [selectedHangarId]);


    if (loading && hangars.length === 0) return <p className="text-center mt-5">Chargement initial...</p>;
    if (hangars.length === 0) return <p className="text-center mt-5">Aucun hangar à gérer pour le moment.</p>;

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold" style={{ color: 'var(--color-primary, #1A237E)' }}>⚙️ Gestion du Hangar et des Services</h2>
            
            {updateStatus && 
                <div className={`alert ${updateStatus.includes('Erreur') ? 'alert-danger' : 'alert-success'} mb-4`}>
                    {updateStatus}
                </div>
            }

            {/* --- SÉLECTION DU HANGAR --- */}
            <div className="mb-5 p-4 border rounded-3 bg-light shadow-sm">
                <label htmlFor="selectHangar" className="form-label fw-bold">1. Sélectionnez le Hangar à Modifier</label>
                <select 
                    id="selectHangar" 
                    className="form-select"
                    value={selectedHangarId || ''}
                    onChange={(e) => {
                        setSelectedHangarId(parseInt(e.target.value));
                        setUpdateStatus('');
                    }}
                >
                    {hangars.map((hangar) => (
                        <option key={hangar.id_hangar} value={hangar.id_hangar}>
                            {hangar.nom_hangar}
                        </option>
                    ))}
                </select>
            </div>

            {selectedHangarId && !loading && (
                <>
                    {/* --- PARTIE 2 : CHAMPS DE DONNÉES SIMPLES --- */}
                    <form onSubmit={handleSubmit} className="mb-5 p-4 border rounded-3 shadow-md">
                        <h3 className="mb-4">2. Informations Générales du Hangar</h3>
                        
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Nom du Hangar</label>
                                <input type="text" className="form-control" name="nom_hangar" value={hangarData.nom_hangar || ''} onChange={handleSimpleFieldChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Numéro d'Agrément</label>
                                <input type="text" className="form-control" name="numero_agrement" value={hangarData.numero_agrement || ''} onChange={handleSimpleFieldChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Pays</label>
                                <input type="text" className="form-control" name="pays" value={hangarData.pays || ''} onChange={handleSimpleFieldChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Ville</label>
                                <input type="text" className="form-control" name="ville" value={hangarData.ville || ''} onChange={handleSimpleFieldChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Code ICAO</label>
                                <input type="text" className="form-control" name="id_icao" value={hangarData.id_icao || ''} onChange={handleSimpleFieldChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email Principal</label>
                                <input type="email" className="form-control" name="adresse_mail" value={hangarData.adresse_mail || ''} onChange={handleSimpleFieldChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email Secondaire</label>
                                <input type="email" className="form-control" name="adresse_mail1" value={hangarData.adresse_mail1 || ''} onChange={handleSimpleFieldChange} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-accent-pro mt-4">
                            Enregistrer les Informations Générales
                        </button>
                    </form>

                    {/* --- PARTIE 3 : GESTION DES RELATIONS (AVIONS) - UTILISE LA RECHERCHE --- */}
                    <div className="mb-5">
                        <HangarAvionEditor
                            title="3. Modèles d'Avions Supportés (Recherche et Ajout)"
                            options={allAvionTypes}
                            currentIds={hangarData.avion_ids || []}
                            onUpdate={handleRelationUpdate}
                            idKey="id_type"
                            nameKey="displayName"
                            junctionTable="hangar_avion"
                            hangarId={selectedHangarId}
                        />
                    </div>
                    
                    {/* --- PARTIE 4 : GESTION DES RELATIONS (SERVICES) - UTILISE LA LISTE SIMPLE --- */}
                    <div className="mb-5">
                        <RelationEditor
                            title="4. Services Proposés"
                            options={allServices}
                            currentIds={hangarData.service_ids || []}
                            onUpdate={handleRelationUpdate}
                            idKey="id_service"
                            nameKey="description"
                            junctionTable="hangar_service"
                            hangarId={selectedHangarId}
                        />
                    </div>
                </>
            )}
        </div>
    );
}