import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Building2, LayoutDashboard, FileText, ScanLine, Calculator, Settings, Search, Plus, Upload, CheckCircle2, Clock3, Euro, ArrowUpRight, Menu, X, ChevronRight, Download, Trash2, FileCheck2, ShieldCheck, Sparkles, Home, Users, CalendarDays } from 'lucide-react';
import './styles.css';

const initialBuildings = [
  { id: 1, name: 'Mehrfamilienhaus Lindenstraße', address: 'Lindenstraße 12, 12345 Musterstadt', units: 6, area: 468, year: '2026' },
  { id: 2, name: 'Wohnhaus am Park', address: 'Parkweg 4, 12345 Musterstadt', units: 4, area: 312, year: '2026' },
];
const initialReceipts = [
  { id: 1, name: 'Grundsteuer_Bescheid.pdf', category: 'Grundsteuer', building: 'Mehrfamilienhaus Lindenstraße', date: '12.02.2026', amount: 840.50, status: 'Geprüft' },
  { id: 2, name: 'Gebäudeversicherung.jpg', category: 'Versicherung', building: 'Wohnhaus am Park', date: '03.03.2026', amount: 1260.00, status: 'Prüfung nötig' },
  { id: 3, name: 'Wasser_Abwasser.pdf', category: 'Wasser / Abwasser', building: 'Mehrfamilienhaus Lindenstraße', date: '14.04.2026', amount: 975.20, status: 'Neu' },
];
const money = n => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(n || 0));
const nav = [
  { id: 'dashboard', label: 'Übersicht', icon: LayoutDashboard },
  { id: 'properties', label: 'Immobilien', icon: Building2 },
  { id: 'receipts', label: 'Belege & Kosten', icon: FileText },
  { id: 'billing', label: 'Abrechnungen', icon: Calculator },
];

