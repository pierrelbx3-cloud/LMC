// src/pages/pro/HangarFullEdit.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Ajuster le chemin si nécessaire

// =========================================================
// Composant RelationEditor (Agréments et MRO)
// =========================================================
const RelationEditor = ({ title, options, currentIds, onUpdate, idKey, nameKey, junctionTable, hangarId }) => {
    const [selectedIds, setSelectedIds] = useState(currentIds);

    useEffect(() => { setSelectedIds(currentIds); }, [currentIds]);

    const handleToggle = (id) => {
        const newIds = selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id];
        setSelectedIds(newIds);
        onUpdate(junctionTable, newIds);
    };

    if (!options || options.length === 0) return <p className="text-muted">Aucune option disponible.</p>;

    const availableOptions = options.filter(option => !selectedIds.includes(option[idKey]));
    const selectedOptions = options.filter(option => selectedIds.includes(option[idKey]));

    return (
        <div className="mb-4 p-4 border rounded-3 shadow-sm bg-white">
            <h4 className="mb-3" style={{ color: 'var(--color-primary, #1A237E)' }}>{title}</h4>

            <div className="mb-3">
                <p className="fw-bold small mb-1">Actuellement sélectionnés :</p>
                <div className="d-flex flex-wrap gap-2">
                    {selectedOptions.length > 0 ? selectedOptions.map(option => (
                        <div
                            key={option[idKey]}
                            className="badge p-2 bg-success text-white"
                            onClick={() => handleToggle(option[idKey])}
                            style={{ cursor: 'pointer' }}
                        >
                            {option[nameKey]} ✖️
                        </div>
                    )) : <p className="text-muted small">Aucun élément sélectionné.</p>}
                </div>
            </div>

            <p className="fw-bold small mb-1 mt-3">Disponibles :</p>
            <div className="d-flex flex-wrap gap-2">
                {availableOptions.map(option => (
                    <div
                        key={option[idKey]}
                        className="badge p-2 bg-light border text-dark"
                        onClick={() => handleToggle(option[idKey])}
                        style={{ cursor: 'pointer' }}
                    >
                        {option[nameKey]} ➕
                    </div>
                ))}
            </div>
        </div>
    );
};

