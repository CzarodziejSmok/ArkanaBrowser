// ---------- prywatność: uprawnienia stron, hasła, blokowanie reklam ----------
S.zoom=S.zoom||{};
const pfmt=(k,m)=>t(k).replace(/\{(\w+)\}/g,(_,c)=>m[c]);
const hostOf=u=>{ try{ return new URL(u).host; }catch{ return u||''; } };
const PERM_NAMES={'media:video':'Kamera','media:audio':'Mikrofon','media:audio+video':'Kamera i mikrofon','media:any':'Kamera lub mikrofon',geolocation:'Lokalizacja',notifications:'Powiadomienia','clipboard-read':'Odczyt schowka','display-capture':'Udostępnianie ekranu',midi:'Urządzenia MIDI',midiSysex:'Urządzenia MIDI','idle-detection':'Wykrywanie bezczynności','window-management':'Zarządzanie oknami','storage-access':'Dostęp do danych strony w innych witrynach','top-level-storage-access':'Dostęp do danych strony w innych witrynach',openExternal:'Otwieranie zewnętrznych aplikacji',fileSystem:'Dostęp do plików'};
const PERM_ICONS={cam:'<path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',geolocation:'<path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',notifications:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/>','clipboard-read':'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9z"/>','display-capture':'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',x:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/>'};
const permIcon=k=>PERM_ICONS[k.startsWith('media:')?(k.includes('video')?'cam':'mic'):k]||PERM_ICONS.x;
const permName=k=>t(PERM_NAMES[k]||k);

// --- okno prośby o uprawnienie (kolejka: jedno okno naraz) ---
const PM={q:[],cur:null};
function pmShow(){
  const el=$('pm'); if(PM.cur||!PM.q.length) return; const r=PM.cur=PM.q.shift();
  el.innerHTML=`<div class="pmc"><div class="pmi"><svg viewBox="0 0 24 24">${permIcon(r.key)}</svg></div><h4>Prośba o uprawnienie</h4><p>${esc(pfmt('{s} chce uzyskać dostęp do:',{s:hostOf(r.origin)}))}</p><p class="pmn">${esc(permName(r.key))}</p><div class="pmb"><button class="pmp" data-a="allow">Zezwól</button><button data-a="once">Tylko tym razem</button><button data-a="deny">Zablokuj</button></div><small>Zezwól i Zablokuj zapamiętują decyzję dla tej strony. Zmienisz ją w Ustawienia → Prywatność.</small></div>`;
  el.classList.add('open');
}
function pmAnswer(a){
  const r=PM.cur; if(!r) return; PM.cur=null; $('pm').classList.remove('open');
  try{ window.api.permAnswer(r.id,a==='allow'||a==='once',a==='allow'||a==='deny'); }catch{}
  setTimeout(pmShow,120);
}
$('pm').addEventListener('click',e=>{ const b=e.target.closest('[data-a]'); if(b) return pmAnswer(b.dataset.a); if(e.target===$('pm')) pmAnswer('close'); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&PM.cur) pmAnswer('close'); });
try{ window.api.onPermAsk(r=>{ PM.q.push(r); pmShow(); }); }catch(e){ console.warn('Zły preload.js (uprawnienia)',e); }

// --- hasła: paski zapisu i wypełniania ---
function pwHide(){ $('pwbar').classList.remove('open'); $('pwbar').innerHTML=''; }
function pwBar(text,btns){
  const b=$('pwbar'); b.innerHTML=`<span class="pwt">${esc(text)}</span>`+btns.map((x,i)=>`<button data-i="${i}"${x.p?' class="pwp"':''}>${esc(x.l)}</button>`).join('')+'<button class="pwx" data-i="x" title="Zamknij">×</button>';
  b.classList.add('open'); b.onclick=e=>{ const k=e.target.closest('button'); if(!k) return; pwHide(); const i=k.dataset.i; if(i!=='x') btns[+i].f(); };
}
async function privGuest(tab,w,e){
  const a=e.args&&e.args[0];
  if(e.channel==='zoom-wheel'){ if(T()===tab) zoomStep(+a); return; }
  if(!S.settings.pw.on||T()!==tab||!a||typeof a.origin!=='string') return;
  let st; try{ st=await window.api.vaultState(a.origin); }catch{ return; } if(!st||!st.available) return;
  if(e.channel==='pw-form'){
    if(!st.entries.length) return;
    pwBar(pfmt('Wypełnić dane logowania w {h}?',{h:hostOf(a.origin)}),st.entries.map(x=>({l:st.entries.length>1?(x.user||t('brak nazwy')):t('Wypełnij'),p:true,f:async()=>{ const c=await window.api.vaultFill(x.id,a.origin); if(c) w.send('pw-fill',c); }})));
  } else if(e.channel==='pw-submit'){
    if(st.never||!a.pass) return; const user=String(a.user||''), same=st.entries.find(x=>x.user===user);
    if(same){ const cur=await window.api.vaultFill(same.id,a.origin); if(cur&&cur.pass===a.pass) return; }
    const h=hostOf(a.origin), who=user||t('brak nazwy');
    pwBar(same?pfmt('Zaktualizować hasło dla {u} w {h}?',{u:who,h}):pfmt('Zapisać hasło dla {u} w {h}?',{u:who,h}),[
      {l:same?t('Aktualizuj'):t('Zapisz'),p:true,f:()=>{ window.api.vaultSave({origin:a.origin,user,pass:a.pass}).then(()=>{ if(setTab==='priv') privRefresh(); }); }},
      ...(same?[]:[{l:t('Nigdy dla tej strony'),f:()=>window.api.vaultNever(a.origin)}])]);
  }
}

