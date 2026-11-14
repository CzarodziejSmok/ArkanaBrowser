// ---------- karty ----------
S.closed=S.closed||[];
const entering=new Set(), leaving=new Set(), enteringF=new Set(), leavingF=new Set(); let menuOpen=false, dragId=null, dragGone=false, dragSwallow=false, xd=null;
function an(k){ return S.settings.ui.anim[k]; }
function later(k,ms,fn){ if(an(k)) setTimeout(fn,ms); else fn(); }
function mkView(t){
  const w=document.createElement('webview');
  w.setAttribute('allowpopups',''); w.setAttribute('src',t.url); w.style.display='none';
  $('left').appendChild(w); views[t.id]=w; guestHooks(t,w);
  w.addEventListener('dom-ready',()=>{ injG(w); injS(w); try{ w.setAudioMuted(!!t.muted); }catch{} });
  const nv=e=>{ if(e.isMainFrame===false) return; let u=e.url, rw=false;
    try{ const x=new URL(u);   // wyszukiwania Google zawsze w trybie „Web” (udm=14): bez przeglądu AI, Gemini i trybu AI
      if(isG(u)&&x.pathname==='/search'&&!x.searchParams.has('tbm')){ const m=x.searchParams.get('udm'); if(!m||m==='50'){ x.searchParams.set('udm','14'); u=x.toString(); rw=true; try{ w.loadURL(u); }catch{} } } }catch{}
    t.url=u; if(!rw) histAdd(t,u); if(T()===t) setUrlBar(); save(); };
  w.addEventListener('did-navigate',nv); w.addEventListener('did-navigate-in-page',nv);
  w.addEventListener('page-title-updated',e=>{ t.title=e.title; histTitle(t,e.title); renderTabs(); save(); });
  w.addEventListener('page-favicon-updated',e=>{ t.icon=e.favicons[0]; histIcon(t,t.icon); renderTabs(); save(); });
}
function setUrlBar(){
  const t=T(); if(!t||document.activeElement===url) return;
  let v=t.url||''; try{ const u=new URL(v); if(isG(v)&&u.pathname==='/search') v=u.searchParams.get('q')||v; }catch{}
  url.value=v;
}
function activate(id){
  const f=F(); f.active=id; const t=T(); if(!t) return;
  if(t.url&&!views[t.id]) mkView(t);
  for(const k in views) views[k].style.display=(k===id)?'':'none';
  home.style.display=t.url?'none':'flex';
  url.value=''; setUrlBar(); renderTabs(); renderSide(); save();
  if(!t.url&&!editing) $('hs').focus();
}
function newTab(u='',after){
  const t={id:uid(),url:u,title:''}, f=F(), i=after?f.tabs.findIndex(x=>x.id===after):-1;
  if(i>=0) f.tabs.splice(i+1,0,t); else f.tabs.push(t);
  entering.add(t.id); activate(t.id); return t;
}
function dupTab(id){ const o=F().tabs.find(t=>t.id===id); if(!o) return; const n=newTab(o.url,id); n.title=o.title; n.icon=o.icon; n.muted=o.muted; renderTabs(); save(); }
const pushClosed=t=>{ if(t.url){ S.closed.push({url:t.url,title:t.title,icon:t.icon,pinned:t.pinned,muted:t.muted}); if(S.closed.length>15) S.closed.shift(); } };
function closeTab(id){
  const f=F(); if(!f.tabs.some(t=>t.id===id)||leaving.has(id)) return;
  leaving.add(id); renderTabs();
  later('tab',190,()=>{ leaving.delete(id); rmTab(f,id); });
}
function rmTab(f,id,moved){
  const i=f.tabs.findIndex(t=>t.id===id); if(i<0) return; if(!moved) pushClosed(f.tabs[i]);
  if(views[id]){ views[id].remove(); delete views[id]; }
  f.tabs.splice(i,1); const cur=(f===F());
  if(!f.tabs.length){ if(cur) newTab(); else { f.tabs.push({id:uid(),url:'',title:''}); f.active=f.tabs[0].id; save(); } return; }
  if(f.active===id){ const n=f.tabs[Math.min(i,f.tabs.length-1)].id; if(cur) activate(n); else f.active=n; } else if(cur) renderTabs();
  save();
}
function closeAll(){
  const f=F(), ids=f.tabs.map(t=>t.id).filter(id=>!leaving.has(id)); if(!ids.length) return;
  ids.forEach(id=>leaving.add(id)); renderTabs();
  later('tab',200,()=>{
    ids.forEach(id=>{ leaving.delete(id); const i=f.tabs.findIndex(t=>t.id===id); if(i<0) return; pushClosed(f.tabs[i]); if(views[id]){ views[id].remove(); delete views[id]; } f.tabs.splice(i,1); });
    const nt={id:uid(),url:'',title:''}; f.tabs.push(nt);
    if(f===F()){ entering.add(nt.id); activate(nt.id); } else { f.active=nt.id; save(); }
  });
}
function restoreTab(){ const c=S.closed.pop(); if(!c) return; const t=newTab(c.url); Object.assign(t,{title:c.title,icon:c.icon,pinned:c.pinned,muted:c.muted}); renderTabs(); save(); }
function reloadTab(id){ const w=views[id]; if(w) w.reload(); }
function reloadAll(){ F().tabs.forEach(t=>reloadTab(t.id)); }
function pinTab(id){ const t=F().tabs.find(x=>x.id===id); if(!t) return; t.pinned=!t.pinned; entering.add(id); renderTabs(); save(); }
function pinAll(){ const f=F(), v=!f.tabs.every(t=>t.pinned); f.tabs.forEach(t=>{ if(!!t.pinned!==v) entering.add(t.id); t.pinned=v; }); renderTabs(); save(); }
function muteTab(id){ const t=F().tabs.find(x=>x.id===id); if(!t) return; t.muted=!t.muted; try{ views[id]&&views[id].setAudioMuted(t.muted); }catch{} renderTabs(); save(); }
function muteAll(){ const f=F(), v=!f.tabs.every(t=>t.muted); f.tabs.forEach(t=>{ t.muted=v; try{ views[t.id]&&views[t.id].setAudioMuted(v); }catch{} }); renderTabs(); save(); }
function cycle(d){ const f=F(), i=f.tabs.findIndex(t=>t.id===f.active); activate(f.tabs[(i+d+f.tabs.length)%f.tabs.length].id); }
let swBusy=false, rising=false, swPending=null;
function swFolder(id){
  if(swBusy){ swPending=id; return; }          // kliknięcie w trakcie animacji: zapamiętaj ostatni wybór
  if(id===S.cur) return;
  if(!an('tab')||!an('fold')){ switchFolder(id); return; }
  swBusy=true; swPending=null;
  const els=[...$('tabs').children,...$('pinsi').children];
  els.forEach((el,i)=>{ el.classList.remove('rise','ent'); el.style.animation='none'; void el.offsetWidth; el.style.animation=''; el.style.animationDelay=Math.min(i,6)*22+'ms'; el.classList.add('sdn'); });
  setTimeout(()=>{ rising=true; switchFolder(id); swBusy=false;
    if(swPending&&swPending!==S.cur){ const n=swPending; swPending=null; setTimeout(()=>swFolder(n),60); } else swPending=null; },190+Math.min(els.length,7)*22);
}
function switchFolder(id){
  S.cur=id; for(const k in views){ views[k].remove(); delete views[k]; }
  const f=F(); if(!f.tabs.length) f.tabs.push({id:uid(),url:'',title:''});
  activate(f.tabs.find(t=>t.id===f.active)?f.active:f.tabs[0].id);
}
function tabHtml(t,f,pin){
  const cls=(t.id===f.active?' on':'')+(entering.has(t.id)?' ent':'')+(leaving.has(t.id)?' out':'')+(t.id===dragId?' drg'+(dragGone?' gone':''):''), nm=esc(t.title||(t.url?host(t.url):'Nowa karta')),
    ic=t.icon?`<img src="${esc(t.icon)}">`:'<i>✺</i>', mu=t.muted?'<s class="mu">🔇</s>':'';
  return pin?`<div class="pt${cls}" data-id="${t.id}" title="${nm}">${ic}<span>${nm}</span>${mu}</div>`
            :`<div class="tab${cls}" data-id="${t.id}" title="${nm}">${ic}<span>${nm}</span>${mu}<b data-x="${t.id}">×</b></div>`;
}
function renderTabs(){
  const f=F(), pins=f.tabs.filter(t=>t.pinned);
  const un=f.tabs.filter(t=>!t.pinned).map(t=>tabHtml(t,f,0));
  if(xd) un.splice(xd.idx,0,tabHtml({id:'__xd',url:xd.tab.url,title:xd.tab.title,icon:xd.tab.icon},f,0).replace('class="tab','class="tab xd'));
  $('tabs').innerHTML=un.join('');
  $('pinsi').innerHTML=pins.map(t=>tabHtml(t,f,1)).join(''); $('pins').classList.toggle('has',pins.length>0);
  entering.clear(); fitTabs();
  if(rising){ [...$('tabs').children,...$('pinsi').children].forEach((el,i)=>{ el.classList.add('rise'); el.style.animationDelay=Math.min(i,6)*28+'ms'; }); rising=false; }
}
function fitTabs(){ const n=F().tabs.filter(t=>!t.pinned).length; if(!n) return; const w=($('tabs').clientWidth-2*(n-1))/n; $('tabs').classList.toggle('sm',w<110); $('tabs').classList.toggle('xs',w<56); }
new ResizeObserver(fitTabs).observe($('tabs'));
$('tabs').addEventListener('click',e=>{ if(e.target.dataset.x) return closeTab(e.target.dataset.x); const t=e.target.closest('.tab'); if(t) activate(t.dataset.id); });
$('pinsi').addEventListener('click',e=>{ const t=e.target.closest('.pt'); if(t) activate(t.dataset.id); });
$('nt').onclick=()=>newTab();
for(const el of [$('tabs'),$('pinsi')]){
  el.addEventListener('auxclick',e=>{ const t=e.target.closest('.tab,.pt'); if(t&&e.button===1) closeTab(t.dataset.id); });
  el.addEventListener('contextmenu',e=>{ const el2=e.target.closest('.tab,.pt'); if(!el2) return; e.preventDefault(); tabMenu(e,el2.dataset.id); });
}

