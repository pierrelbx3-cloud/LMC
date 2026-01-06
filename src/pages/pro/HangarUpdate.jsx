import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// =========================================================
// COMPOSANT 1 : Services (Gestion simple par badges)
// =========================================================
const RelationEditor = ({ title, options, currentIds, onUpdate, idKey, nameKey, junctionTable }) => {
    const [selectedIds, setSelectedIds] = useState(currentIds);

    useEffect(() => {
        setSelectedIds(currentIds);
    }, [currentIds]);

    const handleToggle = (id) => {
        const newIds = selectedIds.includes(id)
            ? selectedIds.filter(item => item !== id)
            : [...selectedIds, id];

        setSelectedIds(newIds);
        onUpdate(junctionTable, newIds);
    };

    const selectedOptions = options.filter(option => selectedIds.includes(option[idKey]));
    const availableOptions = options.filter(option => !selectedIds.includes(option[idKey]));

    return (
        <div className="mb-4 p-4 border rounded-3 shadow-sm bg-white">
            <h4 className="mb-3">{title}</h4>
            <p className="fw-bold small mb-1">Services sélectionnés :</p>
            <div className="d-flex flex-wrap gap-2 mb-3">
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(option => (
                        <div key={option[idKey]} className="badge bg-success p-2 text-white" onClick={() => handleToggle(option[idKey])} style={{ cursor: 'pointer' }}>
                            {option[nameKey]} ✖️
                        </div>
                    ))
                ) : <p className="text-muted small">Aucun service sélectionné.</p>}
            </div>
            <p className="fw-bold small mb-1">Services disponibles :</p>
            <div className="d-flex flex-wrap gap-2">
                {availableOptions.map(option => (
                    <div key={option[idKey]} className="badge p-2 bg-light border text-dark" onClick={() => handleToggle(option[idKey])} style={{ cursor: 'pointer' }}>
                        {option[nameKey]} ➕
                    </div>
                ))}
            </div>
        </div>
    );
};