// =========================================================
// Composant principal HangarFullEdit
// =========================================================
export default function HangarFullEdit() {
    const [hangars, setHangars] = useState([]);
    const [selectedHangarId, setSelectedHangarId] = useState(null);
    const [hangarData, setHangarData] = useState({});
    const [agreements, setAgreements] = useState([]);
    const [mroCompanies, setMROCompanies] = useState([]);
    const [authorities, setAuthorities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState('');

    // Pour ajout agrément
    const [newAgreementNumber, setNewAgreementNumber] = useState("");
    const [newAgreementCountry, setNewAgreementCountry] = useState("");
    const [createAgreementStatus, setCreateAgreementStatus] = useState("");

    // ----------------- Chargement initial -----------------
    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                const { data: hData } = await supabase.from('hangars').select('id_hangar, nom_hangar');
                setHangars(hData || []);
                if (hData.length > 0) setSelectedHangarId(hData[0].id_hangar);

                const { data: aData } = await supabase.from('agreement').select('*');
                setAgreements(aData || []);

                const { data: mData } = await supabase.from('mro_company').select('*');
                setMROCompanies(mData || []);

                const { data: authData } = await supabase.from('authorities').select('*');
                setAuthorities(authData || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchInitialData();
    }, []);

    // ----------------- Chargement hangar sélectionné -----------------
    useEffect(() => {
        if (!selectedHangarId) return;
        async function fetchHangarDetails() {
            setLoading(true);
            try {
                const { data: dData } = await supabase.from('hangars').select('*').eq('id_hangar', selectedHangarId).single();

                const { data: agRelations } = await supabase.from('hangar_agreement').select('id_agreement').eq('id_hangar', selectedHangarId);
                const { data: mroRelations } = await supabase.from('hangar_company').select('id_comp').eq('id_hangar', selectedHangarId);

                setHangarData({
                    ...dData,
                    agreement_ids: agRelations.map(a => a.id_agreement),
                    mro_ids: mroRelations.map(m => m.id_comp)
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchHangarDetails();
    }, [selectedHangarId]);

    // ----------------- Gestion relation -----------------
    const handleRelationUpdate = async (junctionTable, newIds) => {
        if (!selectedHangarId) return;
        setUpdateStatus(`Mise à jour de ${junctionTable}...`);

        const key = junctionTable === 'hangar_agreement' ? 'id_agreement' : 'id_comp';

        try {
            await supabase.from(junctionTable).delete().eq('id_hangar', selectedHangarId);
            if (newIds.length > 0) {
                const rows = newIds.map(id => ({ id_hangar: selectedHangarId, [key]: id }));
                await supabase.from(junctionTable).insert(rows);
            }

            setHangarData(prev => ({
                ...prev,
                [junctionTable==='hangar_agreement'?'agreement_ids':'mro_ids']: newIds
            }));

            setUpdateStatus(`Mise à jour de ${junctionTable} réussie !`);
        } catch (err) { setUpdateStatus("Erreur : "+err.message); }
    };

    // ----------------- Ajouter un nouvel agrément -----------------
    const handleAddAgreement = async () => {
        if (!newAgreementNumber || !newAgreementCountry) { setCreateAgreementStatus("Remplir tous les champs"); return; }
        setCreateAgreementStatus("Création en cours...");

        try {
            const { data, error } = await supabase.from('agreement')
                .insert({ numero_agrement: newAgreementNumber, pays: newAgreementCountry })
                .select().single();
            if (error) throw error;

            setAgreements(prev => [...prev, data]);
            setCreateAgreementStatus("Agrément ajouté !");
            setNewAgreementNumber(""); setNewAgreementCountry("");
        } catch (err) {
            setCreateAgreementStatus("Erreur : "+err.message);
        }
    };

    // ----------------- Sauvegarde champs simples -----------------
    const handleSimpleFieldChange = (e) => setHangarData({ ...hangarData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatus("Sauvegarde en cours...");
        try {
            const { error } = await supabase.from('hangars')
                .update({
                    nom_hangar: hangarData.nom_hangar,
                    pays: hangarData.pays,
                    ville: hangarData.ville,
                    adresse_mail: hangarData.adresse_mail,
                    adresse_mail1: hangarData.adresse_mail1,
                    id_icao: hangarData.id_icao,
                    date_maj: new Date().toISOString()
                }).eq('id_hangar', selectedHangarId);
            if (error) throw error;
            setUpdateStatus("Données enregistrées !");
        } catch (err) { setUpdateStatus("Erreur : "+err.message); }
    };

    if (loading && hangars.length === 0) return <p className="text-center mt-5">Chargement...</p>;
    if (hangars.length === 0) return <p className="text-center mt-5">Aucun hangar à gérer.</p>;

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold" style={{ color: 'var(--color-primary, #1A237E)' }}>⚙️ Gestion du Hangar</h2>

            {updateStatus && <div className={`alert ${updateStatus.includes("Erreur")?"alert-danger":"alert-success"} mb-4`}>{updateStatus}</div>}

            {/* Sélection du hangar */}
            <div className="mb-5 p-4 border rounded-3 bg-light shadow-sm">
                <label className="form-label fw-bold">1. Sélection du Hangar</label>
                <select className="form-select" value={selectedHangarId} onChange={e => { setSelectedHangarId(parseInt(e.target.value)); setUpdateStatus(''); }}>
                    {hangars.map(h => <option key={h.id_hangar} value={h.id_hangar}>{h.nom_hangar}</option>)}
                </select>
            </div>

            {selectedHangarId && !loading && (
                <>
                    {/* Champs simples */}
                    <form onSubmit={handleSubmit} className="mb-5 p-4 border rounded-3 shadow-sm bg-white">
                        <h4 className="mb-4" style={{color:'var(--color-primary,#1A237E)'}}>2. Informations Générales</h4>
                        <div className="row g-3">
                            <div className="col-md-6"><label>Nom Hangar</label><input className="form-control" name="nom_hangar" value={hangarData.nom_hangar||''} onChange={handleSimpleFieldChange} required/></div>
                            <div className="col-md-6"><label>Pays</label><input className="form-control" name="pays" value={hangarData.pays||''} onChange={handleSimpleFieldChange} required/></div>
                            <div className="col-md-6"><label>Ville</label><input className="form-control" name="ville" value={hangarData.ville||''} onChange={handleSimpleFieldChange}/></div>
                            <div className="col-md-6"><label>Code ICAO</label><input className="form-control" name="id_icao" value={hangarData.id_icao||''} onChange={handleSimpleFieldChange}/></div>
                            <div className="col-md-6"><label>Email Principal</label><input className="form-control" name="adresse_mail" value={hangarData.adresse_mail||''} onChange={handleSimpleFieldChange} required/></div>
                            <div className="col-md-6"><label>Email Secondaire</label><input className="form-control" name="adresse_mail1" value={hangarData.adresse_mail1||''} onChange={handleSimpleFieldChange}/></div>
                        </div>
                        <button className="btn btn-accent-pro mt-4" type="submit">Enregistrer</button>
                    </form>

                    {/* Ajouter un agrément */}
                    <div className="mb-5 p-4 border rounded-3 shadow-sm bg-white">
                        <h5 style={{color:'var(--color-primary,#1A237E)'}}>➕ Ajouter un agrément</h5>
                        <div className="row g-3 mt-2">
                            <div className="col-md-6"><input className="form-control" placeholder="Numéro agrément" value={newAgreementNumber} onChange={e=>setNewAgreementNumber(e.target.value)}/></div>
                            <div className="col-md-6">
                                <select className="form-select" value={newAgreementCountry} onChange={e=>setNewAgreementCountry(e.target.value)}>
                                    <option value="">Sélectionner autorité</option>
                                    {authorities.map(a=><option key={a.id_authority} value={a.id_authority}>{a.name} - {a.country}</option>)}
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-success mt-2" onClick={handleAddAgreement}>Ajouter</button>
                        {createAgreementStatus && <p className="mt-2 text-info">{createAgreementStatus}</p>}
                    </div>

                    {/* Relations */}
                    <RelationEditor title="3. Agréments liés" options={agreements} currentIds={hangarData.agreement_ids||[]} onUpdate={handleRelationUpdate} idKey="id_agreement" nameKey="numero_agrement" junctionTable="hangar_agreement" hangarId={selectedHangarId}/>
                    <RelationEditor title="4. MRO Companies" options={mroCompanies} currentIds={hangarData.mro_ids||[]} onUpdate={handleRelationUpdate} idKey="id_comp" nameKey="name" junctionTable="hangar_company" hangarId={selectedHangarId}/>
                </>
            )}
        </div>
    );
}
