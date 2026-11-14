// ---------- import z innych przeglądarek (importer.js w procesie głównym) ----------
const IMP={list:null,note:'',sel:'',o:{bm:true,hist:true,en:true,ck:true},busy:false,res:null};
const impHue=x=>[...x].reduce((a,c)=>(a*31+c.charCodeAt(0))%360,7);
const impF=(k,m)=>t(k).replace(/\{(\w)\}/g,(_,c)=>m[c]);
function impRender(){
  const el=$('imp'), L=IMP.list, P=(L||[]).find(p=>p.id===IMP.sel), file=IMP.sel==='file', has=k=>file?k==='bookmarks':!P||P.has[k];
  const card=(id,hue,ic,name,sub)=>`<div class="impb${IMP.sel===id?' on':''}" data-id="${esc(id)}"><i class="impi" style="--h:${hue}">${esc(ic)}</i><span><b>${esc(name)}</b><small>${esc(sub)}</small></span><u></u></div>`;
  let body;
  if(IMP.res) body=`<h5 class="impl">Wynik importu</h5><div class="impr">${IMP.res.map(r=>`<p class="${r.ok?'ok':'bad'}">${esc(r.text)}</p>`).join('')}</div><div class="impf"><button id="impx" class="impp">Gotowe</button></div>`;
  else {
    const HK={bm:'bookmarks',hist:'history',en:'engine',ck:'cookies'}, row=(k,lbl)=>`<label class="ck${has(HK[k])?'':' dis'}"><input type="checkbox" data-o="${k}" ${IMP.o[k]&&has(HK[k])?'checked':''} ${has(HK[k])?'':'disabled'}><span class="tg"></span>${lbl}</label>`;
    body=`<p class="hint">Przenieś zakładki, historię i zalogowane sesje. Hasła, rozszerzenia i inne ustawienia innych przeglądarek nie są importowane.</p>
    <h5 class="impl">Znalezione przeglądarki</h5>
    <div class="impls">${L===null?'<p class="hint">Szukam przeglądarek...</p>':(L.map(p=>card(p.id,impHue(p.kind==='firefox'?'ff':p.id.split('|')[0]),p.browser.replace(/^(Google|Microsoft|Mozilla)\s/,'')[0],p.browser,p.profile||'')).join('')+(IMP.note?`<p class="hint warn">${esc(IMP.note)}</p>`:'')+(L.length?'':'<p class="hint">Nie znaleziono przeglądarek. Użyj pliku zakładek (HTML) wyeksportowanego z dowolnej przeglądarki.</p>'))}
    <div class="impb" data-act="folder"><i class="impi" style="--h:30">+</i><span><b>Wskaż folder profilu...</b><small>Gdy Twojej przeglądarki nie ma na liście (np. Opera GX w innej lokalizacji).</small></span><u></u></div>
    <div class="impb${file?' on':''}" data-id="file"><i class="impi" style="--h:200">⌗</i><span><b>Plik zakładek (HTML)</b><small>Eksport z dowolnej przeglądarki, także Safari.</small></span><u></u></div></div>
    ${IMP.sel?`<h5 class="impl">Co przenieść</h5>${row('bm','Zakładki')}${file?'':row('hist','Historia')+row('en','Wyszukiwarka domyślna')+row('ck','Ciasteczka (zalogowane sesje)')}
    <p class="hint">Każdy folder zakładek trafi do osobnego folderu Arkany; strony ładują się dopiero po kliknięciu.</p>
    ${file?'':'<p class="hint warn">Zamknij wybraną przeglądarkę (także w zasobniku systemowym), inaczej jej bazy danych mogą być zablokowane.</p>'}
    ${!file&&IMP.o.ck?'<p class="hint warn">Ciasteczka zawierają dane logowania. Importuj tylko ze swojego profilu.</p>':''}`:''}
    <div class="impf"><button id="impx">Zamknij</button><button id="impgo" class="impp" ${IMP.sel&&!IMP.busy?'':'disabled'}>${IMP.busy?'Importuję...':'Importuj'}</button></div>`;
  }
  el.innerHTML=`<div class="impc"><div class="sh"><b>Import z innej przeglądarki</b><button id="impc" ${IMP.busy?'disabled':''}>x</button></div>${body}</div>`;
}
async function impOpen(){
  IMP.res=null; IMP.busy=false; $('imp').classList.add('open'); impRender();
  if(IMP.list===null){ try{ IMP.list=(await window.api.importDetect())||[]; }catch{ IMP.list=[]; } if(IMP.list.length&&!IMP.sel) IMP.sel=IMP.list[0].id; impRender(); }
}
function impEngine(e){ const se=S.settings.search; if(e.preset&&SE[e.preset]) se.engine=e.preset; else { se.engine='custom'; se.custom=e.url; } save(); return e.preset&&SE[e.preset]?SE[e.preset].n:(e.name||e.url); }
async function impPickFolder(){
  let r; try{ r=await window.api.importFolder(); }catch{ r=null; } if(!r||r.canceled) return;
  IMP.list=IMP.list||[];
  if(!r.ok||!r.list||!r.list.length){ IMP.note=t('W tym folderze nie znaleziono danych przeglądarki.'); impRender(); return; }
  IMP.note=''; for(const p of r.list) if(!IMP.list.some(y=>y.id===p.id)) IMP.list.push(p); IMP.sel=r.list[0].id; impRender();
}
function impClose(){ if(IMP.busy) return; $('imp').classList.remove('open'); }
function impBookmarks(tree,label){
  let pages=0, folders=0;
  const roleName={bar:'Pasek zakładek',other:'Inne zakładki',mobile:'Zakładki mobilne',menu:'Menu zakładek',html:'Zakładki'};
  const put=(name,urls)=>{ if(!urls.length) return; let f=S.folders.find(x=>x.name===name); if(!f){ f={id:uid(),name,icon:'i:folder',tabs:[],active:null}; S.folders.push(f); folders++; }
    const have=new Set(f.tabs.map(x=>x.url)); for(const u of urls) if(!have.has(u.url)){ f.tabs.push({id:uid(),url:u.url,title:u.name||''}); have.add(u.url); pages++; } };
  const walk=(n,path)=>{ put(path,n.children.filter(c=>c.t==='u')); n.children.filter(c=>c.t==='f').forEach(c=>walk(c,path+' / '+c.name)); };
  tree.forEach(r=>walk(r,label+': '+((r.role==='html'&&r.name)?r.name:t(roleName[r.role]||'Zakładki'))));
  renderSide(); save(); return {pages,folders};
}
function impHistory(list){
  const d=histDays(), lim=d?Date.now()-d*864e5:0, have=new Set(HIST.map(x=>x.u+'|'+x.t)); let n=0;
  for(const h of list){ if(h.t<lim||histSkipped(h.u)) continue; const k=h.u+'|'+h.t; if(have.has(k)) continue; have.add(k); HIST.push({i:uid(),t:h.t,u:h.u,ti:h.ti||'',ic:''}); n++; }
  HIST.sort((a,b)=>a.t-b.t); if(n){ histSave(); histDirty(); } return n;
}
async function impRun(){
  if(!IMP.sel||IMP.busy) return; IMP.busy=true; impRender(); const file=IMP.sel==='file', P=(IMP.list||[]).find(p=>p.id===IMP.sel), out=[];
  let r; try{ r=file?await window.api.importHtml():await window.api.importRun(IMP.sel,{bookmarks:IMP.o.bm,history:IMP.o.hist,engine:IMP.o.en,cookies:IMP.o.ck}); }catch(e){ r={ok:false,err:String((e&&e.message)||e)}; }
  IMP.busy=false;
  if(r&&r.canceled){ impRender(); return; }
  const label=file?'HTML':P?P.browser:'', E=(k,e)=>e==='locked'?t('baza jest zablokowana, zamknij przeglądarkę i spróbuj ponownie'):e;
  if(!r||r.ok===false){ out.push({ok:false,text:t('Błąd')+': '+(r&&r.err||'?')}); }
  else {
    const er=r.errors||{};
    if(r.bookmarks){ const b=impBookmarks(r.bookmarks,label); out.push({ok:true,text:b.pages?impF('Zakładki: {n} stron w {m} nowych folderach',{n:b.pages,m:b.folders}):t('Zakładki: brak nowych stron.')}); }
    if(er.bookmarks) out.push({ok:false,text:t('Zakładki')+': '+E('bm',er.bookmarks)});
    if(r.history){ const n=impHistory(r.history); out.push({ok:true,text:n?impF('Historia: dodano {n} wpisów',{n}):t('Historia: brak nowych wpisów.')}); }
    if(er.history) out.push({ok:false,text:t('Historia')+': '+E('h',er.history)});
    if(r.engine) out.push({ok:true,text:impF('Wyszukiwarka: ustawiono {n}',{n:impEngine(r.engine)})});
    else if(IMP.o.en&&!file&&P&&P.has.engine&&!er.engine) out.push({ok:true,text:t('Wyszukiwarka: używasz domyślnej, nic do przeniesienia.')});
    if(er.engine) out.push({ok:false,text:t('Wyszukiwarka')+': '+E('e',er.engine)});
    if(r.cookies){ out.push({ok:true,text:impF('Ciasteczka: zaimportowano {n}, pominięto {s}',{n:r.cookies.imported,s:r.cookies.skipped})}); if(r.cookies.unsupported) out.push({ok:false,text:impF('Część ciasteczek jest chroniona szyfrowaniem aplikacyjnym (nowszy Chrome) i nie da się jej przenieść: {n}.',{n:r.cookies.unsupported})}); }
    if(er.cookies) out.push({ok:false,text:t('Ciasteczka')+': '+E('c',er.cookies)});
    if(!out.length) out.push({ok:false,text:t('Zakładki: brak nowych stron.')});
    if(out.some(x=>x.ok)){ S.settings.imp.hint=false; save(); document.body.classList.add('noimph'); }
  }
  IMP.res=out; impRender();
}
$('imp').addEventListener('click',e=>{
  if(e.target===$('imp')||e.target.closest('#impx,#impc')) return impClose();
  const c=e.target.closest('.impb'); if(c&&!IMP.busy){ if(c.dataset.act==='folder') return impPickFolder(); IMP.sel=c.dataset.id; return impRender(); }
  if(e.target.closest('#impgo')) impRun();
});
$('imp').addEventListener('change',e=>{ const o=e.target.dataset.o; if(o){ IMP.o[o]=e.target.checked; impRender(); } });
document.addEventListener('click',e=>{ if(e.target.closest('#impopen,#imphb')){ if(!$('imp').classList.contains('open')) impOpen(); } else if(e.target.closest('#imphx')){ S.settings.imp.hint=false; save(); document.body.classList.add('noimph'); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('imp').classList.contains('open')) impClose(); });
document.addEventListener('click',e=>{ const b=e.target.closest('#set .seb'); if(b){ S.settings.search.engine=b.dataset.se; save(); renderSet(); } });
document.addEventListener('input',e=>{ if(e.target.id==='secust'){ S.settings.search.custom=e.target.value.trim(); e.target.classList.toggle('bad',!seValid(S.settings.search.custom)); save(); } });
document.body.classList.toggle('noimph',S.settings.imp.hint===false||S.folders.some(f=>f.tabs.length>0&&f.tabs.some(x=>x.url)));

