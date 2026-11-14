// ---------- historia przeglądania ----------
const HSTEPS=[1,3,7,14,30,60,90,180,365,730,0];   // dni przechowywania; 0 = bez limitu (skrajne prawe ustawienie suwaka)
let HIST=[], hReady=false, hTimer=0, hPrune=0, hLimit=200, hQ='', hdT=0; const hcur=new Map();   // HIST: wpisy {i,t,u,ti,ic} od najstarszego; hcur: karta -> bieżący wpis
if(SEC) document.body.classList.add('sec');
const HDB={ db:null,   // historia leży w IndexedDB (nie w S), żeby zapis stanu po każdej nawigacji nie rósł z historią
  open(){ return new Promise((res,rej)=>{ const r=indexedDB.open('cb-hist',1); r.onupgradeneeded=()=>r.result.createObjectStore('k'); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); },
  async load(){ try{ this.db=await this.open(); return await new Promise(res=>{ const q=this.db.transaction('k').objectStore('k').get('h'); q.onsuccess=()=>res(Array.isArray(q.result)?q.result:[]); q.onerror=()=>res([]); }); }catch{ return []; } },
  put(a){ if(!this.db) return; try{ this.db.transaction('k','readwrite').objectStore('k').put(a,'h'); }catch{} } };
const histDays=()=>HSTEPS[Math.min(HSTEPS.length-1,Math.max(0,S.settings.hist.step|0))];
function histSave(){ if(SEC||!hReady) return; clearTimeout(hTimer); hTimer=setTimeout(()=>HDB.put(HIST),1500); }
function histPrune(){ const d=histDays(); hPrune=Date.now(); if(!d) return; const lim=hPrune-d*864e5; HIST=HIST.filter(x=>x.t>=lim); }
// dopasowanie wpisu z listy pomijanych: z kropką, ukośnikiem lub dwukropkiem (www., https://, google.com) = fragment całego adresu;
// samo słowo = fragment nazwy hosta przed końcówką (.com, .pl, .co.uk), więc „zwierzaki” łapie www.zwierzaki.com, ale nie szkola.com/zwierzaki
const H2L=new Set(['co','com','org','net','gov','edu','ac','or','ne','go']);
function histName(host){ const l=host.toLowerCase().split('.'); let n=l.length; if(n>1){ n--; if(n>1&&l[n].length===2&&H2L.has(l[n-1])) n--; } return l.slice(0,n).join('.'); }
function histMatch(e,u){ e=String(e).trim().toLowerCase(); if(!e) return false;
  try{ if(isG(u)){ const x=new URL(u); if(x.pathname==='/search'&&(x.searchParams.get('q')||'').toLowerCase().includes(e)) return true; } }catch{}   // hasło wyszukiwane w Google też podlega liście
  if(/[\/:.]/.test(e)) return u.toLowerCase().includes(e);
  try{ return histName(new URL(u).hostname).includes(e); }catch{ return false; } }
const histSkipped=u=>S.settings.hist.skip.some(e=>histMatch(e,u));
function histDirty(){ clearTimeout(hdT); hdT=setTimeout(()=>{ if($('hist').classList.contains('open')) histRender(); },250); }
function histAdd(tb,u){
  if(SEC||!S.settings.hist.on||!/^https?:/i.test(u)||histSkipped(u)){ hcur.delete(tb.id); return; }
  const now=Date.now(), last=HIST[HIST.length-1];
  if(last&&last.u===u&&now-last.t<30000){ hcur.set(tb.id,last); return; }   // odświeżenia, przekierowania i zdarzenia in-page tej samej strony
  const e={i:uid(),t:now,u,ti:'',ic:''}; HIST.push(e); hcur.set(tb.id,e);
  if(now-hPrune>36e5) histPrune();
  histSave(); histDirty();
}
function histTitle(tb,ti){ const e=hcur.get(tb.id); if(e&&e.u===tb.url&&e.ti!==ti){ e.ti=ti; histSave(); histDirty(); } }
function histIcon(tb,ic){ const e=hcur.get(tb.id); if(e&&e.u===tb.url&&ic&&e.ic!==ic){ e.ic=ic; histSave(); histDirty(); } }
if(!SEC){ const bt=bootTask('Wczytywanie historii…'); HDB.load().then(a=>{ HIST=a.concat(HIST); hReady=true; histPrune(); histSave(); bt(); }); }
const hFmt=ms=>new Date(ms).toLocaleTimeString(IL(),{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function hDay(ms){ const d=new Date(ms), n=new Date(), z=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate());
  const df=Math.round((z(n)-z(d))/864e5); if(df===0) return t('Dzisiaj'); if(df===1) return t('Wczoraj');
  const s=d.toLocaleDateString(IL(),{weekday:'long',day:'numeric',month:'long',...(d.getFullYear()!==n.getFullYear()?{year:'numeric'}:{})}); return s.charAt(0).toUpperCase()+s.slice(1); }
function histRow(e){ let host=''; try{ host=new URL(e.u).hostname; }catch{}
  const ti=e.ti||e.u.replace(/^https?:\/\/(www\.)?/i,'');
  return `<div class="hr" data-i="${e.i}" title="${esc(e.u)}"><span class="ht">${hFmt(e.t)}</span><span class="hi">${e.ic?`<img src="${esc(e.ic)}" alt="">`:'🌐'}</span><span class="hti">${esc(ti)}</span><span class="hd">${esc(host)}</span><button class="hx" title="${esc(t('Usuń z historii'))}">×</button></div>`; }
function histRender(){
  const L=$('hl'), top=L.scrollTop, q=hQ.trim().toLowerCase(), rows=[];
  for(let i=HIST.length-1;i>=0;i--){ const e=HIST[i]; if(!q||(e.ti+' '+e.u).toLowerCase().includes(q)) rows.push(e); }
  if(!rows.length){ L.innerHTML=`<div class="hem">${esc(t(HIST.length?'Brak wyników.':'Historia jest pusta.'))}</div>`; return; }
  let h='', day='', n=0;
  for(const e of rows){ if(n>=hLimit) break; const dk=new Date(e.t).toDateString(); if(dk!==day){ day=dk; h+=`<h4>${esc(hDay(e.t))}</h4>`; } h+=histRow(e); n++; }
  if(rows.length>n) h+=`<button class="hmore" id="hmore">${esc(t('Pokaż więcej'))}</button>`;
  L.innerHTML=h; L.scrollTop=top;
}
function histOpen(u,nt){ if(nt){ newTab(u); return; } const tb=T(); tb.url=u; if(views[tb.id]) views[tb.id].setAttribute('src',u); activate(tb.id); toggleHist(false); }
function histDel(id,row){ const fin=()=>{ const k=HIST.findIndex(x=>x.i===id); if(k>=0) HIST.splice(k,1); histSave(); histRender(); };
  if(row&&an('panel')){ row.classList.add('rm'); setTimeout(fin,200); } else fin(); }
function toggleHist(v){ const el=$('hist'), o=v===undefined?!el.classList.contains('open'):v; if(o===el.classList.contains('open')) return;
  el.classList.toggle('open',o); document.body.classList.toggle('hist-open',o); $('hbtn').classList.toggle('on',o);
  if(o){ hLimit=200; hQ=''; $('hq').value=''; histRender(); setTimeout(()=>$('hq').focus(),60); } }
$('hbtn').onclick=()=>toggleHist();
$('hq').addEventListener('input',e=>{ hQ=e.target.value; hLimit=200; histRender(); });
$('hclr').onclick=()=>ask('Wyczyścić całą historię?','Tej operacji nie można cofnąć.','Wyczyść').then(ok=>{ if(ok){ HIST=[]; hcur.clear(); HDB.put(HIST); histRender(); } });
$('hset').onclick=()=>{ toggleHist(false); setTab='hist'; toggleSet(true); };
$('hl').addEventListener('click',e=>{ if(e.target.id==='hmore'){ hLimit+=200; histRender(); return; }
  const r=e.target.closest('.hr'); if(!r) return; const id=r.dataset.i;
  if(e.target.closest('.hx')){ histDel(id,r); return; }
  const en=HIST.find(x=>x.i===id); if(en) histOpen(en.u,e.ctrlKey||e.metaKey); });
$('hl').addEventListener('auxclick',e=>{ if(e.button!==1) return; const r=e.target.closest('.hr'); const en=r&&HIST.find(x=>x.i===r.dataset.i); if(en) histOpen(en.u,true); });
$('hl').addEventListener('error',e=>{ if(e.target.tagName==='IMG') e.target.replaceWith(Object.assign(document.createElement('span'),{textContent:'🌐'})); },true);
document.addEventListener('mousedown',e=>{ if($('hist').classList.contains('open')&&!e.target.closest('#hist,#hbtn')) toggleHist(false); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('hist').classList.contains('open')) toggleHist(false); });
// lista stron pomijanych (ustawienia → Interfejs → Historia)
const hkChips=()=>S.settings.hist.skip.map((s,i)=>`<span class="chp">${esc(s)}<button data-hkd="${i}" title="Usuń">×</button></span>`).join('');
function hkAdd(){ const inp=$('hkin'); if(!inp) return; const v=inp.value.trim(), H=S.settings.hist; if(!v) return; inp.value='';
  if(H.skip.some(x=>x.toLowerCase()===v.toLowerCase())) return; H.skip.push(v);
  const n=HIST.length; HIST=HIST.filter(x=>!histMatch(v,x.u)); const r=n-HIST.length;
  if(r){ histSave(); histDirty(); toast(t('Usunięto wpisów: {n}').replace('{n}',r)); }
  $('hkl').innerHTML=hkChips(); save(); }
$('set').addEventListener('click',e=>{ const el=e.target;
  if(el.id==='hkadd') hkAdd();
  else if(el.dataset&&el.dataset.hkd!==undefined){ S.settings.hist.skip.splice(+el.dataset.hkd,1); $('hkl').innerHTML=hkChips(); save(); } });
$('set').addEventListener('keydown',e=>{ if(e.target.id==='hkin'&&e.key==='Enter'){ e.preventDefault(); hkAdd(); } });

