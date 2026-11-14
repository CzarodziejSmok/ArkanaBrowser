// ---------- aktualizacje ----------
const UPD={s:null,cur:'',asked:''};
function updText(s){
  const v=s.version||'';
  switch(s.state){
    case 'checking': return t('Sprawdzanie…');
    case 'none': return t('Masz najnowszą wersję');
    case 'available': return t('Dostępna wersja {v}').replace('{v}',v);
    case 'downloading': return t('Pobieranie wersji {v}: {p}%').replace('{v}',v).replace('{p}',s.percent||0);
    case 'ready': return t('Wersja {v} jest gotowa do instalacji').replace('{v}',v);
    case 'error': return t('Nie udało się sprawdzić aktualizacji');
    case 'unconfigured': return t('Repozytorium aktualizacji nie jest skonfigurowane');
    case 'secondary': return t('Aktualizacjami zajmuje się pierwsza uruchomiona instancja');
    default: return t('Nie sprawdzano jeszcze aktualizacji');
  }
}
function updPaint(){
  const b=$('updbox'); if(!b) return; const s=UPD.s||{state:'idle',current:UPD.cur,packaged:true}, run=s.state==='checking'||s.state==='downloading';
  const btn=(k,l,dis)=>`<button class="gjbt" data-u="${k}"${dis?' disabled':''}>${t(l)}</button>`;
  b.innerHTML=`<div class="ur"><span>${esc(t('Wersja {v}').replace('{v}',s.current||UPD.cur||VERSION.slice(1)))}</span><b>${esc(updText(s))}</b></div>`
    +(s.state==='downloading'?`<div class="upg"><i style="width:${s.percent||0}%"></i></div>`:'')
    +(s.state==='error'&&s.err?`<p class="hint">${esc(s.err==='Brak opublikowanych wydań'?t(s.err):s.err)}</p>`:'')
    +(UPD.s&&s.packaged===false?`<p class="hint">${esc(t('Uruchomiono bez instalatora – nowe wersje pobierzesz ze strony wydania.'))}</p>`:'')
    +`<div class="ubt">${btn('chk','Sprawdź aktualizacje',run)}${s.state==='available'?(s.packaged?btn('dl','Pobierz'):btn('open','Otwórz stronę wydania')):''}${s.state==='ready'?btn('inst','Zainstaluj i uruchom ponownie'):''}</div>`;
}
function updPush(){ if(SEC||!window.api||!window.api.updSet) return; try{ window.api.updSet({auto:S.settings.upd.auto,dl:S.settings.upd.dl}); }catch{} }
async function updAsk(s){
  await new Promise(r=>setTimeout(r,600));
  if(await ask(t('Aktualizacja gotowa'),t('Wersja {v} została pobrana. Zainstalować teraz? Przeglądarka uruchomi się ponownie.').replace('{v}',s.version),t('Zainstaluj i uruchom ponownie'))) window.api.updInstall();
  else toast(t('Zostanie zainstalowana przy zamknięciu przeglądarki'));
}
function updSet(s){ if(!s) return; UPD.s=s; UPD.cur=s.current||UPD.cur; updPaint(); if(s.state==='ready'&&UPD.asked!==s.version){ UPD.asked=s.version; updAsk(s); } }
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-u]'); if(!b||!$('updbox')||!$('updbox').contains(b)||!window.api) return;
  const k=b.dataset.u; try{ if(k==='chk') window.api.updCheck(); else if(k==='dl') window.api.updDownload(); else if(k==='open') window.api.updOpen(); else if(k==='inst') window.api.updInstall(); }catch{} });
if(!SEC&&window.api&&window.api.onUpd){ try{ window.api.onUpd(updSet); Promise.resolve(window.api.updInfo&&window.api.updInfo()).then(updSet).catch(()=>{}); updPush(); }catch{} }

arcInit();
