// ---------- narzędzia strony: wyszukiwanie na stronie, zoom, drukowanie, narzędzia deweloperskie ----------
const curView=()=>{ const t=T(); return t&&views[t.id]||null; };
// podpięcie zdarzeń do karty (wywoływane z mkView)
function guestHooks(t,w){
  w.addEventListener('ipc-message',e=>privGuest(t,w,e));
  w.addEventListener('found-in-page',e=>findResult(t,e.result));
  w.addEventListener('dom-ready',()=>zoomApply(t,w));
  w.addEventListener('did-navigate',()=>{ zoomApply(t,w); if(T()===t) pwHide(); });
}
// --- zoom (osobno dla każdej witryny, zapamiętywany) ---
const ZSTEPS=[.25,.33,.5,.67,.75,.8,.9,1,1.1,1.25,1.5,1.75,2,2.5,3,4,5];
const zoomGet=t=>S.zoom[hostOf(t.url)]||1;
function zoomChip(){ const t=T(), z=t?zoomGet(t):1, b=$('zm'); b.style.display=Math.abs(z-1)<.001?'none':''; b.textContent=Math.round(z*100)+'%'; }
function zoomApply(t,w){ try{ w.setZoomFactor(zoomGet(t)); }catch{} if(T()===t) zoomChip(); }
function zoomSet(f){
  const t=T(), w=curView(); if(!t||!w) return; const h=hostOf(t.url); if(!h) return;
  if(Math.abs(f-1)<.001) delete S.zoom[h]; else S.zoom[h]=f;
  zoomApply(t,w); save();
}
function zoomStep(dir){
  const t=T(); if(!t) return; const c=zoomGet(t); let i=ZSTEPS.reduce((b,x,k)=>Math.abs(x-c)<Math.abs(ZSTEPS[b]-c)?k:b,0);
  i=Math.max(0,Math.min(ZSTEPS.length-1,i+(dir>0?1:-1))); zoomSet(ZSTEPS[i]);
}
$('zm').onclick=()=>zoomSet(1);
// --- wyszukiwanie na stronie ---
const FB={w:null,q:''};
function findOpen(){
  const w=curView(); if(!w) return; FB.w=w; const bar=$('fb'); bar.classList.add('open'); const q=$('fbq'); q.focus(); q.select(); if(q.value) w.findInPage(q.value);
}
function findClose(){ const bar=$('fb'); if(!bar.classList.contains('open')) return; bar.classList.remove('open'); try{ if(FB.w) FB.w.stopFindInPage('clearSelection'); }catch{} FB.w=null; $('fbc').textContent=''; }
function findNext(fwd){ const w=FB.w||curView(); const q=$('fbq').value; if(!w||!q) return; try{ w.findInPage(q,{forward:fwd,findNext:true}); }catch{} }
function findResult(t,r){ if(!r||!FB.w||views[t.id]!==FB.w) return; if(r.finalUpdate) $('fbc').textContent=r.matches?pfmt('{a} z {b}',{a:r.activeMatchOrdinal,b:r.matches}):t_('Brak wyników'); }
const t_=k=>t(k);
$('fbq').addEventListener('input',e=>{ const w=FB.w||curView(); if(!w) return; const q=e.target.value; if(!q){ try{ w.stopFindInPage('clearSelection'); }catch{} $('fbc').textContent=''; } else { try{ w.findInPage(q); }catch{} } });
$('fbq').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); findNext(!e.shiftKey); } else if(e.key==='Escape'){ e.preventDefault(); findClose(); } });
$('fbp').onclick=()=>findNext(false); $('fbn').onclick=()=>findNext(true); $('fbx').onclick=findClose;
// zmiana karty zamyka pasek wyszukiwania i odświeża wskaźnik zoomu
{ const _a=activate; activate=function(id){ findClose(); pwHide(); const r=_a(id); zoomChip(); return r; }; }
// --- skróty ---
Object.assign(ACTS,{
  'find':findOpen,
  'zoom-in':()=>zoomStep(1),'zoom-in-alt':()=>zoomStep(1),'zoom-in-np':()=>zoomStep(1),
  'zoom-out':()=>zoomStep(-1),'zoom-out-np':()=>zoomStep(-1),
  'zoom-reset':()=>zoomSet(1),
  'print':()=>{ const w=curView(); if(w){ try{ w.print(); }catch{} } },
  'devtools':()=>{ const w=curView(); if(w){ try{ w.isDevToolsOpened()?w.closeDevTools():w.openDevTools(); }catch{} } }
});
zoomChip();
