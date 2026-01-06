import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

/** * Variables de style basées sur ta charte
 */
const styles = {
    primary: '#1A233A',
    secondary: '#4FC3F7',
    accent: '#C87569',
    lightBg: '#f4f7f9',
    white: '#ffffff'
};

// =========================================================
// Composant RelationEditor (inchangé)
// =========================================================
const RelationEditor = ({ title, options, currentIds, onUpdate, idKey, nameKey, junctionTable, useSearch = false }) => {
    const [selectedIds, setSelectedIds] = useState(currentIds);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => { setSelectedIds(currentIds); }, [currentIds]);

    const handleToggle = (id) => {
        const newIds = selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id];
        setSelectedIds(newIds);
        onUpdate(junctionTable, newIds);
        if(useSearch) setSearchTerm("");
    };

    const selectedOptions = options.filter(option => selectedIds.includes(option[idKey]));
    
    const availableOptions = options.filter(option => {
        const isNotSelected = !selectedIds.includes(option[idKey]);
        if (!useSearch) return isNotSelected;
        return isNotSelected && option[nameKey].toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="mb-4 p-4 rounded-4 shadow-sm bg-white border-0">
            <h4 className="mb-3 fw-bold" style={{ color: styles.primary, fontSize: '1.2rem' }}>{title}</h4>

            <div className="mb-3">
                <p className="text-muted small fw-bold mb-2">Liaisons actives :</p>
                <div className="d-flex flex-wrap gap-2">
                    {selectedOptions.length > 0 ? selectedOptions.map(option => (
                        <div
                            key={option[idKey]}
                            className="badge px-3 py-2 d-flex align-items-center"
                            onClick={() => handleToggle(option[idKey])}
                            style={{ cursor: 'pointer', backgroundColor: styles.secondary, color: styles.primary, borderRadius: '20px' }}
                        >
                            {option[nameKey]} <span className="ms-2" style={{opacity: 0.7}}>✕</span>
                        </div>
                    )) : <span className="text-muted small fst-italic">Aucun élément lié.</span>}
                </div>
            </div>

            <hr className="my-4" style={{ opacity: 0.1 }} />

            <p className="text-muted small fw-bold mb-2">Ajouter depuis le référentiel :</p>
            
            {useSearch ? (
                <div className="position-relative">
                    <input 
                        type="text" 
                        className="form-control form-control-sm border-0 bg-light mb-2 p-2 shadow-none" 
                        placeholder="Tapez pour rechercher un agrément (ex: EASA...)" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderRadius: '10px' }}
                    />
                    {searchTerm.length >= 2 && (
                        <div className="list-group shadow-sm border-0 position-absolute w-100 z-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {availableOptions.map(option => (
                                <button
                                    key={option[idKey]}
                                    className="list-group-item list-group-item-action border-0 py-2 small"
                                    onClick={() => handleToggle(option[idKey])}
                                >
                                    ➕ {option[nameKey]}
                                </button>
                            ))}
                            {availableOptions.length === 0 && <div className="list-group-item small text-muted">Aucun résultat.</div>}
                        </div>
                    )}
                </div>
            ) : (
                <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {availableOptions.map(option => (
                        <div
                            key={option[idKey]}
                            className="badge px-3 py-2 bg-light border text-dark"
                            onClick={() => handleToggle(option[idKey])}
                            style={{ cursor: 'pointer', borderRadius: '20px' }}
                        >
                            {option[nameKey]} ＋
                        </div>
                    ))}
                </div>
            )}
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

    const [newAgNum, setNewAgNum] = useState("");
    const [newAgAuth, setNewAgAuth] = useState("");

    // --- 1. Chargement Initial ---
    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            try {
                const { data: hData } = await supabase.from('hangars').select('id_hangar, nom_hangar');
                const sortedHangars = hData?.sort((a, b) => a.nom_hangar.localeCompare(b.nom_hangar)) || [];
                setHangars(sortedHangars);
                if (sortedHangars.length > 0) setSelectedHangarId(sortedHangars[0].id_hangar);

                const { data: mData } = await supabase.from('mro_company').select('*').order('name');
                setMROCompanies(mData || []);

                const { data: authData } = await supabase.from('authorities').select('*').order('name');
                setAuthorities(authData || []);

                const { data: aData } = await supabase.from('agreement').select('*');
                setAllAgreements(aData || []);

            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchInitialData();
    }, []);

    // --- 2. Chargement des détails du Hangar sélectionné ---
    useEffect(() => {
        if (!selectedHangarId) return;
        async function fetchHangarDetails() {
            setLoading(true);
            try {
                const { data: dData } = await supabase.from('hangars').select('*').eq('id_hangar', selectedHangarId).single();
                const { data: mroRels } = await supabase.from('hangar_company').select('id_comp').eq('id_hangar', selectedHangarId);
                const { data: agRels } = await supabase.from('hangar_agreement').select('id_agreement').eq('id_hangar', selectedHangarId);

                setHangarData({
                    ...dData,
                    mro_ids: mroRels?.map(m => m.id_comp) || [],
                    agreement_ids: agRels?.map(a => a.id_agreement) || []
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchHangarDetails();
    }, [selectedHangarId]);

    // --- 3. Gestion inputs simples ---
    const handleSimpleFieldChange = (e) => setHangarData({ ...hangarData, [e.target.name]: e.target.value });

    // --- 4. Sauvegarde des Informations Générales (NOUVEAU) ---
    const handleUpdateHangarDetails = async () => {
        if (!selectedHangarId) return;
        setUpdateStatus('Sauvegarde des infos...');
        try {
            const { error } = await supabase
                .from('hangars')
                .update({
                    nom_hangar: hangarData.nom_hangar,
                    pays: hangarData.pays,
                    ville: hangarData.ville,
                    id_icao: hangarData.id_icao,
                    adresse_mail: hangarData.adresse_mail,
                    // Nouveaux champs ajoutés ici
                    adresse: hangarData.adresse,
                    zip_code: hangarData.zip_code,
                    phone: hangarData.phone
                })
                .eq('id_hangar', selectedHangarId);

            if (error) throw error;
            setUpdateStatus('Profil mis à jour !');
            setTimeout(() => setUpdateStatus(''), 2000);
        } catch (error) {
            console.error('Error updating hangar details:', error);
            setUpdateStatus('Erreur de sauvegarde');
        }
    };

    // --- 5. Gestion des Relations (MRO / Agreements) ---
    const handleRelationUpdate = async (junctionTable, newIds) => {
        if (!selectedHangarId) return;
        setUpdateStatus('Mise à jour des liaisons...');
        const idKey = junctionTable === 'hangar_company' ? 'id_comp' : 'id_agreement';
        const stateKey = junctionTable === 'hangar_company' ? 'mro_ids' : 'agreement_ids';

        try {
            await supabase.from(junctionTable).delete().eq('id_hangar', selectedHangarId);
            if (newIds.length > 0) {
                const rows = newIds.map(id => ({ id_hangar: selectedHangarId, [idKey]: id }));
                await supabase.from(junctionTable).insert(rows);
            }
            setHangarData(prev => ({ ...prev, [stateKey]: newIds }));
            setUpdateStatus('Succès');
            setTimeout(() => setUpdateStatus(''), 2000);
        } catch (err) { setUpdateStatus("Erreur"); }
    };

    // --- 6. Création rapide d'agrément ---
    const handleCreateAg = async () => {
        if (!newAgNum || !newAgAuth) return;
        try {
            const { data, error } = await supabase.from('agreement').insert({ numero_agrement: newAgNum, pays: newAgAuth }).select().single();
            if (!error) {
                setAllAgreements(prev => [...prev, data]);
                setNewAgNum("");
                setUpdateStatus("Agrément créé");
            }
        } catch (e) { console.error(e); }
    };

    if (loading && hangars.length === 0) return <div className="text-center p-5 mt-5">Chargement de l'interface...</div>;

    return (
        <div style={{ backgroundColor: styles.lightBg, minHeight: '100vh' }}>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="fw-bold m-0" style={{ color: styles.primary }}>⚙️ Console d'Administration</h2>
                    {updateStatus && <span className="badge px-4 py-2" style={{ backgroundColor: styles.primary, borderRadius: '10px' }}>{updateStatus}</span>}
                </div>

                {/* 1. Sélecteur de Hangar */}
                <div className="card border-0 shadow-sm p-4 mb-5 rounded-4" style={{ borderLeft: `6px solid ${styles.primary}` }}>
                    <label className="text-muted small fw-bold mb-2">SÉLECTION DU HANGAR</label>
                    <select className="form-select border-0 bg-light py-3 shadow-none" value={selectedHangarId || ''} onChange={e => setSelectedHangarId(parseInt(e.target.value))}>
                        {hangars.map(h => <option key={h.id_hangar} value={h.id_hangar}>{h.nom_hangar}</option>)}
                    </select>
                </div>

                {selectedHangarId && (
                    <div className="row g-4">
                        {/* 2. Formulaire Infos Générales (Mis à jour avec Adresse, Zip, Tel) */}
                        <div className="col-lg-8">
                            <form className="card border-0 shadow-sm p-4 h-100 rounded-4" onSubmit={(e) => e.preventDefault()}>
                                <h4 className="mb-4 fw-bold" style={{ color: styles.primary }}>Informations Générales</h4>
                                <div className="row g-3">
                                    {/* Ligne 1 : Nom et ICAO */}
                                    <div className="col-md-6">
                                        <label className="small text-muted mb-1">Nom du Hangar</label>
                                        <input className="form-control bg-light border-0" name="nom_hangar" value={hangarData.nom_hangar || ''} onChange={handleSimpleFieldChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small text-muted mb-1">Code ICAO</label>
                                        <input className="form-control bg-light border-0" name="id_icao" value={hangarData.id_icao || ''} onChange={handleSimpleFieldChange} />
                                    </div>

                                    {/* Ligne 2 : Adresse Complète */}
                                    <div className="col-12">
                                        <label className="small text-muted mb-1">Adresse</label>
                                        <input 
                                            className="form-control bg-light border-0" 
                                            name="adresse" 
                                            placeholder="Ex: 12 Rue de l'Aviation"
                                            value={hangarData.adresse || ''} 
                                            onChange={handleSimpleFieldChange} 
                                        />
                                    </div>

                                    {/* Ligne 3 : CP, Ville, Pays */}
                                    <div className="col-md-4">
                                        <label className="small text-muted mb-1">Code Postal</label>
                                        <input 
                                            className="form-control bg-light border-0" 
                                            name="zip_code" 
                                            value={hangarData.zip_code || ''} 
                                            onChange={handleSimpleFieldChange} 
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="small text-muted mb-1">Ville</label>
                                        <input className="form-control bg-light border-0" name="ville" value={hangarData.ville || ''} onChange={handleSimpleFieldChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="small text-muted mb-1">Pays</label>
                                        <input className="form-control bg-light border-0" name="pays" value={hangarData.pays || ''} onChange={handleSimpleFieldChange} />
                                    </div>

                                    {/* Ligne 4 : Contact */}
                                    <div className="col-md-6">
                                        <label className="small text-muted mb-1">Email Principal</label>
                                        <input className="form-control bg-light border-0" name="adresse_mail" value={hangarData.adresse_mail || ''} onChange={handleSimpleFieldChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small text-muted mb-1">Téléphone</label>
                                        <input 
                                            className="form-control bg-light border-0" 
                                            name="phone" 
                                            placeholder="+33 6..."
                                            value={hangarData.phone || ''} 
                                            onChange={handleSimpleFieldChange} 
                                        />
                                    </div>
                                </div>
                                <button 
                                    className="btn mt-4 py-2 fw-bold text-white shadow-sm" 
                                    style={{ backgroundColor: styles.primary, borderRadius: '10px' }}
                                    onClick={handleUpdateHangarDetails} // Relie le bouton à la fonction de mise à jour
                                >
                                    Mettre à jour le profil
                                </button>
                            </form>
                        </div>

                        {/* 3. Nouvel Agrément (Quick Create) */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm p-4 h-100 rounded-4">
                                <h4 className="mb-4 fw-bold" style={{ color: styles.accent }}>Nouvel Agrément</h4>
                                <p className="small text-muted mb-3">Ajouter un agrément inexistant au référentiel global.</p>
                                <input className="form-control bg-light border-0 mb-2" placeholder="Numéro (ex: EASA.145...)" value={newAgNum} onChange={e => setNewAgNum(e.target.value)} />
                                <select className="form-select bg-light border-0 mb-3" value={newAgAuth} onChange={e => setNewAgAuth(e.target.value)}>
                                    <option value="">Autorité émettrice...</option>
                                    {authorities.map(a => <option key={a.id_authority} value={a.id_authority}>{a.name}</option>)}
                                </select>
                                <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: styles.accent, borderRadius: '10px' }} onClick={handleCreateAg}>
                                    Créer et Publier
                                </button>
                            </div>
                        </div>

                        {/* 4. Gestion des Agréments */}
                        <div className="col-12 mt-4">
                            <RelationEditor 
                                title="Portefeuille d'Agréments (Let Me Check Database)" 
                                options={allAgreements} 
                                currentIds={hangarData.agreement_ids || []} 
                                onUpdate={handleRelationUpdate} 
                                idKey="id_agreement" 
                                nameKey="numero_agrement" 
                                junctionTable="hangar_agreement" 
                                useSearch={true}
                            />
                        </div>

                        {/* 5. MRO Companies */}
                        <div className="col-12 mt-4">
                            <RelationEditor 
                                title="Compagnies MRO Parentes" 
                                options={mroCompanies} 
                                currentIds={hangarData.mro_ids || []} 
                                onUpdate={handleRelationUpdate} 
                                idKey="id_comp" 
                                nameKey="name" 
                                junctionTable="hangar_company" 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}