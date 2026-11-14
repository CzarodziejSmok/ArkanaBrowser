// ---------- przeciąganie kart i folderów: zmiana kolejności / oderwanie do nowego okna ----------
function flipRun(cfg,fn){
  const c=cfg.container(), old=new Map([...c.querySelectorAll(cfg.sel)].map(x=>[x.dataset.id,x.getBoundingClientRect()]));
  fn();
  c.querySelectorAll(cfg.sel).forEach(x=>{ const o=old.get(x.dataset.id); if(!o||x.dataset.id===cfg.id) return;
    const n=x.getBoundingClientRect(), d=cfg.axis==='x'?o.left-n.left:o.top-n.top; if(!d) return;
    x.style.transition='none'; x.style.transform=cfg.axis==='x'?`translateX(${d}px)`:`translateY(${d}px)`; void x.offsetWidth;
    x.style.transition='transform .22s cubic-bezier(.2,.8,.3,1)'; x.style.transform=''; setTimeout(()=>{ x.style.transition=''; },260); });
}
function startItemDrag(e,cfg){
  if(e.button!==0) return;
  const el0=cfg.item(); if(!el0) return;
  const r0=el0.getBoundingClientRect(), sx=e.clientX, sy=e.clientY, orig=cfg.order(), w=Math.max(r0.width,120), h=r0.height, offX=Math.min(sx-r0.left,w-8), offY=sy-r0.top;
  let started=false, ghost=null, mode='bar', snapUntil=0, over=false;
  const setGone=v=>{ dragGone=v; const it=cfg.item(); if(it) it.classList.toggle('gone',v); };
  const pos=ev=>{
    const z=cfg.zone().getBoundingClientRect(), rg=cfg.range().getBoundingClientRect();
    const dist=Math.max(z.left-ev.clientX,0,ev.clientX-z.right,z.top-ev.clientY,ev.clientY-z.bottom);
    if(mode==='bar'&&dist>44&&cfg.canDetach()){ mode='free'; setGone(true); snapUntil=performance.now()+180; }
    else if(mode==='free'&&dist<16){ mode='bar'; setGone(false); snapUntil=performance.now()+180; }
    let gx,gy;
    if(mode==='free'){ gx=ev.clientX-offX; gy=ev.clientY-offY; }
    else if(cfg.axis==='x'){ gx=clamp(ev.clientX-offX,rg.left,Math.max(rg.left,rg.right-w)); gy=z.top-5; }   // zablokowana w pionie, lekko uniesiona
    else { gx=rg.left+6; gy=clamp(ev.clientY-offY,rg.top,Math.max(rg.top,rg.bottom-h)); }
    ghost.style.transition=performance.now()<snapUntil?'left .16s,top .16s':'none'; ghost.style.left=gx+'px'; ghost.style.top=gy+'px';
    if(cfg.xmove){ if(mode==='free') cfg.xmove(ev).then(o=>{ over=!!o; if(ghost) ghost.style.visibility=o?'hidden':''; }); else if(over){ over=false; cfg.xend(); ghost.style.visibility=''; } }
    if(mode==='bar'){
      const all=[...cfg.container().querySelectorAll(cfg.sel)], others=all.filter(x=>x.dataset.id!==cfg.id), center=cfg.axis==='x'?gx+w/2:gy+h/2;
      let idx=0; others.forEach(x=>{ const r=x.getBoundingClientRect(); if((cfg.axis==='x'?r.left+r.width/2:r.top+r.height/2)<center) idx++; });
      if(idx!==all.findIndex(x=>x.dataset.id===cfg.id)) flipRun(cfg,()=>cfg.move(cfg.id,idx));
    }
  };
  const mv=ev=>{
    if(!started){ if(Math.hypot(ev.clientX-sx,ev.clientY-sy)<5) return; started=true;
      ghost=el0.cloneNode(true); ghost.classList.remove('on','ent','rise','sdn','out','drg','gone'); ghost.classList.add('gh'); ghost.style.width=w+'px'; ghost.style.height=h+'px';
      document.body.appendChild(ghost); dragId=cfg.id; el0.classList.add('drg'); document.body.classList.add('dragging','dg'); if(cfg.start) cfg.start(); }
    pos(ev); };
  const finish=()=>{ removeEventListener('mousemove',mv); removeEventListener('mouseup',up); document.removeEventListener('keydown',kd,true);
    if(started){ dragId=null; dragGone=false; document.body.classList.remove('dragging','dg'); cfg.rerender(); dragSwallow=true; setTimeout(()=>{ dragSwallow=false; },150); save(); } };
  const up=ev=>{
    if(!started) return finish();
    if(mode==='free'&&cfg.canDetach()){ ghost.remove(); finish(); (cfg.drop?cfg.drop(ev):Promise.resolve(false)).then(ok=>{ if(!ok) cfg.detach(ev); }); return; }
    const it=cfg.item(), rr=it.getBoundingClientRect(), g=ghost; g.style.transition='left .16s,top .16s'; g.style.left=rr.left+'px'; g.style.top=rr.top+'px'; setTimeout(()=>g.remove(),170); finish(); };
  const kd=ev=>{ if(ev.key==='Escape'&&started){ ev.stopPropagation(); mode='bar'; if(cfg.xend) cfg.xend(); cfg.setOrder(orig); ghost.remove(); finish(); } };
  addEventListener('mousemove',mv); addEventListener('mouseup',up); document.addEventListener('keydown',kd,true);
}
function tabDrag(e,id,pinned){
  const cont=()=>pinned?$('pinsi'):$('tabs'), grp=()=>F().tabs.filter(t=>!!t.pinned===pinned);
  const setGroup=ids=>{ const f=F(), m=new Map(f.tabs.map(t=>[t.id,t])), slots=f.tabs.map((t,i)=>!!t.pinned===pinned?i:-1).filter(i=>i>=0); slots.forEach((sl,k)=>{ f.tabs[sl]=m.get(ids[k]); }); };
  startItemDrag(e,{id,axis:'x',sel:pinned?'.pt:not(.out)':'.tab:not(.out)',container:cont,zone:()=>pinned?$('pins'):$('tabrow'),range:cont,
    item:()=>cont().querySelector(`[data-id="${id}"]`),order:()=>grp().map(t=>t.id),setOrder:setGroup,
    move:(tid,idx)=>{ const ids=grp().map(t=>t.id).filter(x=>x!==tid); ids.splice(idx,0,tid); setGroup(ids); renderTabs(); },
    rerender:renderTabs,canDetach:()=>true,detach:ev=>detachTab(id,ev),
    xmove:ev=>{ try{ return window.api.xdMove({sx:ev.screenX,sy:ev.screenY,zone:dropZone(),tab:tabPayload(id)}).catch(()=>false); }catch{ return Promise.resolve(false); } },
    xend:()=>{ try{ window.api.xdEnd(); }catch{} },
    drop:async ev=>{ try{ const ok=await window.api.xdDrop({sx:ev.screenX,sy:ev.screenY,zone:dropZone(),tab:tabPayload(id)}); if(ok) closeAfterMove(id); return !!ok; }catch{ return false; } }});
}
const dropZone=()=>Math.round(Math.max($('tabrow').getBoundingClientRect().bottom,$('pins').getBoundingClientRect().bottom));   // dół paska kart (i przypiętych) względem okna
const tabPayload=id=>{ const t=F().tabs.find(x=>x.id===id); return t?{url:t.url,title:t.title,icon:t.icon,muted:t.muted}:null; };
function closeAfterMove(id){   // karta trafiła do innego okna: usuń ją tutaj, a jeśli była jedyna – zamknij to okno
  const f=F(), only=S.folders.length===1&&f.tabs.length===1; rmTab(f,id,true);
  if(only) setTimeout(()=>{ try{ window.api.winCtl('close'); }catch{} },80);
}
function xdHandle(m){    // komunikaty o karcie przeciąganej z innego okna nad to okno
  if(m.kind==='end'){ if(xd){ xd=null; renderTabs(); } return; }
  if(!m.tab||dragId!==null) return;
  if(m.kind==='over'){
    let idx=0; $('tabs').querySelectorAll('.tab:not(.xd)').forEach(x=>{ const r=x.getBoundingClientRect(); if(r.left+r.width/2<m.cx) idx++; });
    if(!xd||xd.idx!==idx||xd.tab.url!==m.tab.url) flipRun({id:'__xd',axis:'x',sel:'.tab',container:()=>$('tabs')},()=>{ xd={tab:m.tab,idx}; renderTabs(); });
  } else if(m.kind==='drop'){
    const f=F(), un=f.tabs.filter(t=>!t.pinned), idx=xd?xd.idx:un.length; xd=null;
    const nt={id:uid(),url:m.tab.url,title:m.tab.title,icon:m.tab.icon,muted:m.tab.muted}, before=un[idx];
    f.tabs.splice(before?f.tabs.indexOf(before):f.tabs.length,0,nt); entering.add(nt.id); activate(nt.id);
  }
}
function folderDrag(e,id){
  const setF=ids=>{ const m=new Map(S.folders.map(f=>[f.id,f])); S.folders=ids.map(i=>m.get(i)); };
  startItemDrag(e,{id,axis:'y',sel:'.fd[data-id]:not(.out)',container:()=>$('fl'),zone:()=>$('side'),range:()=>$('fl'),
    item:()=>$('fl').querySelector(`.fd[data-id="${id}"]`),order:()=>S.folders.map(f=>f.id),setOrder:setF,
    move:(fid,idx)=>{ const ids=S.folders.map(f=>f.id).filter(x=>x!==fid); ids.splice(idx,0,fid); setF(ids); renderSide(); },
    rerender:renderSide,canDetach:()=>S.folders.length>1,detach:ev=>detachFolder(id,ev),start:()=>$('sidewrap').classList.add('pin')});
}
function openWindow(folder,ev,ox,oy){
  const st={folders:[folder],cur:folder.id,panel:false,pw:S.pw,closed:[],settings:JSON.parse(JSON.stringify(S.settings)),aw:{open:[],pos:{},links:[],data:{}}};
  st.settings.apps.on=false;    // aplikacje (notatki, historia) zostają w oknie głównym
  try{ window.api.detach({state:st,x:ev.screenX-ox,y:ev.screenY-oy}); return true; }catch{ toast(t('Brak obsługi – podmień main.js i preload.js na nowe.')); return false; }
}
function detachTab(id,ev){
  const f=F(), tb=f.tabs.find(x=>x.id===id); if(!tb) return;
  const nt={...tb}; delete nt.pinned;
  if(openWindow({id:uid(),name:f.name,icon:f.icon||'📁',tabs:[nt],active:nt.id},ev,110,66)) rmTab(f,id,true);
}
function detachFolder(id,ev){
  if(S.folders.length<2) return; const f=S.folders.find(x=>x.id===id); if(!f) return;
  if(!openWindow(JSON.parse(JSON.stringify(f)),ev,26,150)) return;
  S.folders=S.folders.filter(x=>x.id!==id); if(S.cur===id) switchFolder(S.folders[0].id); else { renderSide(); save(); }
}
$('tabs').addEventListener('mousedown',e=>{ const el=e.target.closest('.tab'); if(!el||e.target.dataset.x||el.classList.contains('out')) return; tabDrag(e,el.dataset.id,false); });
$('pinsi').addEventListener('mousedown',e=>{ const el=e.target.closest('.pt'); if(el&&!el.classList.contains('out')) tabDrag(e,el.dataset.id,true); });
$('fl').addEventListener('mousedown',e=>{ const el=e.target.closest('.fd'); if(!el||!el.dataset.id||e.target.closest('.ems')||el.classList.contains('out')) return; folderDrag(e,el.dataset.id); });
document.addEventListener('click',e=>{ if(dragSwallow){ e.stopPropagation(); e.preventDefault(); } },true);

// ===== ZADANIE 2: ikona na pasku zadań rysowana w kolorach motywu =====