// =========================================================
// COMPOSANT 2 : Éditeur Triple (Avion + Agrément + Maintenance)
// =========================================================
const HangarTripleEditor = ({ title, avionOptions, agreementOptions, currentTriples, onUpdate }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTCHolder, setSelectedTCHolder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModelIds, setSelectedModelIds] = useState([]);
    const [selectedAgreementId, setSelectedAgreementId] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('Base');

    // Effet pour sélectionner automatiquement l'agrément s'il n'y en a qu'un seul lié au hangar
    useEffect(() => {
        if (agreementOptions.length === 1) {
            setSelectedAgreementId(agreementOptions[0].id_agreement);
        } else {
            setSelectedAgreementId('');
        }
    }, [agreementOptions]);

    const uniqueCategories = [...new Set(avionOptions.map(o => o.product_category))].sort();
    const uniqueTCHolders = [...new Set(avionOptions.filter(o => !selectedCategory || o.product_category === selectedCategory).map(o => o.tc_holder))].sort();
    
    const filteredModels = avionOptions.filter(o => {
        const matchesSearch = o.model_avion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTC = !selectedTCHolder || o.tc_holder === selectedTCHolder;
        const matchesCat = !selectedCategory || o.product_category === selectedCategory;
        return matchesSearch && matchesTC && matchesCat;
    });

    const handleAdd = () => {
        if (selectedModelIds.length === 0 || !selectedAgreementId) return;
        
        const newTriples = [...currentTriples];
        let addedCount = 0;

        selectedModelIds.forEach(modelId => {
            const exists = newTriples.find(t => t.id_type === parseInt(modelId) && t.id_agreement === parseInt(selectedAgreementId));
            if (!exists) {
                newTriples.push({
                    id_type: parseInt(modelId),
                    id_agreement: parseInt(selectedAgreementId),
                    maintenance_type: maintenanceType
                });
                addedCount++;
            }
        });

        if (addedCount > 0) {
            onUpdate('hangar_triple', newTriples);
            setSelectedModelIds([]);
            setSearchTerm('');
        }
    };

    const handleRemove = (index) => {
        const newTriples = currentTriples.filter((_, i) => i !== index);
        onUpdate('hangar_triple', newTriples);
    };

    return (
        <div className="mb-4 p-4 border rounded-3 shadow-sm bg-white">
            <h4 className="mb-3">{title}</h4>
            
            <div className="bg-light p-3 rounded mb-4 border-start border-primary border-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">1. Agrément lié au portefeuille du hangar</label>
                        <select className="form-select border-primary" value={selectedAgreementId} onChange={e => setSelectedAgreementId(e.target.value)}>
                            <option value="">-- Sélectionner parmi vos agréments --</option>
                            {agreementOptions.map(a => <option key={a.id_agreement} value={a.id_agreement}>{a.displayName}</option>)}
                        </select>
                        {agreementOptions.length === 0 && <small className="text-danger">Attention : Aucun agrément n'est lié à ce hangar dans la page FullEdit.</small>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">2. Type de Maintenance</label>
                        <select className="form-select border-primary" value={maintenanceType} onChange={e => setMaintenanceType(e.target.value)}>
                            <option value="Base">Base Maintenance</option>
                            <option value="Line">Line Maintenance</option>
                            <option value="Base & Line">Base & Line</option>
                        </select>
                    </div>

                    <hr className="my-2" />

                    <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Recherche rapide (ex: A320)..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={selectedCategory} onChange={e => {setSelectedCategory(e.target.value); setSelectedTCHolder('');}}>
                            <option value="">-- Toutes Catégories --</option>
                            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={selectedTCHolder} onChange={e => setSelectedTCHolder(e.target.value)}>
                            <option value="">-- Tous Constructeurs --</option>
                            {uniqueTCHolders.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="col-md-9">
                        <label className="form-label small text-muted">Sélectionnez un ou plusieurs modèles (Ctrl+Clic) :</label>
                        <select 
                            className="form-select" 
                            multiple 
                            style={{height: '120px'}}
                            value={selectedModelIds} 
                            onChange={e => setSelectedModelIds(Array.from(e.target.selectedOptions, o => o.value))}
                        >
                            {filteredModels.map(o => <option key={o.id_type} value={o.id_type}>{o.model_avion} ({o.tc_holder})</option>)}
                        </select>
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                        <button className="btn btn-success w-100 py-3 fw-bold" onClick={handleAdd} disabled={selectedModelIds.length === 0 || !selectedAgreementId}>
                            AJOUTER {selectedModelIds.length > 0 ? `(${selectedModelIds.length})` : ''}
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-sm table-hover border align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Modèle Avion</th>
                            <th>Agrément / Autorité</th>
                            <th>Maintenance</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTriples.length > 0 ? currentTriples.map((t, i) => {
                            const avion = avionOptions.find(a => a.id_type === t.id_type);
                            const agr = agreementOptions.find(a => a.id_agreement === t.id_agreement);
                            return (
                                <tr key={i}>
                                    <td><strong>{avion?.model_avion}</strong> <small className="text-muted">({avion?.tc_holder})</small></td>
                                    <td><span className="badge bg-info text-dark">{agr?.displayName || 'Inconnu'}</span></td>
                                    <td><span className="badge bg-light text-dark border">{t.maintenance_type}</span></td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(i)}>✖️</button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan="4" className="text-center p-3 text-muted">Aucune certification enregistrée.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// =========================================================
// COMPOSANT PRINCIPAL : HangarUpdate
// =========================================================
export default function HangarUpdate() {
    const [hangars, setHangars] = useState([]);
    const [selectedHangarId, setSelectedHangarId] = useState(null);
    const [hangarData, setHangarData] = useState({ triple_data: [], service_ids: [] });
    const [allAvionTypes, setAllAvionTypes] = useState([]);
    const [filteredAgreements, setFilteredAgreements] = useState([]); // Agréments filtrés pour le hangar
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState('');

    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);
            const { data: h } = await supabase.from('hangars').select('id_hangar, nom_hangar');
            const { data: t } = await supabase.from('type_avion').select('*');
            const { data: s } = await supabase.from('services').select('*');

            setHangars(h?.sort((a, b) => a.nom_hangar.localeCompare(b.nom_hangar)) || []);
            setAllAvionTypes(t || []);
            setAllServices(s || []);

            if (h?.length > 0) setSelectedHangarId(h[0].id_hangar);
            setLoading(false);
        }
        loadInitialData();
    }, []);

    // Déclenché à chaque fois qu'on change de hangar
    useEffect(() => {
        if (!selectedHangarId) return;
        async function loadHangarDetails() {
            // 1. Charger les triples existants et les services
            const { data: triples } = await supabase.from('hangar_triple').select('id_type, id_agreement, maintenance_type').eq('id_hangar', selectedHangarId);
            const { data: serv } = await supabase.from('hangar_service').select('id_service').eq('id_hangar', selectedHangarId);
            
            // 2. Charger les agréments UNIQUEMENT liés à ce hangar (via hangar_agreement)
            const { data: linkedAgreements } = await supabase.from('hangar_agreement')
                .select(`
                    id_agreement,
                    agreement (
                        id_agreement,
                        numero_agrement,
                        authorities ( name )
                    )
                `)
                .eq('id_hangar', selectedHangarId);

            // Mise à jour de la liste des agréments utilisables dans le formulaire
            const formattedAgreements = linkedAgreements?.map(item => ({
                id_agreement: item.agreement.id_agreement,
                displayName: `${item.agreement.numero_agrement} (${item.agreement.authorities?.name})`
            })) || [];

            setFilteredAgreements(formattedAgreements);
            setHangarData({
                triple_data: triples || [],
                service_ids: serv?.map(s => s.id_service) || []
            });
        }
        loadHangarDetails();
    }, [selectedHangarId]);

    const handleUpdate = async (table, newData) => {
        setUpdateStatus('Mise à jour...');
        try {
            await supabase.from(table).delete().eq('id_hangar', selectedHangarId);
            if (newData.length > 0) {
                const payload = table === 'hangar_triple' 
                    ? newData.map(d => ({ id_hangar: selectedHangarId, ...d }))
                    : newData.map(id => ({ id_hangar: selectedHangarId, id_service: id }));
                await supabase.from(table).insert(payload);
            }
            setHangarData(prev => ({ ...prev, [table === 'hangar_triple' ? 'triple_data' : 'service_ids']: newData }));
            setUpdateStatus('Sauvegarde réussie !');
            setTimeout(() => setUpdateStatus(''), 3000);
        } catch (e) {
            setUpdateStatus('Erreur lors de la sauvegarde.');
        }
    };

    if (loading) return <div className="p-5 text-center">Chargement des données...</div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1A237E' }}>⚙️ Capacités & Maintenance</h2>
                {updateStatus && <span className="badge bg-primary p-2">{updateStatus}</span>}
            </div>

            <div className="mb-4 p-4 border rounded bg-white shadow-sm border-start border-4 border-primary">
                <label className="fw-bold mb-2">1. Sélectionner le hangar</label>
                <select className="form-select form-select-lg" value={selectedHangarId || ''} onChange={e => setSelectedHangarId(parseInt(e.target.value))}>
                    {hangars.map(h => <option key={h.id_hangar} value={h.id_hangar}>{h.nom_hangar}</option>)}
                </select>
            </div>

            <HangarTripleEditor 
                title="2. Saisie des Capacités (Avion + Agrément)"
                avionOptions={allAvionTypes}
                agreementOptions={filteredAgreements} // On passe uniquement les agréments liés
                currentTriples={hangarData.triple_data}
                onUpdate={handleUpdate}
            />

            <RelationEditor 
                title="3. Services Complémentaires"
                options={allServices}
                currentIds={hangarData.service_ids}
                onUpdate={handleUpdate}
                idKey="id_service"
                nameKey="description"
                junctionTable="hangar_service"
            />
        </div>
    );
}