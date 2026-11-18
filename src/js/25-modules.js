// ---------- moduły opcjonalne (v49.9) ----------
// Panel aplikacji i gry (pliki src/js/10–15 i 17–20, składane do js/apps.js) jest modułem: ładuje się dopiero wtedy, gdy jest włączony (Ustawienia → Aplikacje albo
// Ustawienia → System → Moduły; to ten sam przełącznik S.settings.apps.on). Wyłączony moduł nie jest wczytywany przy starcie: nie zajmuje pamięci, nie ma pętli ani
// nasłuchiwaczy w tle i nie dodaje niczego do interfejsu. Włączenie wczytuje go od razu; wyłączenie zamyka okna aplikacji i ukrywa pasek, a pełna oszczędność
// (kod nie jest wczytywany) następuje po ponownym uruchomieniu. Okna oderwane i incognito mają apps.on=false (aplikacje zostają w oknie głównym), więc go nie wczytują.
// Funkcje renderBar, renderApps, toggleAdd i openApp są tu zaślepkami; js/apps.js po wczytaniu zastępuje je właściwymi (ta sama nazwa funkcji w skrypcie globalnym).
let toastT;
function toast(m){ const e=$('toast'); e.textContent=m; e.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>e.classList.remove('show'),2300); }
const MOD={apps:{state:0,file:'js/apps.js',q:[]}};   // state: 0 = niewczytany, 1 = wczytywanie, 2 = gotowy, −1 = błąd
function modLoad(name,cb){
  const m=MOD[name]; if(!m){ if(cb) cb(false); return; }
  if(m.state===2){ if(cb) cb(true); return; }
  if(cb) m.q.push(cb);
  if(m.state===1) return; m.state=1;
  const fin=ok=>{ m.state=ok?2:-1; m.q.splice(0).forEach(f=>{ try{ f(ok); }catch(e){ console.warn(e); } }); };
  try{ const s=document.createElement('script'); s.src=m.file;
    s.onload=()=>{ try{ if(name==='apps'&&typeof appsInit==='function') appsInit(); }catch(e){ console.warn('moduł aplikacji',e); } fin(true); };
    s.onerror=()=>fin(false); document.head.appendChild(s); }catch{ fin(false); }
}
const appsOn=()=>!!(S.settings.apps&&S.settings.apps.on);
function appsBoot(){ renderBar(); if(appsOn()) modLoad('apps'); }
function appsRefreshTab(){ try{ if(typeof setTab!=='undefined'&&(setTab==='apps'||setTab==='sys')&&$('set')&&$('set').classList.contains('open')) renderSet(); }catch{} }
function appsSet(on){
  S.settings.apps.on=!!on; save();
  if(!on){ if(MOD.apps.state===2){ try{ [...document.querySelectorAll('.aw')].forEach(w=>closeApp(w.dataset.app)); }catch{} } renderBar(); return; }
  renderBar();
  modLoad('apps',ok=>{ if(!ok){ toast(t('Nie udało się wczytać modułu aplikacji.')); return; } renderBar(); appsRefreshTab(); });
}
function renderBar(){ document.body.classList.toggle('noapps',!appsOn()||MOD.apps.state!==2); const r=$('rl'); if(r&&MOD.apps.state!==2) r.innerHTML=''; }
function toggleAdd(){}
function openApp(){ toast(t('Moduł aplikacji jest wyłączony. Włącz go w ustawieniach (Moduły), aby korzystać z aplikacji i gier.')); }
function renderApps(){
  const on=appsOn(), st=MOD.apps.state;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>PASEK APLIKACJI</h5>
  <label class="ck"><input type="checkbox" id="appson" ${on?'checked':''}><span class="tg"></span>Pokaż pasek aplikacji</label>
  <p class="hint">${esc(on?(st===-1?t('Nie udało się wczytać modułu aplikacji.'):t('Wczytywanie aplikacji…')):t('Moduł aplikacji jest wyłączony. Włącz go w ustawieniach (Moduły), aby korzystać z aplikacji i gier.'))}</p>`;
}
