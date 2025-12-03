// src/pages/pro/HangarUpdate.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// =========================================================
// Composant : Relation simple (services)
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
        <div className="mb-4 p-4 border rounded-3 shadow-sm">
            <h4 className="mb-3">{title}</h4>

            <p className="fw-bold small mb-1">Services sélectionnés :</p>
            <div className="d-flex flex-wrap gap-2 mb-3">
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(option => (
                        <div
                            key={option[idKey]}
                            className="badge bg-success p-2 text-white"
                            onClick={() => handleToggle(option[idKey])}
                            style={{ cursor: 'pointer' }}
                        >
                            {option[nameKey]} ✖️
                        </div>
                    ))
                ) : (
                    <p className="text-muted small">Aucun service.</p>
                )}
            </div>

            <p className="fw-bold small mb-1">Services disponibles :</p>
            <div className="d-flex flex-wrap gap-2">
                {availableOptions.map(option => (
                    <div
                        key={option[idKey]}
                        className="badge p-2 bg-light border"
                        onClick={() => handleToggle(option[idKey])}
                        style={{ cursor: 'pointer', color: 'black' }}
                    >
                        {option[nameKey]} ➕
                    </div>
                ))}
            </div>
        </div>
    );
};

// =========================================================
// Composant : Sélecteur d'avions (catégorie > TC holder > modèle)
// =========================================================
const HangarAvionEditor = ({
    title,
    options,
    currentIds,
    onUpdate,
    idKey,
    nameKey,
    junctionTable
}) => {
    const [selectedIds, setSelectedIds] = useState(currentIds);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTCHolder, setSelectedTCHolder] = useState('');
    const [selectedModelId, setSelectedModelId] = useState('');

    useEffect(() => {
        setSelectedIds(currentIds);
    }, [currentIds]);

    const uniqueCategories = [...new Set(options.map(o => o.product_category))].sort();

    const uniqueTCHolders = [
        ...new Set(
            options
                .filter(o => !selectedCategory || o.product_category === selectedCategory)
                .map(o => o.tc_holder)
        ),
    ].sort();

    const filteredModels = options.filter(o =>
        !selectedIds.includes(o[idKey]) &&
        (!selectedTCHolder || o.tc_holder === selectedTCHolder)
    );

    const selectedOptions = options.filter(o => selectedIds.includes(o[idKey]));

    const handleAdd = () => {
        if (!selectedModelId) return;

        const newIds = [...selectedIds, parseInt(selectedModelId)];
        setSelectedIds(newIds);
        onUpdate(junctionTable, newIds);
        setSelectedModelId('');
    };

    const handleRemove = (id) => {
        const newIds = selectedIds.filter(item => item !== id);
        setSelectedIds(newIds);
        onUpdate(junctionTable, newIds);
    };

    return (
        <div className="mb-4 p-4 border rounded-3 shadow-sm">
            <h4 className="mb-3">{title}</h4>

            <div className="d-flex flex-column gap-2 mb-3">
                <div className="d-flex gap-2">
                    <select
                        className="form-select"
                        value={selectedCategory}
                        onChange={e => {
                            setSelectedCategory(e.target.value);
                            setSelectedTCHolder('');
                            setSelectedModelId('');
                        }}
                    >
                        <option value="">-- Catégorie --</option>
                        {uniqueCategories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        className="form-select"
                        value={selectedTCHolder}
                        disabled={!selectedCategory}
                        onChange={e => {
                            setSelectedTCHolder(e.target.value);
                            setSelectedModelId('');
                        }}
                    >
                        <option value="">-- TC Holder --</option>
                        {uniqueTCHolders.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="d-flex gap-2">
                    <select
                        className="form-select"
                        value={selectedModelId}
                        disabled={!selectedTCHolder}
                        onChange={e => setSelectedModelId(e.target.value)}
                    >
                        <option value="">-- Modèle --</option>
                        {filteredModels.map(o => (
                            <option key={o[idKey]} value={o[idKey]}>
                                {o.model_avion}
                            </option>
                        ))}
                    </select>

                    <button
                        className="btn btn-success"
                        disabled={!selectedModelId}
                        onClick={handleAdd}
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            <p className="fw-bold small mb-1">Modèles sélectionnés :</p>
            <div className="d-flex flex-wrap gap-2">
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(option => (
                        <div
                            key={option[idKey]}
                            className="badge bg-success p-2 text-white"
                            onClick={() => handleRemove(option[idKey])}
                            style={{ cursor: 'pointer' }}
                        >
                            {option[nameKey]} ✖️
                        </div>
                    ))
                ) : (
                    <p className="text-muted small">Aucun modèle.</p>
                )}
            </div>
        </div>
    );
};