function App() {
  const [page, setPage] = useState('dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [buildings, setBuildings] = useState(initialBuildings);
  const [receipts, setReceipts] = useState(initialReceipts);
  const [search, setSearch] = useState('');
  const [showBuildingForm, setShowBuildingForm] = useState(false);
  const [buildingName, setBuildingName] = useState('');
  const [buildingAddress, setBuildingAddress] = useState('');
  const [buildingUnits, setBuildingUnits] = useState('4');
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [receiptDraft, setReceiptDraft] = useState({ name: '', category: 'Sonstige Betriebskosten', building: buildings[0]?.name || '', date: '', amount: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [notice, setNotice] = useState('');
  const totalCosts = receipts.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const pending = receipts.filter(r => r.status !== 'Geprüft').length;
  const filteredReceipts = useMemo(() => receipts.filter(r => (r.name + r.category + r.building + r.status).toLowerCase().includes(search.toLowerCase())), [receipts, search]);

  function addBuilding(e) {
    e.preventDefault();
    if (!buildingName.trim()) return;
    setBuildings([...buildings, { id: Date.now(), name: buildingName.trim(), address: buildingAddress.trim() || 'Adresse ergänzen', units: Math.max(1, Number(buildingUnits) || 1), area: 0, year: '2026' }]);
    setBuildingName(''); setBuildingAddress(''); setBuildingUnits('4'); setShowBuildingForm(false);
    setNotice('Immobilie wurde hinzugefügt.');
  }
  function addReceipt(e) {
    e.preventDefault();
    if (!receiptDraft.name || !receiptDraft.amount) return;
    setReceipts([{ id: Date.now(), ...receiptDraft, amount: Number(receiptDraft.amount), date: receiptDraft.date ? new Date(receiptDraft.date).toLocaleDateString('de-DE') : 'Noch offen', status: 'Prüfung nötig' }, ...receipts]);
    setReceiptDraft({ name: '', category: 'Sonstige Betriebskosten', building: buildings[0]?.name || '', date: '', amount: '' });
    setShowReceiptForm(false); setSelectedFile(null); setNotice('Beleg wurde als Entwurf aufgenommen. Bitte Daten prüfen.');
  }
  function markReviewed(id) {
    setReceipts(receipts.map(r => r.id === id ? { ...r, status: 'Geprüft' } : r));
    setNotice('Beleg als geprüft markiert.');
  }
  function exportCsv() {
    const rows = [['Datei','Kostenart','Immobilie','Datum','Betrag EUR','Status'], ...receipts.map(r => [r.name,r.category,r.building,r.date,String(r.amount.toFixed(2)).replace('.',','),r.status])];
    const csv = '\uFEFF' + rows.map(row => row.map(v => '"' + String(v).replaceAll('"','""') + '"').join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'thaden-bka-belege.csv'; a.click(); URL.revokeObjectURL(url);
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Building2 size={25}/></div><div><strong>Thaden BKA</strong><span>Betriebskosten Abrechnung</span></div><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Menü schließen"><X/></button></div>
      <div className="workspace-label">ARBEITSBEREICH</div>
      <nav>{nav.map(item => <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => { setPage(item.id); setMobileNav(false); }}><item.icon size={18}/><span>{item.label}</span>{page === item.id && <ChevronRight size={16} className="nav-chevron"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="secure-card"><ShieldCheck size={19}/><div><strong>Deine Daten im Blick</strong><p>Prototyp – noch keine sichere Speicherung.</p></div></div><button className="nav-item" onClick={() => setNotice('Einstellungen werden in einer späteren Version ergänzt.')}><Settings size={18}/><span>Einstellungen</span></button><div className="user-row"><div className="avatar">TB</div><div><strong>Thaden BKA</strong><span>Lokaler Prototyp</span></div><span className="online-dot"/></div></div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Menü schließen"/>}
    <main className="main-area">
      <header className="topbar"><button className="menu-toggle" onClick={() => setMobileNav(true)} aria-label="Menü öffnen"><Menu/></button><div className="breadcrumbs">Thaden BKA <span>/</span> <strong>{nav.find(n => n.id === page)?.label || 'Übersicht'}</strong></div><div className="topbar-right"><span className="year-pill"><CalendarDays size={15}/> Abrechnungsjahr 2026</span><div className="avatar small">TB</div></div></header>
      <div className="page-content">
        {notice && <div className="notice"><CheckCircle2 size={17}/><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Hinweis schließen"><X size={16}/></button></div>}
        {page === 'dashboard' && <Dashboard buildings={buildings} receipts={receipts} totalCosts={totalCosts} pending={pending} setPage={setPage} setShowReceiptForm={setShowReceiptForm}/>}
        {page === 'properties' && <Properties buildings={buildings} setShowBuildingForm={setShowBuildingForm} />}
        {page === 'receipts' && <Receipts receipts={filteredReceipts} search={search} setSearch={setSearch} setShowReceiptForm={setShowReceiptForm} markReviewed={markReviewed} exportCsv={exportCsv}/>}
        {page === 'billing' && <Billing buildings={buildings} receipts={receipts} totalCosts={totalCosts} setPage={setPage}/>}
      </div>
    </main>
    {showBuildingForm && <Modal title="Neue Immobilie anlegen" close={() => setShowBuildingForm(false)}><form className="form-stack" onSubmit={addBuilding}><label>Bezeichnung<input required value={buildingName} onChange={e => setBuildingName(e.target.value)} placeholder="z. B. Mehrfamilienhaus Hauptstraße"/></label><label>Adresse<input value={buildingAddress} onChange={e => setBuildingAddress(e.target.value)} placeholder="Straße, PLZ, Ort"/></label><label>Anzahl Wohnungen<input type="number" min="1" value={buildingUnits} onChange={e => setBuildingUnits(e.target.value)}/></label><p className="form-hint">Wohnflächen und Mieterdaten können später je Wohnung ergänzt werden.</p><button className="btn primary full" type="submit"><Plus size={17}/> Immobilie speichern</button></form></Modal>}
    {showReceiptForm && <Modal title="Beleg hinzufügen" close={() => {setShowReceiptForm(false); setSelectedFile(null);}}><form className="form-stack" onSubmit={addReceipt}><label className="upload-zone"><Upload size={24}/><strong>{selectedFile?.name || 'Beleg auswählen'}</strong><span>PDF, JPG oder PNG · lokale Vorschau</span><input type="file" accept=".pdf,image/png,image/jpeg" onChange={e => {const f=e.target.files?.[0]; if(f){setSelectedFile(f);setReceiptDraft(d=>({...d,name:f.name}));}}}/></label><div className="ai-note"><Sparkles size={17}/><span><strong>KI-Erkennung als nächster Ausbauschritt</strong><br/>In dieser Version werden Rechnungsdaten noch manuell eingetragen.</span></div><label>Dateiname<input required value={receiptDraft.name} onChange={e => setReceiptDraft({...receiptDraft,name:e.target.value})} placeholder="z. B. Wasserrechnung.pdf"/></label><label>Immobilie<select value={receiptDraft.building} onChange={e => setReceiptDraft({...receiptDraft,building:e.target.value})}>{buildings.map(b=><option key={b.id}>{b.name}</option>)}</select></label><label>Kostenart<select value={receiptDraft.category} onChange={e => setReceiptDraft({...receiptDraft,category:e.target.value})}>{['Heizung','Wasser / Abwasser','Grundsteuer','Gebäudeversicherung','Müllabfuhr','Hausreinigung','Gartenpflege','Allgemeinstrom','Aufzug','Schornsteinfeger','Sonstige Betriebskosten'].map(c=><option key={c}>{c}</option>)}</select></label><div className="form-two"><label>Rechnungsdatum<input type="date" value={receiptDraft.date} onChange={e => setReceiptDraft({...receiptDraft,date:e.target.value})}/></label><label>Betrag in Euro<input required type="number" min="0" step="0.01" value={receiptDraft.amount} onChange={e => setReceiptDraft({...receiptDraft,amount:e.target.value})} placeholder="0,00"/></label></div><button className="btn primary full" type="submit"><CheckCircle2 size={17}/> Beleg als Entwurf speichern</button></form></Modal>}
  </div>;
}

function PageHeading({eyebrow,title,description,action}) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>; }
function Dashboard({buildings,receipts,totalCosts,pending,setPage,setShowReceiptForm}) {
  const reviewed = receipts.filter(r=>r.status==='Geprüft').length;
  return <><PageHeading eyebrow="DEIN ARBEITSPLATZ" title="Guten Tag!" description="Hier ist der aktuelle Überblick über deine Betriebskostenabrechnung." action={<button className="btn primary" onClick={()=>setShowReceiptForm(true)}><Plus size={17}/> Beleg hinzufügen</button>}/>
    <div className="welcome-banner"><div className="welcome-copy"><div className="banner-kicker"><Sparkles size={15}/> THADEN BKA · 2026</div><h2>Weniger Papierkram.<br/>Mehr Überblick.</h2><p>Sammle deine Belege an einem Ort und bereite deine jährliche Betriebskostenabrechnung Schritt für Schritt vor.</p><button className="btn banner-btn" onClick={()=>setPage('receipts')}>Zu deinen Belegen <ArrowUpRight size={17}/></button></div><div className="banner-illustration"><div className="illus-circle"><Building2 size={74} strokeWidth={1.1}/></div><div className="illus-paper paper-one"><FileText size={22}/><span/><span/></div><div className="illus-paper paper-two"><CheckCircle2 size={24}/><span/><span/></div></div></div>
    <div className="stats-grid"><Stat icon={Building2} label="Immobilien" value={buildings.length} note="Verwaltete Objekte" tone="green"/><Stat icon={FileText} label="Erfasste Belege" value={receipts.length} note={`${reviewed} davon geprüft`} tone="blue"/><Stat icon={Euro} label="Erfasste Kosten" value={money(totalCosts)} note="Summe aller Belegentwürfe" tone="sand"/><Stat icon={Clock3} label="Noch zu prüfen" value={pending} note="Belege benötigen Kontrolle" tone="rose"/></div>
    <div className="content-grid"><section className="panel"><div className="panel-heading"><div><h3>Deine Immobilien</h3><p>Deine verwalteten Objekte im Überblick</p></div><button className="text-btn" onClick={()=>setPage('properties')}>Alle ansehen <ChevronRight size={16}/></button></div><div className="property-list">{buildings.slice(0,3).map((b,i)=><div className="property-row" key={b.id}><div className={`property-icon tint-${i%3}`}><Building2 size={21}/></div><div className="property-main"><strong>{b.name}</strong><span>{b.address}</span></div><div className="property-meta"><strong>{b.units}</strong><span>Wohnungen</span></div><ChevronRight className="muted-chevron" size={18}/></div>)}</div></section>
    <section className="panel"><div className="panel-heading"><div><h3>Dein Fortschritt</h3><p>Belegprüfung im Überblick</p></div><span className="progress-count">{receipts.length ? Math.round(reviewed/receipts.length*100) : 0}%</span></div><div className="progress-track"><div className="progress-value" style={{width:`${receipts.length ? reviewed/receipts.length*100 : 0}%`}}/></div><div className="progress-legend"><span><i className="dot done"/> Geprüft <strong>{reviewed}</strong></span><span><i className="dot todo"/> Offen <strong>{pending}</strong></span></div><div className="tip-card"><Sparkles size={18}/><div><strong>Schon gewusst?</strong><p>Die automatische Belegerkennung mit KI ist als nächster Entwicklungsschritt vorgesehen.</p></div></div></section></div>
    <section className="panel recent-panel"><div className="panel-heading"><div><h3>Zuletzt erfasste Belege</h3><p>Prüfe, ob alle Angaben stimmen.</p></div><button className="text-btn" onClick={()=>setPage('receipts')}>Alle Belege <ChevronRight size={16}/></button></div><ReceiptTable receipts={receipts.slice(0,4)}/></section>
    <div className="prototype-foot"><ShieldCheck size={17}/><span><strong>Hinweis zum Prototyp:</strong> Beispielwerte sind Demonstrationsdaten. Noch keine echte OCR, dauerhafte Speicherung oder rechtsgeprüfte Abrechnung.</span></div>
  </>;
}
function Stat({icon:Icon,label,value,note,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>; }
function Properties({buildings,setShowBuildingForm}) {
 return <><PageHeading eyebrow="OBJEKTVERWALTUNG" title="Deine Immobilien" description="Verwalte deine Häuser und bereite sie für die jährliche Abrechnung vor." action={<button className="btn primary" onClick={()=>setShowBuildingForm(true)}><Plus size={17}/> Immobilie anlegen</button>}/><div className="info-strip"><Home size={19}/><div><strong>Ein zentraler Überblick für alle Objekte</strong><span>Wohnflächen, Mieterdaten und Verteilerschlüssel ergänzen wir in den nächsten Schritten.</span></div></div><div className="property-cards">{buildings.map((b,i)=><article className="property-card" key={b.id}><div className={`property-card-art tint-${i%3}`}><Building2 size={42}/><span>ABRECHNUNGSJAHR 2026</span></div><div className="property-card-body"><h3>{b.name}</h3><p>{b.address}</p><div className="property-card-stats"><div><Users size={16}/><strong>{b.units}</strong><span>Wohnungen</span></div><div><Home size={16}/><strong>{b.area || '–'}{b.area?' m²':''}</strong><span>Gesamtfläche</span></div></div><div className="card-footer"><span className="status-pill neutral"><Clock3 size={13}/> Einrichtung offen</span><span className="arrow-circle"><ArrowUpRight size={17}/></span></div></div></article>)}</div><div className="prototype-foot"><ShieldCheck size={17}/><span>Bitte zunächst nur Beispieldaten verwenden. Mieterdaten werden in dieser Version nicht dauerhaft gespeichert.</span></div></>;
}
function Receipts({receipts,search,setSearch,setShowReceiptForm,markReviewed,exportCsv}) {
 return <><PageHeading eyebrow="BELEGVERWALTUNG" title="Belege & Kosten" description="Sammle Rechnungen, prüfe die erkannten Angaben und ordne Kosten einer Immobilie zu." action={<button className="btn primary" onClick={()=>setShowReceiptForm(true)}><Upload size={17}/> Beleg hochladen</button>}/><div className="receipt-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Belege durchsuchen…"/></div><button className="btn secondary" onClick={exportCsv}><Download size={16}/> CSV exportieren</button></div><section className="panel table-panel"><div className="panel-heading"><div><h3>Alle Belege</h3><p>{receipts.length} Einträge in deiner Übersicht</p></div><span className="subtle-label">ABRECHNUNGSJAHR 2026</span></div><ReceiptTable receipts={receipts} markReviewed={markReviewed}/></section><div className="ai-feature"><div className="ai-feature-icon"><ScanLine size={24}/></div><div><span className="eyebrow">GEPLANTER AUSBAU</span><h3>Automatische Belegerkennung</h3><p>Im nächsten Schritt verbinden wir den Upload mit einer OCR-/KI-Schnittstelle, damit Rechnungsdatum, Betrag, Lieferant und Kostenart automatisch vorgeschlagen werden. Du bestätigst nur noch unsichere Angaben.</p></div><span className="coming-pill">In Vorbereitung</span></div></>;
}
function ReceiptTable({receipts,markReviewed}) {
 if(!receipts.length) return <div className="empty-state"><FileText size={28}/><strong>Keine Belege gefunden</strong><span>Ändere den Suchbegriff oder lade einen Beleg hoch.</span></div>;
 return <div className="table-wrap"><table><thead><tr><th>Dokument</th><th>Kostenart / Immobilie</th><th>Datum</th><th>Betrag</th><th>Status</th>{markReviewed&&<th></th>}</tr></thead><tbody>{receipts.map(r=><tr key={r.id}><td><div className="doc-cell"><div className="doc-icon"><FileText size={17}/></div><strong>{r.name}</strong></div></td><td><div className="category-cell"><strong>{r.category}</strong><span>{r.building}</span></div></td><td className="date-cell">{r.date}</td><td className="amount-cell">{money(r.amount)}</td><td><span className={`status-pill ${r.status==='Geprüft'?'success':r.status==='Neu'?'new':'warning'}`}>{r.status==='Geprüft'?<CheckCircle2 size={13}/>:<Clock3 size={13}/>} {r.status}</span></td>{markReviewed&&<td>{r.status!=='Geprüft'&&<button className="icon-btn" title="Als geprüft markieren" onClick={()=>markReviewed(r.id)}><CheckCircle2 size={17}/></button>}</td>}</tr>)}</tbody></table></div>;
}
function Billing({buildings,receipts,totalCosts,setPage}) {
 const [area,setArea] = useState('80');
 const [totalArea,setTotalArea] = useState('400');
 const share = Number(totalArea)>0 ? Number(area)/Number(totalArea) : 0;
 return <><PageHeading eyebrow="JAHRESABRECHNUNG" title="Abrechnungen" description="Bereite die jährliche Betriebskostenabrechnung vor und prüfe die Verteilung."/><div className="info-strip"><Calculator size={20}/><div><strong>Abrechnung für 2026 vorbereiten</strong><span>Dies ist eine unverbindliche Beispielrechnung, keine fertige oder rechtlich geprüfte Mieterabrechnung.</span></div></div><div className="billing-grid"><section className="panel"><div className="panel-heading"><div><h3>Beispiel: Verteilung nach Wohnfläche</h3><p>Nur zur Demonstration der Rechenlogik</p></div></div><div className="form-stack billing-form"><label>Wohnfläche der Wohnung (m²)<input type="number" min="0" value={area} onChange={e=>setArea(e.target.value)}/></label><label>Gesamtfläche des Hauses (m²)<input type="number" min="0.01" value={totalArea} onChange={e=>setTotalArea(e.target.value)}/></label><div className="calculation-result"><span>Beispielhafter Flächenanteil</span><strong>{(share*100).toLocaleString('de-DE',{maximumFractionDigits:2})}%</strong><span>von {money(totalCosts)} erfassten Beispielkosten</span><h3>{money(totalCosts*share)}</h3></div></div></section><section className="panel"><div className="panel-heading"><div><h3>Abrechnungsstatus</h3><p>Stand deiner Daten</p></div></div><div className="billing-checklist"><div><CheckCircle2/><span>Immobilien angelegt</span><strong>{buildings.length}</strong></div><div><FileText/><span>Belege erfasst</span><strong>{receipts.length}</strong></div><div><Clock3/><span>Belege noch zu prüfen</span><strong>{receipts.filter(r=>r.status!=='Geprüft').length}</strong></div><div><Users/><span>Mieterdaten / Vorauszahlungen</span><strong className="not-ready">Offen</strong></div><div><FileCheck2/><span>PDF-Abrechnung</span><strong className="not-ready">Noch nicht</strong></div></div><button className="btn secondary full" onClick={()=>setPage('receipts')}>Belege vervollständigen <ChevronRight size={16}/></button></section></div><div className="prototype-foot"><ShieldCheck size={17}/><span>Die tatsächliche Umlage hängt von Mietvertrag, Kostenart und geltendem Recht ab. Heiz- und Warmwasserkosten können besonderen Verteilungsregeln unterliegen. Nicht blind als echte Abrechnung verwenden.</span></div></>;
}
function Modal({title,close,children}) { return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><div className="modal"><div className="modal-heading"><h2>{title}</h2><button className="icon-btn" onClick={close} aria-label="Schließen"><X/></button></div>{children}</div></div>; }
createRoot(document.getElementById('root')).render(<App/>);
