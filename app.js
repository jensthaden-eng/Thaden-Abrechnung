"use strict";
const pageTitles={dashboard:"Dashboard",properties:"Immobilien & Mietparteien",documents:"Belege & Scans",costs:"Kosten & Verteilung",settlements:"Abrechnungen",reports:"Jahresübersicht"};
let properties=[
 {name:"Musterstraße 1",units:5,kind:"Mehrfamilienhaus"},
 {name:"Hauptstraße 12",units:8,kind:"Mehrfamilienhaus"},
 {name:"Gartenweg 5",units:5,kind:"Wohnhaus"}
];
let uploadedFiles=[];
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+id));
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
 document.querySelectorAll(".mobile-bottom button").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
 document.getElementById("page-title").textContent=pageTitles[id]||"Dashboard";
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.goto)));
document.getElementById("year").addEventListener("change",e=>{
 const year=e.target.value;
 document.getElementById("metric-year").textContent=year;
 document.getElementById("cost-year").textContent=year;
 document.getElementById("settlement-year").textContent=year;
 document.querySelectorAll(".year-inline").forEach(x=>x.textContent=year);
 renderProperties();
});
function renderProperties(){
 const list=document.getElementById("property-list");
 const tiles=document.getElementById("property-tiles");
 list.replaceChildren();tiles.replaceChildren();
 properties.forEach((p,i)=>{
  const tile=document.createElement("div");tile.className="property-tile";
  const photo=document.createElement("div");photo.className="property-photo";
  const content=document.createElement("div");content.className="property-tile-content";
  const title=document.createElement("b");title.textContent=p.name;
  const units=document.createElement("small");units.textContent=p.units+" Wohneinheiten";
  const active=document.createElement("span");active.className="active-tag";active.textContent="Demo-Objekt";
  content.append(title,units,active);tile.append(photo,content);tiles.append(tile);
  const row=document.createElement("article");row.className="property-row";
  const pic=document.createElement("div");pic.className="property-photo";
  const info=document.createElement("div");
  const h=document.createElement("h3");h.textContent=p.name;
  const desc=document.createElement("p");desc.textContent=p.kind+" · "+p.units+" Wohneinheiten";
  const meta=document.createElement("small");meta.textContent="Abrechnungsjahr "+document.getElementById("year").value+" · Demo";
  info.append(h,desc,meta);row.append(pic,info);list.append(row);
 });
 document.getElementById("metric-properties").textContent=properties.length;
 document.getElementById("report-properties").textContent=properties.length;
}
renderProperties();
const form=document.getElementById("property-form");
document.getElementById("add-property").addEventListener("click",()=>{form.classList.toggle("hidden");if(!form.classList.contains("hidden"))document.getElementById("property-name").focus()});
form.addEventListener("submit",e=>{
 e.preventDefault();
 const name=document.getElementById("property-name").value.trim();
 const units=Math.max(1,Number(document.getElementById("units").value)||1);
 if(!name)return;
 properties.push({name,units,kind:"Immobilie"});
 form.reset();document.getElementById("units").value="4";form.classList.add("hidden");renderProperties();
});
document.getElementById("file-input").addEventListener("change",e=>{
 const files=Array.from(e.target.files||[]);
 if(!files.length)return;
 uploadedFiles.push(...files);
 const msg=document.getElementById("upload-feedback");
 msg.textContent=files.length+" Datei(en) ausgewählt. Dateien werden in dieser Demo nicht an einen Server übertragen.";
 renderDocuments();e.target.value="";
});
function renderDocuments(){
 const list=document.getElementById("document-list");list.replaceChildren();
 if(!uploadedFiles.length){list.className="empty-state";list.textContent="Noch keine eigenen Dateien ausgewählt. Die vier Beispielbelege auf dem Dashboard sind Demo-Daten.";return}
 list.className="";
 uploadedFiles.forEach(file=>{
  const row=document.createElement("div");row.className="document-row";
  const icon=document.createElement("span");icon.className="receipt-thumb";icon.textContent=file.type==="application/pdf"?"PDF":"IMG";
  const details=document.createElement("div");details.style.minWidth="0";
  const name=document.createElement("b");name.textContent=file.name;
  const meta=document.createElement("small");meta.textContent=(file.size/1024).toFixed(1)+" KB · Noch nicht automatisch ausgelesen";
  details.append(name,meta);row.append(icon,details);list.append(row);
 });
 document.getElementById("metric-documents").textContent=24+uploadedFiles.length;
 document.getElementById("report-documents").textContent=24+uploadedFiles.length;
}
document.getElementById("create-settlement").addEventListener("click",()=>{
 document.getElementById("settlement-feedback").textContent="Ein Demo-Entwurf ist bereits geöffnet. Echte Berechnungen sind noch nicht angebunden.";
});
document.getElementById("print-settlement").addEventListener("click",()=>{
 document.getElementById("settlement-feedback").textContent="Im Druckdialog kannst du „Als PDF sichern“ auswählen. Der Inhalt ist ein Demo-Entwurf.";
 window.print();
});


// Startbildschirm: Logo antippen, Push-Animation abspielen und Dashboard öffnen.
(function(){
 const splash=document.getElementById("splash-screen");
 const startButton=document.getElementById("splash-start");
 if(!splash||!startButton)return;
 document.body.classList.add("splash-open");
 startButton.addEventListener("click",function(){
   if(startButton.classList.contains("pushed"))return;
   startButton.classList.add("pushed");
   splash.classList.add("leaving");
   window.setTimeout(function(){
     splash.remove();
     document.body.classList.remove("splash-open");
     if(typeof showPage==="function")showPage("dashboard");
   },430);
 });
})();
