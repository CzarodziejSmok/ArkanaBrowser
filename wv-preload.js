'use strict';
// Skrypt wstrzykiwany do kart (webview): wykrywa formularze logowania (zapis i wypełnianie haseł) oraz obsługuje Ctrl + kółko myszy (zoom).
// Z hostem rozmawia wyłącznie przez ipcRenderer.sendToHost; strona nie dostaje dostępu do niczego z Arkany.
const { ipcRenderer } = require('electron');
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