// =========================================================
// Composant Principal
// =========================================================
export default function HangarUpdate() {
    const [hangars, setHangars] = useState([]);
    const [selectedHangarId, setSelectedHangarId] = useState(null);
    const [hangarData, setHangarData] = useState({});
    const [allAvionTypes, setAllAvionTypes] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState('');

    // ---------------------------
    // Chargement initial
    // ---------------------------
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const { data: h } = await supabase.from('hangars').select('id_hangar, nom_hangar');
                const { data: t } = await supabase
                    .from('type_avion')
                    .select('id_type, model_avion, tc_holder, product_category');

                const { data: s } = await supabase.from('services').select('id_service, description');

                const mappedAvions = t.map(t => ({
                    ...t,
                    displayName: `${t.model_avion} (${t.tc_holder})`,
                }));

                setHangars(h.sort((a, b) =>
    a.nom_hangar.localeCompare(b.nom_hangar)));
                setAllAvionTypes(mappedAvions.sort((a, b) =>
    a.displayName.localeCompare(b.displayName)));
                setAllServices(s.sort((a, b) =>
    a.description.localeCompare(b.description)));

                if (h.length > 0) setSelectedHangarId(h[0].id_hangar);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // ---------------------------
    // Chargement des relations du hangar choisi
    // ---------------------------
    useEffect(() => {
        if (!selectedHangarId) return;

        async function loadDetails() {
            setLoading(true);
            try {
                const { data: avions } = await supabase
                    .from('hangar_avion')
                    .select('id_type')
                    .eq('id_hangar', selectedHangarId);

                const { data: services } = await supabase
                    .from('hangar_service')
                    .select('id_service')
                    .eq('id_hangar', selectedHangarId);

                setHangarData({
                    avion_ids: avions.map(a => a.id_type),
                    service_ids: services.map(s => s.id_service),
                });
            } finally {
                setLoading(false);
            }
        }
        loadDetails();
    }, [selectedHangarId]);

    // ---------------------------
    // Mise à jour relation M2M
    // ---------------------------
    const handleRelationUpdate = async (junctionTable, newIds) => {
        if (!selectedHangarId) return;
        setUpdateStatus('Mise à jour...');

        const key = junctionTable === 'hangar_avion' ? 'id_type' : 'id_service';

        await supabase.from(junctionTable).delete().eq('id_hangar', selectedHangarId);

        if (newIds.length > 0) {
            const payload = newIds.map(id => ({
                id_hangar: selectedHangarId,
                [key]: id
            }));
            await supabase.from(junctionTable).insert(payload);
        }

        setHangarData(prev => ({
            ...prev,
            [junctionTable === 'hangar_avion' ? 'avion_ids' : 'service_ids']: newIds
        }));

        setUpdateStatus('Mise à jour réussie !');
    };

    if (loading && hangars.length === 0) return <p>Chargement...</p>;

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold">⚙️ Gestion du Hangar</h2>

            {updateStatus && (
                <div className="alert alert-info">{updateStatus}</div>
            )}

            {/* --- PARTIE 1 : Sélection du hangar --- */}
            <div className="mb-4 p-4 border rounded bg-light shadow-sm">
                <label className="fw-bold">1. Sélection du Hangar</label>
                <select
                    className="form-select mt-2"
                    value={selectedHangarId || ''}
                    onChange={e => setSelectedHangarId(parseInt(e.target.value))}
                >
                    {hangars.map(h => (
                        <option key={h.id_hangar} value={h.id_hangar}>
                            {h.nom_hangar}
                        </option>
                    ))}
                </select>
            </div>

            {/* --- PARTIE 3 : Avions --- */}
            <HangarAvionEditor
                title="2. Modèles d’Avions Supportés"
                options={allAvionTypes}
                currentIds={hangarData.avion_ids || []}
                onUpdate={handleRelationUpdate}
                idKey="id_type"
                nameKey="displayName"
                junctionTable="hangar_avion"
            />

            {/* --- PARTIE 4 : Services --- */}
            <RelationEditor
                title="3. Services Proposés"
                options={allServices}
                currentIds={hangarData.service_ids || []}
                onUpdate={handleRelationUpdate}
                idKey="id_service"
                nameKey="description"
                junctionTable="hangar_service"
            />
        </div>
    );
}
