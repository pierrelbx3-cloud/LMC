import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useTranslation } from 'react-i18next'; // <--- IMPORT I18N

/**
 * Variables de style harmonisées
 */
const styles = {
    primary: '#1A233A',    // Bleu Nuit
    secondary: '#4FC3F7',  // Bleu Ciel
    accent: '#C87569',     // Terre Cuite
    lightBg: '#f4f7f9',
    white: '#ffffff'
};

// =========================================================
// COMPOSANT 1 : Services (Gestion par badges stylisés)
// =========================================================
const RelationEditor = ({ title, options, currentIds, onUpdate, idKey, nameKey, junctionTable }) => {
    const { t } = useTranslation(); // <--- HOOK
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
        <div className="mb-4 p-4 rounded-4 shadow-sm bg-white border-0">
            <h4 className="mb-3 fw-bold" style={{ color: styles.primary, fontSize: '1.2rem' }}>{title}</h4>
            
            <p className="text-muted small fw-bold mb-2">{t('hangarUpdate.relation.active')}</p>
            <div className="d-flex flex-wrap gap-2 mb-4">
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(option => (
                        <div 
                            key={option[idKey]} 
                            className="badge px-3 py-2 d-flex align-items-center" 
                            onClick={() => handleToggle(option[idKey])} 
                            style={{ cursor: 'pointer', backgroundColor: styles.secondary, color: styles.primary, borderRadius: '20px' }}
                        >
                            {option[nameKey]} <span className="ms-2" style={{opacity: 0.6}}>✕</span>
                        </div>
                    ))
                ) : <p className="text-muted small fst-italic">{t('hangarUpdate.relation.none')}</p>}
            </div>

            <p className="text-muted small fw-bold mb-2">{t('hangarUpdate.relation.add')}</p>
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
        </div>
    );
};

