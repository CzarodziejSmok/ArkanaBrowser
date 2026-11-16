'use strict';
// Skrypt wstrzykiwany do kart (webview): wykrywa formularze logowania (zapis i wypełnianie haseł) oraz obsługuje Ctrl + kółko myszy (zoom).
// Z hostem rozmawia wyłącznie przez ipcRenderer.sendToHost; strona nie dostaje dostępu do niczego z Arkany.
const { ipcRenderer, webFrame } = require('electron');
// Logowanie Google i klucze dostępu (szczegóły w weblogin.js): skrypty dostajemy z procesu głównego i uruchamiamy w świecie strony,
// zanim wykona się jakikolwiek skrypt strony.
{ let c = null; try { c = ipcRenderer.sendSync('web-cfg'); } catch {}
  const inPage = js => { try { if (js) webFrame.executeJavaScript(js); } catch {} };
  if (c) {
    if (c.gfix) inPage(c.shim);      // API, które ma Chrome, a nie ma Electron (bez tego Google odrzuca logowanie)
    if (!c.passkeys) inPage(c.pk);   // bez systemowego okna „Zaloguj się przy użyciu klucza dostępu”
    if (c.ads) inPage(c.ads);        // blokowanie reklam w YouTube: czyszczenie odpowiedzi odtwarzacza i pomijanie reklam (adblock-page.js)
    if (c.adcss) {                   // chowanie pustych miejsc po reklamach
      const h = location.hostname, yt = /(^|\.)youtube(-nocookie)?\.com$/.test(h) && h !== 'accounts.youtube.com', css = (yt ? c.adcss.yt + '\n' : '') + c.adcss.gen;
      try { webFrame.insertCSS(css); } catch { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; (document.head || document.documentElement).appendChild(s); }); }
    }
  } }
const top = window === window.top;
const visible = el => { if (!el || el.disabled) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
const pwFields = () => [...document.querySelectorAll('input[type=password]')].filter(visible);
const userFor = pw => {
  const root = pw.form || document; let best = null;
  for (const c of root.querySelectorAll('input:not([type]),input[type=text],input[type=email],input[type=tel]')) if (visible(c) && (c.compareDocumentPosition(pw) & Node.DOCUMENT_POSITION_FOLLOWING)) best = c;
  return best;
};
const setVal = (el, v) => {
  if (!el) return; const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value'); d && d.set ? d.set.call(el, v) : (el.value = v);
  el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
};
let lastSent = 0;
function capture() {
  const pw = pwFields().find(p => p.value); if (!pw || !/^https?:$/.test(location.protocol)) return;
  const now = Date.now(); if (now - lastSent < 1500) return; lastSent = now;
  const u = userFor(pw);
  ipcRenderer.sendToHost('pw-submit', { origin: location.origin, user: u ? u.value : '', pass: pw.value });
}
if (top) {
  let announced = '';
  const announce = () => {
    const f = pwFields(); const sig = location.href + '|' + f.length; if (!f.length || announced === sig) return; announced = sig;
    ipcRenderer.sendToHost('pw-form', { origin: location.origin, hasUser: !!userFor(f[0]) });
  };
  let tm = 0; const sched = () => { clearTimeout(tm); tm = setTimeout(announce, 400); };
  document.addEventListener('DOMContentLoaded', () => { sched(); new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true }); });
  window.addEventListener('load', sched);
  document.addEventListener('submit', capture, true);
  document.addEventListener('click', e => { const b = e.target && e.target.closest && e.target.closest('button,input[type=submit],[role=button]'); if (b && pwFields().some(p => p.value)) capture(); }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target && e.target.type === 'password') capture(); }, true);
  ipcRenderer.on('pw-fill', (_e, c) => { const pw = pwFields()[0]; if (!pw || !c) return; const u = userFor(pw); if (u && c.user) setVal(u, c.user); setVal(pw, c.pass || ''); });
}
window.addEventListener('wheel', e => { if (e.ctrlKey) { e.preventDefault(); ipcRenderer.sendToHost('zoom-wheel', e.deltaY < 0 ? 1 : -1); } }, { passive: false, capture: true });
// Przyciski myszy przypisane do skrótów (środkowy i boczne; lewego i prawego nigdy nie dotykamy): proces główny sprawdza, czy ta kombinacja
// z klawiszami modyfikującymi jest przypisana, i od razu wykonuje skrót. Jeśli tak, strona nie dostaje tego kliknięcia (nie przewija się, nie cofa itp.).
{ const num = b => b === 0 ? 1 : b === 1 ? 3 : b === 2 ? 2 : b + 1;   // numeracja jak w grach: 1 lewy, 2 prawy, 3 środkowy, 4 i 5 boczne, 6… kolejne
  let last = null, eat = -1, eatT = 0;
  const ask = e => {
    const now = Date.now(); if (last && last.b === e.button && now - last.t < 80) return last.hit;   // pointerdown i mousedown to ten sam klik
    let hit = false; try { hit = !!ipcRenderer.sendSync('mouse-key', { n: num(e.button), ctrl: !!e.ctrlKey, alt: !!e.altKey, shift: !!e.shiftKey }); } catch {}
    last = { b: e.button, t: now, hit }; return hit;
  };
  const down = e => { if (e.button === 0 || e.button === 2) return; if (ask(e)) { eat = e.button; eatT = Date.now(); e.preventDefault(); e.stopImmediatePropagation(); } else eat = -1; };
  const up = e => { if (eat === e.button && Date.now() - eatT < 1500) { e.preventDefault(); e.stopImmediatePropagation(); } };
  window.addEventListener('pointerdown', down, true); window.addEventListener('mousedown', down, true);
  window.addEventListener('pointerup', up, true); window.addEventListener('mouseup', up, true); window.addEventListener('auxclick', up, true);
}
