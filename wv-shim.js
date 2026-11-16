'use strict';
// Skrypt panelu asystenta (claude.ai): tylko uzupełnienie API Chrome i blokada kluczy dostępu (szczegóły w weblogin.js).
// Bez wykrywania haseł i innych funkcji kart.
const { ipcRenderer, webFrame } = require('electron');
{ let c = null; try { c = ipcRenderer.sendSync('web-cfg'); } catch {}
  const inPage = js => { try { if (js) webFrame.executeJavaScript(js); } catch {} };
  if (c) { if (c.gfix) inPage(c.shim); if (!c.passkeys) inPage(c.pk); } }
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
