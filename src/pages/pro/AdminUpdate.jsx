import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// =========================================================
// Composant RelationEditor (Générique pour MRO et Agréments)
// =========================================================
const RelationEditor = ({ title, options, currentIds, onUpdate, idKey, nameKey, junctionTable, color = "#1A237E" }) => {
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
            <h4 className="mb-3" style={{ color: color }}>{title}</h4>

            <div className="mb-3">
                <p className="fw-bold small mb-1">Actuellement liés au hangar :</p>
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
                    )) : <p className="text-muted small">Aucun élément lié.</p>}
                </div>
            </div>

            <p className="fw-bold small mb-1 mt-3">Ajouter (Référentiel disponible) :</p>
            {/* Ajout d'une barre de défilement si trop d'options pour la lisibilité */}
            <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '200px', overflowY: 'auto', padding: '5px' }}>
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
    const [mroCompanies, setMROCompanies] = useState([]);
    const [allAgreements, setAllAgreements] = useState([]);
    const [authorities, setAuthorities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState('');

    // Pour ajout agrément en base (Référentiel global)
    const [newAgreementNumber, setNewAgreementNumber] = useState("");
    const [newAgreementCountry, setNewAgreementCountry] = useState("");
    const [createAgreementStatus, setCreateAgreementStatus] = useState("");

    // Pour ajout MRO
    const [newMROName, setNewMROName] = useState("");
    const [selectedMROId, setSelectedMROId] = useState("");
    const [createMROStatus, setCreateMROStatus] = useState("");

    // ----------------- Chargement initial -----------------
    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                const { data: hData } = await supabase.from('hangars').select('id_hangar, nom_hangar');
                setHangars(hData || []);
                if (hData && hData.length > 0) setSelectedHangarId(hData[0].id_hangar);

                const { data: mData } = await supabase.from('mro_company').select('*');
                setMROCompanies(mData || []);

                const { data: authData } = await supabase.from('authorities').select('*');
                setAuthorities(authData || []);

                // On charge tous les agréments du référentiel pour le RelationEditor
                const { data: aData } = await supabase.from('agreement').select('*');
                setAllAgreements(aData || []);

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
                
                // Récupération des MRO liées
                const { data: mroRelations } = await supabase.from('hangar_company').select('id_comp').eq('id_hangar', selectedHangarId);
                
                // Récupération des Agréments liés (Portefeuille du hangar)
                const { data: agRelations } = await supabase.from('hangar_agreement').select('id_agreement').eq('id_hangar', selectedHangarId);

                setHangarData({
                    ...dData,
                    mro_ids: mroRelations ? mroRelations.map(m => m.id_comp) : [],
                    agreement_ids: agRelations ? agRelations.map(a => a.id_agreement) : []
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchHangarDetails();
    }, [selectedHangarId]);

    // ----------------- Gestion des relations (MRO et Agréments) -----------------
    const handleRelationUpdate = async (junctionTable, newIds) => {
        if (!selectedHangarId) return;
        setUpdateStatus(`Mise à jour de ${junctionTable}...`);

        // Déterminer la clé étrangère selon la table
        const idKey = junctionTable === 'hangar_company' ? 'id_comp' : 'id_agreement';
        const dataKey = junctionTable === 'hangar_company' ? 'mro_ids' : 'agreement_ids';

        try {
            await supabase.from(junctionTable).delete().eq('id_hangar', selectedHangarId);
            if (newIds.length > 0) {
                const rows = newIds.map(id => ({ id_hangar: selectedHangarId, [idKey]: id }));
                await supabase.from(junctionTable).insert(rows);
            }
            setHangarData(prev => ({ ...prev, [dataKey]: newIds }));
            setUpdateStatus(`Réussite !`);
        } catch (err) { 
            setUpdateStatus("Erreur : " + err.message); 
        }
    };

    // ----------------- Créer un nouvel agrément dans le référentiel -----------------
    const handleAddAgreementToReferentiel = async () => {
        if (!newAgreementNumber || !newAgreementCountry) { setCreateAgreementStatus("Remplir tous les champs"); return; }
        setCreateAgreementStatus("Création...");

        try {
            const { data, error } = await supabase.from('agreement')
                .insert({ numero_agrement: newAgreementNumber, pays: newAgreementCountry })
                .select().single();
            if (error) throw error;

            setAllAgreements(prev => [...prev, data]);
            setCreateAgreementStatus("Ajouté au référentiel !");
            setNewAgreementNumber(""); setNewAgreementCountry("");
        } catch (err) { setCreateAgreementStatus("Erreur : " + err.message); }
    };

    // ----------------- Ajouter/Lier MRO -----------------
    const handleAddMRO = async () => {
        if (!newMROName && !selectedMROId) {
            setCreateMROStatus("Écrire un nom ou sélectionner une compagnie");
            return;
        }
        setCreateMROStatus("Ajout...");

        try {
            let mroId = selectedMROId;
            if (newMROName) {
                const { data, error } = await supabase.from('mro_company').insert({ name: newMROName }).select().single();
                if (error) throw error;
                setMROCompanies(prev => [...prev, data]);
                mroId = data.id_comp;
                setNewMROName("");
            }

            if (mroId) {
                const alreadyLinked = hangarData.mro_ids?.includes(mroId);
                if (!alreadyLinked) {
                    await supabase.from('hangar_company').insert({ id_hangar: selectedHangarId, id_comp: mroId });
                    setHangarData(prev => ({ ...prev, mro_ids: [...(prev.mro_ids || []), mroId] }));
                }
            }
            setSelectedMROId("");
            setCreateMROStatus("MRO liée !");
        } catch (err) { setCreateMROStatus("Erreur : " + err.message); }
    };

    const handleSimpleFieldChange = (e) => setHangarData({ ...hangarData, [e.target.name]: e.target.value });
    
    const handleSubmitGeneral = async (e) => {
        e.preventDefault();
        setUpdateStatus("Sauvegarde...");
        try {
            const { error } = await supabase.from('hangars')
                .update({
                    nom_hangar: hangarData.nom_hangar,
                    pays: hangarData.pays,
                    ville: hangarData.ville,
                    adresse_mail: hangarData.adresse_mail,
                    adresse_mail1: hangarData.adresse_mail1,
                    id_icao: hangarData.id_icao,
                    Adresse: hangarData.Adresse,
                    Zip_code: hangarData.Zip_code,
                    Phone: hangarData.Phone,
                    date_maj: new Date().toISOString()
                }).eq('id_hangar', selectedHangarId);
            if (error) throw error;
            setUpdateStatus("Infos enregistrées !");
        } catch (err) { setUpdateStatus("Erreur : " + err.message); }
    };

    if (loading && hangars.length === 0) return <p className="text-center mt-5">Chargement des données...</p>;

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold" style={{ color: '#1A237E' }}>⚙️ Gestion du Hangar</h2>

            {updateStatus && <div className={`alert ${updateStatus.includes("Erreur") ? "alert-danger" : "alert-success"} mb-4`}>{updateStatus}</div>}

            {/* 1. Sélection du hangar */}
            <div className="mb-5 p-4 border rounded-3 bg-light shadow-sm">
                <label className="form-label fw-bold text-primary">1. Sélection du Hangar à modifier</label>
                <select className="form-select form-select-lg" value={selectedHangarId || ''} onChange={e => setSelectedHangarId(parseInt(e.target.value))}>
                    {hangars.map(h => <option key={h.id_hangar} value={h.id_hangar}>{h.nom_hangar}</option>)}
                </select>
            </div>

            {selectedHangarId && (
                <>
                    {/* 2. Informations Générales */}
                    <form onSubmit={handleSubmitGeneral} className="mb-5 p-4 border rounded-3 shadow-sm bg-white">
                        <h4 className="mb-4" style={{ color: '#1A237E' }}>2. Informations Générales</h4>
                        <div className="row g-3">
                            <div className="col-md-6"><label className="small fw-bold">Nom Hangar</label><input className="form-control" name="nom_hangar" value={hangarData.nom_hangar || ''} onChange={handleSimpleFieldChange} required /></div>
                            <div className="col-md-6"><label className="small fw-bold">Pays</label><input className="form-control" name="pays" value={hangarData.pays || ''} onChange={handleSimpleFieldChange} required /></div>
                            <div className="col-md-6"><label className="small fw-bold">Ville</label><input className="form-control" name="ville" value={hangarData.ville || ''} onChange={handleSimpleFieldChange} /></div>
                            <div className="col-md-6"><label className="small fw-bold">Code ICAO</label><input className="form-control" name="id_icao" value={hangarData.id_icao || ''} onChange={handleSimpleFieldChange} /></div>
                            <div className="col-md-6"><label className="small fw-bold">Adresse</label><input className="form-control" name="Adresse" value={hangarData.Adresse || ''} onChange={handleSimpleFieldChange} /></div>
                            <div className="col-md-3"><label className="small fw-bold">Code Postal</label><input className="form-control" name="Zip_code" value={hangarData.Zip_code || ''} onChange={handleSimpleFieldChange} /></div>
                            <div className="col-md-3"><label className="small fw-bold">Téléphone</label><input className="form-control" name="Phone" value={hangarData.Phone || ''} onChange={handleSimpleFieldChange} /></div>
                            <div className="col-md-6"><label className="small fw-bold">Email Principal</label><input className="form-control" name="adresse_mail" value={hangarData.adresse_mail || ''} onChange={handleSimpleFieldChange} required /></div>
                            <div className="col-md-6"><label className="small fw-bold">Email Secondaire</label><input className="form-control" name="adresse_mail1" value={hangarData.adresse_mail1 || ''} onChange={handleSimpleFieldChange} /></div>
                        </div>
                        <button className="btn btn-primary mt-4 px-5" type="submit">Sauvegarder les informations</button>
                    </form>

                    {/* 3. Portefeuille d'agréments du hangar */}
                    <RelationEditor 
                        title="3. Portefeuille d'Agréments du Hangar" 
                        options={allAgreements} 
                        currentIds={hangarData.agreement_ids || []} 
                        onUpdate={handleRelationUpdate} 
                        idKey="id_agreement" 
                        nameKey="numero_agrement" 
                        junctionTable="hangar_agreement" 
                        color="#0D47A1"
                    />

                    {/* 4. Créer un nouvel agrément (si manquant dans le référentiel) */}
                    <div className="mb-5 p-4 border rounded-3 shadow-sm bg-white border-info">
                        <h5 style={{ color: '#00838F' }}>➕ Nouvel agrément au référentiel</h5>
                        <p className="text-muted small">Si l'agrément n'existe pas dans la liste ci-dessus, créez-le ici d'abord.</p>
                        <div className="row g-3 mt-1">
                            <div className="col-md-6"><input className="form-control" placeholder="Numéro (ex: FAA.Cert.123)" value={newAgreementNumber} onChange={e => setNewAgreementNumber(e.target.value)} /></div>
                            <div className="col-md-6">
                                <select className="form-select" value={newAgreementCountry} onChange={e => setNewAgreementCountry(e.target.value)}>
                                    <option value="">Sélectionner l'autorité émettrice</option>
                                    {authorities.map(a => <option key={a.id_authority} value={a.id_authority}>{a.name} ({a.country})</option>)}
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-outline-info mt-3" onClick={handleAddAgreementToReferentiel}>Créer dans le référentiel</button>
                        {createAgreementStatus && <p className="mt-2 text-info small fw-bold">{createAgreementStatus}</p>}
                    </div>

                    {/* 5. MRO Companies */}
                    <div className="mb-4 p-4 border rounded-3 shadow-sm bg-white">
                        <h5 style={{ color: '#1A237E' }}>➕ Lier une MRO Company</h5>
                        <div className="row g-3 mt-1">
                            <div className="col-md-6"><input className="form-control" placeholder="Nom de la nouvelle MRO" value={newMROName} onChange={e => setNewMROName(e.target.value)} /></div>
                            <div className="col-md-6">
                                <select className="form-select" value={selectedMROId} onChange={e => setSelectedMROId(e.target.value)}>
                                    <option value="">Ou sélectionner une MRO existante</option>
                                    {mroCompanies.map(m => <option key={m.id_comp} value={m.id_comp}>{m.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-outline-primary mt-3" onClick={handleAddMRO}>Lier cette MRO</button>
                        {createMROStatus && <p className="mt-2 text-info small fw-bold">{createMROStatus}</p>}
                    </div>

                    <RelationEditor 
                        title="6. Liste des MRO liées" 
                        options={mroCompanies} 
                        currentIds={hangarData.mro_ids || []} 
                        onUpdate={handleRelationUpdate} 
                        idKey="id_comp" 
                        nameKey="name" 
                        junctionTable="hangar_company" 
                    />
                </>
            )}
        </div>
    );
}