// ---------- menu kontekstowe ----------
const kbs=a=>{ const k=a&&S.settings.keys[a]; return k?`<span class="mk">${k.split('+').map(x=>`<kbd>${esc(x)}</kbd>`).join('')}</span>`:''; };
function showMenu(x,y,items,pin){
  const m=$('cm');
  m.innerHTML=items.map((it,i)=>it==='sep'?'<div class="ms"></div>':`<div class="mi${it.off?' off':''}" data-i="${i}"><span>${esc(it.l)}</span>${kbs(it.a)}</div>`).join('');
  m._items=items; menuOpen=!!pin; m.classList.add('open');
  const r=m.getBoundingClientRect(); m.style.left=Math.max(6,Math.min(x,innerWidth-r.width-6))+'px'; m.style.top=Math.max(6,Math.min(y,innerHeight-r.height-6))+'px';
  if(pin) $('sidewrap').classList.add('pin');
}
function closeMenu(){ const m=$('cm'); if(!m.classList.contains('open')) return; m.classList.remove('open'); menuOpen=false; $('sidewrap').classList.toggle('pin',!!editing||!!pk); }
$('cm').addEventListener('click',e=>{ const it=e.target.closest('.mi'); if(!it) return; const fn=$('cm')._items[it.dataset.i].f; closeMenu(); fn(); });
document.addEventListener('mousedown',e=>{ if(!$('cm').contains(e.target)) closeMenu(); },true);
addEventListener('blur',closeMenu); addEventListener('resize',closeMenu);
function tabMenu(e,id){
  const f=F(), t=f.tabs.find(x=>x.id===id), allP=f.tabs.every(x=>x.pinned), allM=f.tabs.every(x=>x.muted);
  showMenu(e.clientX,e.clientY,[
    {l:'Nowa karta',a:'new-tab',f:()=>newTab()},
    {l:'Duplikuj kartę',a:'dup-tab',f:()=>dupTab(id)},
    {l:'Odśwież kartę',a:'reload-tab',off:!t.url,f:()=>reloadTab(id)},
    {l:t.pinned?'Odepnij kartę':'Przypnij kartę',a:'pin-tab',f:()=>pinTab(id)},
    {l:t.muted?'Włącz dźwięk karty':'Wycisz kartę',a:'mute-tab',f:()=>muteTab(id)},
    {l:'Zamknij kartę',a:'close-tab',f:()=>closeTab(id)},
    {l:'Przywróć zamkniętą kartę',a:'restore-tab',off:!S.closed.length,f:restoreTab},
    'sep',
    {l:'Zamknij wszystkie karty',a:'close-all',f:closeAll},
    {l:'Odśwież wszystkie karty',a:'reload-all',f:reloadAll},
    {l:allP?'Odepnij wszystkie karty':'Przypnij wszystkie karty',a:'pin-all',f:pinAll},
    {l:allM?'Włącz dźwięk wszystkich kart':'Wycisz wszystkie karty',a:'mute-all',f:muteAll}
  ]);
}

