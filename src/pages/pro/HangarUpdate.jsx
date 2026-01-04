// src/pages/pro/HangarUpdate.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// =========================================================
// COMPOSANT : Relation simple (Services)
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
                ) : <p className="text-muted small">Aucun service.</p>}
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
// COMPOSANT : Éditeur Triple (Avion + Agrément + Maintenance)
// =========================================================
const HangarTripleEditor = ({ title, avionOptions, agreementOptions, currentTriples, onUpdate }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTCHolder, setSelectedTCHolder] = useState('');
    const [selectedModelId, setSelectedModelId] = useState('');
    const [selectedAgreementId, setSelectedAgreementId] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('Base');

    const uniqueCategories = [...new Set(avionOptions.map(o => o.product_category))].sort();
    const uniqueTCHolders = [...new Set(avionOptions.filter(o => !selectedCategory || o.product_category === selectedCategory).map(o => o.tc_holder))].sort();
    const filteredModels = avionOptions.filter(o => !selectedTCHolder || o.tc_holder === selectedTCHolder);

    const handleAdd = () => {
        if (!selectedModelId || !selectedAgreementId) return;
        
        const newTriple = {
            id_type: parseInt(selectedModelId),
            id_agreement: parseInt(selectedAgreementId),
            maintenance_type: maintenanceType
        };

        const exists = currentTriples.find(t => t.id_type === newTriple.id_type && t.id_agreement === newTriple.id_agreement);
        if (exists) return alert("Cette combinaison existe déjà.");

        onUpdate('hangar_triple', [...currentTriples, newTriple]);
        setSelectedModelId('');
    };

    const handleRemove = (index) => {
        const newTriples = currentTriples.filter((_, i) => i !== index);
        onUpdate('hangar_triple', newTriples);
    };

    return (
        <div className="mb-4 p-4 border rounded-3 shadow-sm bg-white">
            <h4 className="mb-3">{title}</h4>
            <div className="bg-light p-3 rounded mb-4">
                <div className="row g-2">
                    <div className="col-md-4">
                        <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                            <option value="">-- Catégorie --</option>
                            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={selectedTCHolder} disabled={!selectedCategory} onChange={e => setSelectedTCHolder(e.target.value)}>
                            <option value="">-- Constructeur --</option>
                            {uniqueTCHolders.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={selectedModelId} disabled={!selectedTCHolder} onChange={e => setSelectedModelId(e.target.value)}>
                            <option value="">-- Modèle --</option>
                            {filteredModels.map(o => <option key={o.id_type} value={o.id_type}>{o.model_avion}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <select className="form-select border-primary" value={selectedAgreementId} onChange={e => setSelectedAgreementId(e.target.value)}>
                            <option value="">-- Sélectionner l'Agrément (Numéro + Autorité) --</option>
                            {agreementOptions.map(a => <option key={a.id_agreement} value={a.id_agreement}>{a.displayName}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={maintenanceType} onChange={e => setMaintenanceType(e.target.value)}>
                            <option value="Base">Base Maintenance</option>
                            <option value="Line">Line Maintenance</option>
                            <option value="Base & Line">Base & Line</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-success w-100" onClick={handleAdd} disabled={!selectedModelId || !selectedAgreementId}>Ajouter</button>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-sm table-hover border align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Modèle Avion</th>
                            <th>Agrément / Autorité</th>
                            <th>Maintenance</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTriples.map((t, i) => {
                            const avion = avionOptions.find(a => a.id_type === t.id_type);
                            const agr = agreementOptions.find(a => a.id_agreement === t.id_agreement);
                            return (
                                <tr key={i}>
                                    <td><strong>{avion?.model_avion}</strong> <small className="text-muted">({avion?.tc_holder})</small></td>
                                    <td><span className="badge bg-info text-dark">{agr?.displayName || 'Inconnu'}</span></td>
                                    <td>{t.maintenance_type}</td>
                                    <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(i)}>✖️</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// =========================================================
// COMPOSANT PRINCIPAL
// =========================================================
export default function HangarUpdate() {
    const [hangars, setHangars] = useState([]);
    const [selectedHangarId, setSelectedHangarId] = useState(null);
    const [hangarData, setHangarData] = useState({ triple_data: [], service_ids: [] });
    const [allAvionTypes, setAllAvionTypes] = useState([]);
    const [allAgreements, setAllAgreements] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState('');

    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);
            const { data: h } = await supabase.from('hangars').select('id_hangar, nom_hangar');
            const { data: t } = await supabase.from('type_avion').select('*');
            const { data: s } = await supabase.from('services').select('*');
            const { data: a } = await supabase.from('agreement').select('id_agreement, numero_agrement, authorities(name)');

            setHangars(h?.sort((a, b) => a.nom_hangar.localeCompare(b.nom_hangar)) || []);
            setAllAvionTypes(t || []);
            setAllServices(s || []);
            setAllAgreements(a?.map(item => ({
                id_agreement: item.id_agreement,
                displayName: `${item.numero_agrement} (${item.authorities?.name})`
            })) || []);

            if (h?.length > 0) setSelectedHangarId(h[0].id_hangar);
            setLoading(false);
        }
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!selectedHangarId) return;
        async function loadHangarDetails() {
            const { data: triples } = await supabase.from('hangar_triple').select('id_type, id_agreement, maintenance_type').eq('id_hangar', selectedHangarId);
            const { data: serv } = await supabase.from('hangar_service').select('id_service').eq('id_hangar', selectedHangarId);
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
            setUpdateStatus('Succès !');
            setTimeout(() => setUpdateStatus(''), 3000);
        } catch (e) {
            setUpdateStatus('Erreur lors de la sauvegarde.');
        }
    };

    if (loading) return <div className="p-5 text-center">Chargement des données...</div>;

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold">⚙️ Gestion du Hangar</h2>
            {updateStatus && <div className="alert alert-info">{updateStatus}</div>}

            <div className="mb-4 p-4 border rounded bg-light shadow-sm">
                <label className="fw-bold mb-2">1. Hangar à modifier</label>
                <select className="form-select" value={selectedHangarId || ''} onChange={e => setSelectedHangarId(parseInt(e.target.value))}>
                    {hangars.map(h => <option key={h.id_hangar} value={h.id_hangar}>{h.nom_hangar}</option>)}
                </select>
            </div>

            <HangarTripleEditor 
                title="2. Certifications (Avion + Agrément)"
                avionOptions={allAvionTypes}
                agreementOptions={allAgreements}
                currentTriples={hangarData.triple_data}
                onUpdate={handleUpdate}
            />

            <RelationEditor 
                title="3. Services"
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