// =========================================================
// COMPOSANT 2 : Éditeur Triple (Avion + Agrément + Maintenance)
// =========================================================
const HangarTripleEditor = ({ title, avionOptions, agreementOptions, currentTriples, onUpdate }) => {
    const { t } = useTranslation(); // <--- HOOK
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTCHolder, setSelectedTCHolder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModelIds, setSelectedModelIds] = useState([]);
    const [selectedAgreementId, setSelectedAgreementId] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('Base');

    useEffect(() => {
        if (agreementOptions.length === 1) {
            setSelectedAgreementId(agreementOptions[0].id_agreement);
        } else if (!agreementOptions.find(a => a.id_agreement === parseInt(selectedAgreementId))) {
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
        selectedModelIds.forEach(modelId => {
            const exists = newTriples.find(t => t.id_type === parseInt(modelId) && t.id_agreement === parseInt(selectedAgreementId));
            if (!exists) {
                newTriples.push({
                    id_type: parseInt(modelId),
                    id_agreement: parseInt(selectedAgreementId),
                    maintenance_type: maintenanceType
                });
            }
        });

        onUpdate('hangar_triple', newTriples);
        setSelectedModelIds([]);
        setSearchTerm('');
    };

    const handleRemove = (index) => {
        const newTriples = currentTriples.filter((_, i) => i !== index);
        onUpdate('hangar_triple', newTriples);
    };

    return (
        <div className="mb-4 p-4 rounded-4 shadow-sm bg-white border-0">
            <h4 className="mb-4 fw-bold" style={{ color: styles.primary, fontSize: '1.2rem' }}>{title}</h4>
            
            <div className="bg-light p-4 rounded-4 mb-4 border-0">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="small text-muted fw-bold mb-2">{t('hangarUpdate.triple.step1')}</label>
                        <select className="form-select border-0 shadow-none py-2" value={selectedAgreementId} onChange={e => setSelectedAgreementId(e.target.value)} style={{ borderRadius: '10px' }}>
                            <option value="">{t('hangarUpdate.triple.selectAgreement')}</option>
                            {agreementOptions.map(a => <option key={a.id_agreement} value={a.id_agreement}>{a.displayName}</option>)}
                        </select>
                        {agreementOptions.length === 0 && <small className="text-danger mt-1 d-block">{t('hangarUpdate.triple.noAgreementError')}</small>}
                    </div>
                    <div className="col-md-6">
                        <label className="small text-muted fw-bold mb-2">{t('hangarUpdate.triple.step2')}</label>
                        <select className="form-select border-0 shadow-none py-2" value={maintenanceType} onChange={e => setMaintenanceType(e.target.value)} style={{ borderRadius: '10px' }}>
                            <option value="Base">{t('hangarUpdate.triple.maintTypes.base')}</option>
                            <option value="Line">{t('hangarUpdate.triple.maintTypes.line')}</option>
                            <option value="Base & Line">{t('hangarUpdate.triple.maintTypes.both')}</option>
                        </select>
                    </div>

                    <div className="col-12"><hr className="my-2" style={{opacity: 0.1}} /></div>

                    <div className="col-md-4">
                        <label className="small text-muted fw-bold mb-2">{t('hangarUpdate.triple.filter')}</label>
                        <input type="text" className="form-control border-0 py-2 shadow-none" placeholder={t('hangarUpdate.triple.filterPlaceholder')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ borderRadius: '10px' }} />
                    </div>
                    <div className="col-md-4">
                        <label className="small text-muted fw-bold mb-2">{t('hangarUpdate.triple.category')}</label>
                        <select className="form-select border-0 py-2 shadow-none" value={selectedCategory} onChange={e => {setSelectedCategory(e.target.value); setSelectedTCHolder('');}} style={{ borderRadius: '10px' }}>
                            <option value="">{t('hangarUpdate.triple.all')}</option>
                            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="small text-muted fw-bold mb-2">{t('hangarUpdate.triple.manufacturer')}</label>
                        <select className="form-select border-0 py-2 shadow-none" value={selectedTCHolder} onChange={e => setSelectedTCHolder(e.target.value)} style={{ borderRadius: '10px' }}>
                            <option value="">{t('hangarUpdate.triple.all')}</option>
                            {uniqueTCHolders.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="col-md-9">
                        <label className="small text-muted fw-bold mb-2">{t('hangarUpdate.triple.step3')}</label>
                        <select multiple className="form-select border-0 shadow-none" style={{height: '120px', borderRadius: '10px'}} value={selectedModelIds} onChange={e => setSelectedModelIds(Array.from(e.target.selectedOptions, o => o.value))}>
                            {filteredModels.map(o => <option key={o.id_type} value={o.id_type} className="py-1 px-2">{o.model_avion} ({o.tc_holder})</option>)}
                        </select>
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                        <button className="btn w-100 py-3 fw-bold text-white shadow-sm border-0" onClick={handleAdd} disabled={selectedModelIds.length === 0 || !selectedAgreementId} style={{ backgroundColor: styles.accent, borderRadius: '12px' }}>
                            {t('hangarUpdate.triple.btnAdd')} {selectedModelIds.length > 0 ? `(${selectedModelIds.length})` : ''}
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover border-0 align-middle">
                    <thead style={{ backgroundColor: styles.primary, color: styles.white }}>
                        <tr>
                            <th className="py-3 px-4 border-0" style={{ borderRadius: '10px 0 0 0' }}>{t('hangarUpdate.table.model')}</th>
                            <th className="py-3 border-0">{t('hangarUpdate.table.agreement')}</th>
                            <th className="py-3 border-0">{t('hangarUpdate.table.maintenance')}</th>
                            <th className="py-3 px-4 border-0 text-end" style={{ borderRadius: '0 10px 0 0' }}>{t('hangarUpdate.table.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {currentTriples.length > 0 ? currentTriples.map((t, i) => {
                            const avion = avionOptions.find(a => a.id_type === t.id_type);
                            const agr = agreementOptions.find(a => a.id_agreement === t.id_agreement);
                            return (
                                <tr key={i} className="border-bottom">
                                    <td className="py-3 px-4 text-dark fw-bold">{avion?.model_avion} <span className="text-muted fw-normal small">/ {avion?.tc_holder}</span></td>
                                    <td><span className="badge px-3 py-2" style={{ backgroundColor: styles.secondary, color: styles.primary, borderRadius: '20px' }}>{agr?.displayName || 'Inconnu'}</span></td>
                                    <td><span className="text-muted small fw-bold">{t.maintenance_type}</span></td>
                                    <td className="text-end px-4">
                                        <button className="btn btn-sm btn-link text-danger text-decoration-none fw-bold" onClick={() => handleRemove(i)}>
                                            {t('hangarUpdate.table.remove')}
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan="4" className="text-center p-5 text-muted fst-italic">{t('hangarUpdate.table.empty')}</td></tr>
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
    const { t } = useTranslation(); // <--- HOOK
    const [hangars, setHangars] = useState([]);
    const [selectedHangarId, setSelectedHangarId] = useState(null);
    const [hangarData, setHangarData] = useState({ triple_data: [], service_ids: [] });
    const [allAvionTypes, setAllAvionTypes] = useState([]);
    const [filteredAgreements, setFilteredAgreements] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState('');

    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);
            try {
                const { data: h } = await supabase.from('hangars').select('id_hangar, nom_hangar');
                const sortedHangars = h?.sort((a, b) => a.nom_hangar.localeCompare(b.nom_hangar)) || [];
                setHangars(sortedHangars);
                
                const { data: t } = await supabase.from('type_avion').select('*');
                setAllAvionTypes(t || []);
                
                const { data: s } = await supabase.from('services').select('*').order('description');
                setAllServices(s || []);

                if (sortedHangars.length > 0) setSelectedHangarId(sortedHangars[0].id_hangar);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!selectedHangarId) return;
        async function loadHangarDetails() {
            const { data: triples } = await supabase.from('hangar_triple').select('id_type, id_agreement, maintenance_type').eq('id_hangar', selectedHangarId);
            const { data: serv } = await supabase.from('hangar_service').select('id_service').eq('id_hangar', selectedHangarId);
            
            const { data: linkedAgreements } = await supabase.from('hangar_agreement')
                .select(`id_agreement, agreement ( id_agreement, numero_agrement, authorities ( name ) )`)
                .eq('id_hangar', selectedHangarId);

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
        setUpdateStatus(t('hangarUpdate.status.updating'));
        try {
            await supabase.from(table).delete().eq('id_hangar', selectedHangarId);
            if (newData.length > 0) {
                const payload = table === 'hangar_triple' 
                    ? newData.map(d => ({ id_hangar: selectedHangarId, ...d }))
                    : newData.map(id => ({ id_hangar: selectedHangarId, id_service: id }));
                await supabase.from(table).insert(payload);
            }
            setHangarData(prev => ({ ...prev, [table === 'hangar_triple' ? 'triple_data' : 'service_ids']: newData }));
            setUpdateStatus(t('hangarUpdate.status.saved'));
            setTimeout(() => setUpdateStatus(''), 2500);
        } catch (e) { setUpdateStatus(t('hangarUpdate.status.error')); }
    };

    if (loading && hangars.length === 0) return <div className="text-center p-5 mt-5">{t('hangarUpdate.status.initializing')}</div>;

    return (
        <div style={{ backgroundColor: styles.lightBg, minHeight: '100vh' }}>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="fw-bold m-0" style={{ color: styles.primary }}>⚙️ {t('hangarUpdate.title')}</h2>
                    {updateStatus && <span className="badge px-4 py-2" style={{ backgroundColor: styles.primary, borderRadius: '10px' }}>{updateStatus}</span>}
                </div>

                {/* 1. Sélecteur Hangar */}
                <div className="card border-0 shadow-sm p-4 mb-5 rounded-4" style={{ borderLeft: `6px solid ${styles.primary}` }}>
                    <label className="text-muted small fw-bold mb-2">{t('hangarUpdate.selectHangar')}</label>
                    <select className="form-select border-0 bg-light py-3 shadow-none fw-bold" value={selectedHangarId || ''} onChange={e => setSelectedHangarId(parseInt(e.target.value))} style={{ borderRadius: '12px' }}>
                        {hangars.map(h => <option key={h.id_hangar} value={h.id_hangar}>{h.nom_hangar}</option>)}
                    </select>
                </div>

                <HangarTripleEditor 
                    title={t('hangarUpdate.sections.certifications')}
                    avionOptions={allAvionTypes}
                    agreementOptions={filteredAgreements}
                    currentTriples={hangarData.triple_data}
                    onUpdate={handleUpdate}
                />

                <RelationEditor 
                    title={t('hangarUpdate.sections.services')}
                    options={allServices}
                    currentIds={hangarData.service_ids}
                    onUpdate={handleUpdate}
                    idKey="id_service"
                    nameKey="description"
                    junctionTable="hangar_service"
                />
            </div>
        </div>
    );
}