// ---------- foldery ----------
function renderSide(){
  $('fl').innerHTML='<h6>FOLDERY</h6>'+S.folders.map(f=>{
    if(editing===f.id) return `<input class="fi" data-e="${f.id}" value="${esc(f.name)}" maxlength="24">`;
    const cls=(f.id===S.cur?' on':'')+(enteringF.has(f.id)?' ent':'')+(leavingF.has(f.id)?' out':'')+(f.id===dragId?' drg'+(dragGone?' gone':''):'');
    return `<div class="fd${cls}" data-id="${f.id}" title="${esc(f.name)}"><i class="ic">${folderIc(f.icon)}</i><span>${esc(f.name)}</span>${S.folders.length>1?`<div class="ems"><em data-d="${f.id}" title="Usuń folder">×</em></div>`:''}</div>`;
  }).join('')+'<div id="nf" title="Nowy folder"><i class="ic">＋</i><span>Nowy folder</span></div>';
  enteringF.clear(); $('side').scrollLeft=0; $('fl').scrollLeft=0;
  $('sidewrap').classList.toggle('pin',!!editing||!!pk||menuOpen||dragId!==null);
  const i=$('fl').querySelector('.fi');
  if(i){ i.focus({preventScroll:true}); i.select(); let done=false;
    const fin=ok=>{ if(done) return; done=true; const f=S.folders.find(x=>x.id===editing); if(f&&ok&&i.value.trim()) f.name=i.value.trim(); editing=null; renderSide(); save(); };
    i.onkeydown=e=>{ if(e.key==='Enter') fin(true); if(e.key==='Escape') fin(false); }; i.onblur=()=>fin(true); }
}
// wybór ikony folderu
const FIC={folder:'<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',briefcase:'<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3 13h18"/>',home:'<path d="M4 11 12 4l8 7"/><path d="M6 9.5V19a1 1 0 0 0 1 1h3.5v-5.5h3V20H17a1 1 0 0 0 1-1V9.5"/>',gamepad:'<rect x="2.5" y="7" width="19" height="10.5" rx="5"/><path d="M7.5 10.5v3.5M5.8 12.2h3.5M15.5 11.5h.01M18 13.5h.01"/>',music:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',books:'<rect x="3" y="4" width="4.5" height="16" rx="1"/><rect x="8.5" y="4" width="4.5" height="16" rx="1"/><path d="m14.8 6 3.7-1 3 14.2-3.7 1z"/>',brain:'<path d="M12 5v14"/><path d="M12 5a3.5 3.5 0 0 0-6.4 1.8A3.6 3.6 0 0 0 4 10a3.6 3.6 0 0 0 1.4 2.8A3.6 3.6 0 0 0 8 18.5 3.5 3.5 0 0 0 12 19M12 5a3.5 3.5 0 0 1 6.4 1.8A3.6 3.6 0 0 1 20 10a3.6 3.6 0 0 1-1.4 2.8A3.6 3.6 0 0 1 16 18.5 3.5 3.5 0 0 1 12 19"/>',bulb:'<path d="M9.5 17.5h5M10.5 20.5h3"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',laptop:'<rect x="5" y="5" width="14" height="10" rx="1.8"/><path d="M2.5 19h19"/>',cart:'<circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/><path d="M2.5 4h2.7l2.2 11h10.3l2-8H6.2"/>',plane:'<path d="M12 3c1 0 1.6.8 1.6 2v5.5l8 4.5v2l-8-2.2V19l2.2 1.6V22L12 21l-3.8 1v-1.4L10.4 19v-4.2l-8 2.2v-2l8-4.5V5c0-1.2.6-2 1.6-2z"/>',utensils:'<path d="M7 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M9 3v18M17 21V3c-2.2 1.4-3.5 4-3.5 7v3H17"/>',newspaper:'<rect x="3.5" y="4.5" width="14" height="15" rx="2"/><path d="M17.5 8.5h2a1.5 1.5 0 0 1 1.5 1.5v7.5a2 2 0 0 1-2 2M7 9h7M7 12.5h7M7 16h4"/>',graduation:'<path d="m2.5 9.5 9.5-5 9.5 5-9.5 5z"/><path d="M6 11.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M21.5 9.5v6"/>',chat:'<path d="M4 5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-4.5 4v-4H6a2 2 0 0 1-2-2z"/>',star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',heart:'<path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z"/>',flame:'<path d="M12 21c3.9 0 6.5-2.6 6.5-6.3 0-2.4-1.2-4.2-2.8-5.8-.3 1.3-1 2.3-2 2.8.5-3-.8-6-3.7-7.7.1 3.6-3.9 5.1-3.9 10.5C6.1 18.2 8.2 21 12 21z"/>',leaf:'<path d="M5 19c0-8 4-13.5 14.5-14.5.5 10.5-5.5 14.5-12.5 14.5"/><path d="M5 19c2-5 5-8 9-10"/>',palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.9 4.9 0 0 0 22 10.6C22 5.8 17.5 2 12 2z"/>',chart:'<path d="M3.5 3.5v17h17"/><path d="m7 15 3.5-4 3 2.5 5-6.5"/>',lock:'<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'};
const FEMO={"📁":"folder","💼":"briefcase","🏠":"home","🎮":"gamepad","🎵":"music","🎬":"film","📚":"books","🧠":"brain","💡":"bulb","🔧":"wrench","💻":"laptop","🛒":"cart","✈":"plane","🍳":"utensils","📰":"newspaper","🎓":"graduation","💬":"chat","⭐":"star","❤":"heart","🔥":"flame","🌿":"leaf","🎨":"palette","📈":"chart","🔒":"lock"};
const folderIc=ic=>{ ic=ic||'📁'; const k=ic.startsWith('i:')?ic.slice(2):FEMO[ic.replace(/\uFE0F/g,'')]; return FIC[k]?`<svg viewBox="0 0 24 24">${FIC[k]}</svg>`:esc(ic); };

let pk=null;
function closePicker(){ if(pk){ pk.remove(); pk=null; } $('sidewrap').classList.toggle('pin',!!editing||menuOpen); }
function openPicker(fid){
  closePicker();
  const row=document.querySelector(`.fd[data-id="${fid}"]`), r=row?row.getBoundingClientRect():{top:120};
  pk=document.createElement('div'); pk.id='pk'; pk.style.top=Math.max(8,Math.min(r.top,innerHeight-250))+'px';
  pk.innerHTML=Object.keys(FIC).map(k=>`<button data-e="i:${k}"><svg viewBox="0 0 24 24">${FIC[k]}</svg></button>`).join('')+'<input placeholder="własna ikona + Enter">';
  document.body.appendChild(pk); $('sidewrap').classList.add('pin');
  const set=ic=>{ S.folders.find(x=>x.id===fid).icon=ic; closePicker(); renderSide(); save(); };
  pk.onclick=e=>{ const b=e.target.closest('button[data-e]'); if(b) set(b.dataset.e); };
  const inp=pk.querySelector('input'); inp.focus();
  inp.onkeydown=e=>{ if(e.key==='Enter'){ const v=inp.value.trim(); if(v){ const g=[...new Intl.Segmenter().segment(v)][0]; set(g.segment); } } if(e.key==='Escape') closePicker(); };
}
document.addEventListener('mousedown',e=>{ if(pk&&!pk.contains(e.target)) closePicker(); });
addEventListener('blur',closePicker);
for(const el of [$('side'),$('fl'),$('sidewrap')]) el.addEventListener('scroll',()=>{ if(el.scrollLeft) el.scrollLeft=0; });
function dupFolder(id){
  const i=S.folders.findIndex(f=>f.id===id), f=S.folders[i], map={};
  const tabs=f.tabs.map(t=>{ const n={...t,id:uid()}; map[t.id]=n.id; return n; });
  const nf={id:uid(),name:f.name+' ('+t('kopia')+')',icon:f.icon||'📁',tabs,active:map[f.active]||(tabs[0]&&tabs[0].id)||null};
  S.folders.splice(i+1,0,nf); enteringF.add(nf.id); renderSide(); save();
}
function addFolder(){ const f={id:uid(),name:t('Folder')+' '+(S.folders.length+1),icon:'📁',tabs:[],active:null}; S.folders.push(f); editing=f.id; enteringF.add(f.id); switchFolder(f.id); }
function cycleF(d){ const i=S.folders.findIndex(f=>f.id===S.cur); swFolder(S.folders[(i+d+S.folders.length)%S.folders.length].id); }
$('fl').addEventListener('click',e=>{
  const d=e.target.dataset;
  if(e.target.closest('#nf')) return addFolder();
  if(d.d){ const f=S.folders.find(x=>x.id===d.d);
    const del=()=>{ leavingF.add(f.id); renderSide();
      later('fold',230,()=>{ leavingF.delete(f.id); S.folders=S.folders.filter(x=>x.id!==f.id); if(S.cur===f.id) switchFolder(S.folders[0].id); else { renderSide(); save(); } }); };
    if(f.tabs.every(t=>!t.url)) del();   // wszystkie karty to menu główne – bez ostrzeżenia
    else ask(t('Usunąć folder „{n}”?').replace('{n}',f.name),t('Wszystkie karty z tego folderu ({n}) zostaną zamknięte. Tej operacji nie można cofnąć.').replace('{n}',f.tabs.length),'Usuń').then(ok=>{ if(ok) del(); });
    return; }
  const el=e.target.closest('.fd'); if(el&&el.dataset.id&&el.dataset.id!==S.cur) swFolder(el.dataset.id);
});
$('fl').addEventListener('dblclick',e=>{ const el=e.target.closest('.fd'); if(el&&el.dataset.id){ editing=el.dataset.id; renderSide(); } });
$('fl').addEventListener('contextmenu',e=>{
  const el=e.target.closest('.fd'); if(!el) return; e.preventDefault();
  const id=el.dataset.id, cur=id===S.cur;
  showMenu(e.clientX,e.clientY,[
    {l:'Zmień ikonę',f:()=>openPicker(id)},
    {l:'Zmień nazwę',a:cur&&'rename-folder',f:()=>{ editing=id; renderSide(); }},
    {l:'Duplikuj folder',a:cur&&'dup-folder',f:()=>dupFolder(id)}
  ],true);
});