// --- zakładka Prywatność w ustawieniach ---
const PRIV={perms:[],logins:[],avail:true,stats:{count:0},rev:null};
async function privRefresh(){
  try{ PRIV.perms=await window.api.permList(); const v=await window.api.vaultList(); PRIV.logins=v.logins; PRIV.avail=v.available; PRIV.stats=await window.api.adblockStats(); }catch{}
  if(setTab==='priv'&&$('set').classList.contains('open')) renderPrivTab(true);
}
function renderPrivTab(noRefresh){
  const sc=$('set').scrollTop, A=S.settings.adblock, P=S.settings.pw;
  const perms=PRIV.perms.length?PRIV.perms.map(p=>`<div class="pvr"><b>${esc(hostOf(p.origin))}</b><div class="pvc">${Object.keys(p.perms).map(k=>`<span class="pvchip ${p.perms[k]}"><i>${p.perms[k]==='allow'?'✓':'✕'}</i>${esc(permName(k))}<button data-pdel="${esc(p.origin)}" data-k="${esc(k)}" title="Usuń decyzję">×</button></span>`).join('')}</div></div>`).join(''):'<p class="hint">Brak zapamiętanych decyzji.</p>';
  const logins=!PRIV.avail?'<p class="hint warn">Szyfrowanie systemowe jest niedostępne. Sejf haseł nie działa.</p>':PRIV.logins.length?PRIV.logins.map(l=>`<div class="pvr"><b>${esc(hostOf(l.origin))}</b><span class="pvu">${esc(l.user||t('brak nazwy'))}${PRIV.rev&&PRIV.rev.id===l.id?` · <code>${esc(PRIV.rev.pass)}</code>`:''}</span><div class="pvb"><button data-vrev="${l.id}">Pokaż</button><button data-vcopy="${l.id}">Kopiuj</button><button data-vdel="${l.id}">Usuń</button></div></div>`).join(''):'<p class="hint">Brak zapisanych haseł.</p>';
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">x</button></div>${tabsHtml()}
  <h5>BLOKOWANIE REKLAM</h5>
  <label class="ck"><input type="checkbox" id="abon" ${A.on?'checked':''}><span class="tg"></span>Blokuj reklamy i śledzące skrypty</label>
  <p class="hint">Blokuje żądania do znanych sieci reklamowych i trackerów, gdy pochodzą z innej witryny. To proste filtrowanie po domenach: nie usuwa reklam wbudowanych w stronę (np. w YouTube).</p>
  <p class="hint">${esc(pfmt('Zablokowano w tej sesji: {n}',{n:PRIV.stats.count||0}))}</p>
  <h5>UPRAWNIENIA STRON</h5><p class="hint">Strony pytają o dostęp do kamery, mikrofonu, lokalizacji i innych funkcji. Tu zmienisz zapamiętane decyzje.</p>${perms}
  ${PRIV.perms.length?'<div class="br"><button id="pclr">Wyczyść wszystkie</button></div>':''}
  <h5>HASŁA</h5>
  <label class="ck"><input type="checkbox" id="pwon" ${P.on?'checked':''}><span class="tg"></span>Proponuj zapisywanie haseł</label>
  <p class="hint">Hasła są szyfrowane przez system Windows. Chroni to plik przed odczytem z innego konta lub komputera, ale nie przed osobą korzystającą z Twojej sesji.</p>${logins}
  ${PRIV.logins.length?'<div class="br"><button id="vclr">Usuń wszystkie</button></div>':''}`;
  $('set').scrollTop=sc; if(!noRefresh) privRefresh();
}
document.addEventListener('change',e=>{
  if(e.target.id==='abon'){ S.settings.adblock.on=e.target.checked; try{ window.api.adblockSet(e.target.checked); }catch{} save(); }
  else if(e.target.id==='pwon'){ S.settings.pw.on=e.target.checked; save(); if(!e.target.checked) pwHide(); }
});
document.addEventListener('click',async e=>{
  const g=e.target.closest&&e.target.closest('#set [data-pdel],#set [data-vrev],#set [data-vcopy],#set [data-vdel],#set #pclr,#set #vclr'); if(!g) return;
  try{
    if(g.dataset.pdel!==undefined){ PRIV.perms=await window.api.permDel(g.dataset.pdel,g.dataset.k); }
    else if(g.id==='pclr'){ if(await ask('Wyczyścić zapamiętane uprawnienia?','Strony znów będą pytać o dostęp.','Wyczyść')) PRIV.perms=await window.api.permClear(); else return; }
    else if(g.dataset.vrev){ const p=await window.api.vaultReveal(g.dataset.vrev); PRIV.rev=p==null?null:{id:g.dataset.vrev,pass:p}; setTimeout(()=>{ PRIV.rev=null; if(setTab==='priv') renderPrivTab(true); },8000); }
    else if(g.dataset.vcopy){ const p=await window.api.vaultReveal(g.dataset.vcopy); if(p!=null) await navigator.clipboard.writeText(p); return; }
    else if(g.dataset.vdel){ PRIV.logins=(await window.api.vaultDel(g.dataset.vdel)); }
    else if(g.id==='vclr'){ if(await ask('Usunąć wszystkie zapisane hasła?','Tej operacji nie da się cofnąć.','Usuń')) PRIV.logins=await window.api.vaultClear(); else return; }
  }catch{}
  renderPrivTab(true);
});
try{ window.api.adblockSet(S.settings.adblock.on); }catch{}
