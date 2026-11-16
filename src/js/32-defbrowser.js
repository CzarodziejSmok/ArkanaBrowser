// ---------- przeglądarka domyślna (Ustawienia → System) ----------
// Windows nie pozwala programowi samemu zostać przeglądarką domyślną: Arkana rejestruje się jako przeglądarka i otwiera Ustawienia Windows,
// w których użytkownik ją wybiera. Status odczytujemy z systemu (proces główny, defaultbrowser.js).
let defBusy=false;
async function defPaint(){
  const el=$('defst'); if(!el) return;
  el.classList.remove('okk'); el.textContent=t('Sprawdzam…');
  let r=null; try{ r=await window.api.defaultBrowser('status'); }catch{}
  const st=$('defst'); if(!st) return;   // w międzyczasie zakładka mogła się zmienić
  const hint=$('defhint'), btn=$('defset');
  if(!r||!r.supported){ st.textContent=t('Ta funkcja nie jest dostępna w tym oknie.'); if(btn) btn.disabled=true; return; }
  st.textContent=r.isDefault?t('Arkana jest teraz przeglądarką domyślną ✓'):t('Arkana nie jest przeglądarką domyślną.'); st.classList.toggle('okk',!!r.isDefault);
  if(hint) hint.textContent=r.win?t('Windows nie pozwala programom samodzielnie zmienić przeglądarki domyślnej. Po kliknięciu Arkana zarejestruje się w systemie jako przeglądarka i otworzą się Ustawienia Windows, w których wybierz Arkana Browser dla HTTP i HTTPS. Po wybraniu linki z innych programów będą otwierać się w Arkanie.'):t('Ustawia Arkanę jako domyślną przeglądarkę w systemie.');
}
async function defSet(){
  if(defBusy) return; defBusy=true;
  try{ const r=await window.api.defaultBrowser('set'); if(r&&r.ok===false) toast(t('Nie udało się zarejestrować Arkany w systemie.')); }catch{ toast(t('Nie udało się zarejestrować Arkany w systemie.')); }
  defBusy=false; defPaint();
}
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#defset')) defSet(); });
addEventListener('focus',()=>{ if(setTab==='sys'&&$('set').classList.contains('open')) defPaint(); });   // po powrocie z Ustawień Windows odświeżamy status
