// ---------- pobrane pliki: ikona w górnym pasku, pierścień postępu, okno „Pobrane” (v49) ----------
// Dane wysyła proces główny (downloads.js): zdarzenie dl-evt z jednym rekordem {id,name,path,total,received,state,inc,t}.
// Stany: active (trwa), queued (czeka w kolejce; pobiera się jedno plik naraz), done, cancelled, failed.
var DL=[], DLICO={}, DLOPEN=false, DLSIG='', dlRaf=0, dlBub=0, dlFx=0;
const dlC=2*Math.PI*14.5;
const dlFmt=b=>{ if(!(b>0)) return ''; const u=['B','KB','MB','GB','TB']; let i=0; while(b>=1024&&i<4){ b/=1024; i++; } return (b>=100||i===0?Math.round(b):b.toFixed(1)).toString().replace('.',',')+' '+u[i]; };
const dlPending=()=>DL.filter(r=>r.state==='active'||r.state==='queued');
const dlPct=r=>r.total>0?Math.max(0,Math.min(100,Math.floor(r.received/r.total*100))):-1;
const dlExt=n=>{ const m=/\.([a-z0-9]{1,5})$/i.exec(n||''); return m?m[1].toLowerCase():''; };
function dlRing(){
  const b=$('dlb'); if(!b) return; const p=dlPending(), act=p.find(r=>r.state==='active')||p[0], pc=act?dlPct(act):0;
  b.classList.toggle('dl-act',!!act); b.classList.toggle('dl-ind',!!act&&pc<0);
  b.querySelector('.dlpg').style.strokeDashoffset=(dlC*(1-(pc<0?.28:pc/100))).toFixed(2);
  const bd=b.querySelector('.dlbd'); bd.textContent=p.length>1?String(p.length):''; bd.classList.toggle('on',p.length>1);
  b.title=t('Pobrane')+(act?' – '+(pc>=0?pc+'%':t('Pobieranie')):'');
}
function dlBubble(msg){
  let e=$('dlt'); if(!e){ e=document.createElement('div'); e.id='dlt'; document.body.appendChild(e); e.onclick=()=>{ e.classList.remove('open'); dlToggle(true); }; }
  const r=$('dlb').getBoundingClientRect(); e.style.top=(r.bottom+8)+'px'; e.style.right=Math.max(6,innerWidth-r.right-6)+'px';
  e.innerHTML='<b></b><small></small>'; e.firstChild.textContent=msg; e.lastChild.textContent=t('Kliknij, aby zobaczyć szczegóły');
  e.classList.add('open'); clearTimeout(dlBub); dlBub=setTimeout(()=>e.classList.remove('open'),3600);
}
function dlFx_(cls,ms){ const b=$('dlb'); if(!b) return; b.classList.remove(cls); void b.offsetWidth; b.classList.add(cls); clearTimeout(dlFx); dlFx=setTimeout(()=>b.classList.remove(cls),ms); }
function dlUpsert(r){
  const i=DL.findIndex(x=>x.id===r.id);
  if(i<0){ DL.unshift(r); if(r.state==='active'||r.state==='queued'){ dlFx_('dl-start',1500); if(!DLOPEN) dlBubble((r.state==='queued'?t('Dodano do kolejki'):t('Rozpoczęto pobieranie'))+': '+r.name); } }
  else { const pr=DL[i]; DL[i]=r; if(pr.state!=='done'&&r.state==='done'){ dlFx_('dl-done',1800); } }
  DL.sort((a,b)=>b.t-a.t); dlSched();
}
function dlSched(){ if(dlRaf) return; dlRaf=requestAnimationFrame(()=>{ dlRaf=0; dlRing(); if(DLOPEN) dlRender(); }); }
const FOLD='<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
function dlRowInner(r){
  const pc=dlPct(r), pend=r.state==='active'||r.state==='queued', ico=DLICO[r.id];
  const sub=r.state==='active'?`<div class="dl-pb"><i style="width:${pc<0?30:pc}%"${pc<0?' class="ind"':''}></i></div><span class="dl-pc">${pc<0?'…':pc+'%'}</span>`
    :r.state==='queued'?`<span class="dl-st">${esc(t('W kolejce'))}</span>`
    :r.state==='done'?`<span class="dl-st">${esc(dlFmt(r.total||r.received))}</span>`
    :`<span class="dl-st er">${esc(t(r.state==='cancelled'?'Anulowano':'Nie udało się pobrać'))}</span>`;
  const act=r.state==='done'?`<button class="dl-fold" data-id="${r.id}" title="${esc(t('Pokaż w folderze'))}">${FOLD}</button>`
    :pend?`<button class="dl-x" data-id="${r.id}" title="${esc(t('Anuluj pobieranie'))}">×</button>`
    :`<button class="dl-x rm" data-id="${r.id}" title="${esc(t('Usuń z listy'))}">×</button>`;
  return `<div class="dl-ic">${ico?`<img src="${ico}" alt="">`:`<span>${esc((dlExt(r.name)||'•').slice(0,4))}</span>`}</div>
    <div class="dl-mn" data-id="${r.id}" title="${esc(r.path||r.name)}"><b>${esc(r.name)}</b><div class="dl-sub">${sub}</div></div>${act}`;
}
function dlRender(){
  const l=document.querySelector('#dlp .dll'); if(!l) return; const list=DL.slice(0,60), sig=list.map(r=>r.id+r.state).join('|');
  if(sig!==DLSIG){ DLSIG=sig;
    l.innerHTML=list.length?list.map(r=>`<div class="dl-it ${r.state}" data-id="${r.id}">${dlRowInner(r)}</div>`).join(''):`<p class="dl-em">${esc(t('Brak pobranych plików'))}</p>`;
    list.forEach(r=>{ if(!DLICO[r.id]&&(r.state==='done'||r.state==='active')&&window.api&&window.api.dlIcon) window.api.dlIcon(r.id).then(u=>{ if(!u) return; DLICO[r.id]=u; const el=l.querySelector(`.dl-it[data-id="${r.id}"] .dl-ic`); if(el) el.innerHTML=`<img src="${u}" alt="">`; }).catch(()=>{}); });
  } else list.forEach(r=>{ if(r.state!=='active') return; const it=l.querySelector(`.dl-it[data-id="${r.id}"]`); if(!it) return; const pc=dlPct(r), bar=it.querySelector('.dl-pb i'), tx=it.querySelector('.dl-pc');
    if(bar){ bar.style.width=(pc<0?30:pc)+'%'; bar.classList.toggle('ind',pc<0); } if(tx) tx.textContent=pc<0?'…':pc+'%'; });
  const c=document.querySelector('#dlp .dlh button'); if(c) c.disabled=!DL.some(r=>r.state!=='active'&&r.state!=='queued');
}
function dlToggle(on){
  let p=$('dlp'); if(!p){ p=document.createElement('div'); p.id='dlp'; p.innerHTML='<div class="dlh"><b>Pobrane</b><button id="dlclr">Wyczyść listę</button></div><div class="dll"></div>'; document.body.appendChild(p);
    p.addEventListener('click',e=>{ const t_=e.target, f=t_.closest('.dl-fold'), x=t_.closest('.dl-x'), m=t_.closest('.dl-mn,.dl-ic');
      if(f) window.api.dlShow(f.dataset.id);
      else if(x){ if(x.classList.contains('rm')){ window.api.dlRemove(x.dataset.id); DL=DL.filter(r=>r.id!==x.dataset.id); dlSched(); } else window.api.dlCancel(x.dataset.id); }
      else if(m){ const id=(m.dataset.id||m.parentNode.dataset.id), r=DL.find(z=>z.id===id); if(r&&r.state==='done') window.api.dlOpen(id); }
      else if(t_.id==='dlclr') window.api.dlClear().then(l=>{ const keep=new Set(l.map(r=>r.id)); DL=DL.filter(r=>keep.has(r.id)||r.state==='active'||r.state==='queued'); DLSIG=''; dlSched(); }).catch(()=>{}); }); }
  DLOPEN=on===undefined?!DLOPEN:on; const b=$('dlb'); if(DLOPEN){ const r=b.getBoundingClientRect(); p.style.top=(r.bottom+6)+'px'; p.style.right=Math.max(6,innerWidth-r.right-6)+'px'; const bb=$('dlt'); if(bb) bb.classList.remove('open'); DLSIG=''; dlRender(); }
  p.classList.toggle('open',DLOPEN); b.classList.toggle('on',DLOPEN);
}
(function(){
  const b=$('dlb'); if(!b||!window.api||!window.api.onDl) { if(b) b.style.display='none'; return; }
  b.onclick=()=>dlToggle();
  window.api.onDl(dlUpsert);
  window.api.dlList().then(l=>{ DL=Array.isArray(l)?l.slice().sort((a,c)=>c.t-a.t):[]; dlSched(); }).catch(()=>{});
  document.addEventListener('mousedown',e=>{ if(DLOPEN&&!e.target.closest('#dlp,#dlb')) dlToggle(false); },true);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&DLOPEN) dlToggle(false); });
  addEventListener('blur',()=>{ if(DLOPEN) dlToggle(false); });
  addEventListener('resize',()=>{ if(DLOPEN) dlToggle(true); });
})();
