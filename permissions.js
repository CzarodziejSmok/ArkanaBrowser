'use strict';
// Uprawnienia stron (kamera, mikrofon, lokalizacja, powiadomienia...). Decyzje zapisuje plik permissions.json w folderze danych.
// Polityka: tylko bezpieczne uprawnienia są przyznawane od razu, wrażliwe wymagają pytania w oknie Arkany, reszta jest odrzucana.
const fs = require('fs');

const AUTO = new Set(['clipboard-sanitized-write', 'fullscreen', 'pointerLock', 'keyboardLock', 'speaker-selection', 'mediaKeySystem']);
const ASK = new Set(['geolocation', 'media', 'notifications', 'clipboard-read', 'display-capture', 'midi', 'midiSysex', 'idle-detection', 'window-management', 'storage-access', 'top-level-storage-access', 'openExternal', 'fileSystem']);
const OWN_OK = new Set(['clipboard-read', 'clipboard-sanitized-write', 'fullscreen', 'pointerLock', 'keyboardLock']);   // własny interfejs Arkany

const keyOf = (perm, d) => { if (perm === 'media') { const t = [...((d && d.mediaTypes) || [])].sort(); return 'media:' + (t.join('+') || 'any'); } return perm; };
const originOf = u => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.origin : (x.protocol === 'file:' ? 'file://' : ''); } catch { return ''; } };

class Store {
  constructor(file) { this.file = file; this.data = {}; try { const j = JSON.parse(fs.readFileSync(file, 'utf8')); if (j && typeof j === 'object') this.data = j; } catch { /* brak pliku */ } }
  get(o, k) { return (this.data[o] || {})[k]; }
  set(o, k, v) { (this.data[o] = this.data[o] || {})[k] = v; this.save(); }
  del(o, k) { if (this.data[o]) { delete this.data[o][k]; if (!Object.keys(this.data[o]).length) delete this.data[o]; this.save(); } }
  clear() { this.data = {}; this.save(); }
  list() { return Object.keys(this.data).sort().map(origin => ({ origin, perms: Object.assign({}, this.data[origin]) })); }
  save() { try { fs.writeFileSync(this.file + '.tmp', JSON.stringify(this.data)); fs.renameSync(this.file + '.tmp', this.file); } catch { /* */ } }
}

// 'allow' | 'deny' | 'ask'
function decide(store, perm, origin, key, own) {
  if (own) return OWN_OK.has(perm) ? 'allow' : 'deny';
  if (!origin || origin === 'file://') return 'deny';
  if (AUTO.has(perm)) return 'allow';
  if (!ASK.has(perm)) return 'deny';
  const v = store.get(origin, key); if (v === 'allow' || v === 'deny') return v;
  if (perm === 'media' && key !== 'media:any') {                       // kamera + mikrofon: wystarczą zapamiętane zgody na obie części
    const vs = key.slice(6).split('+').map(p => store.get(origin, 'media:' + p));
    if (vs.every(x => x === 'allow')) return 'allow'; if (vs.some(x => x === 'deny')) return 'deny';
  }
  return 'ask';
}

// Pośrednik: pyta okno Arkany (IPC), łączy identyczne pytania i odrzuca po upływie czasu.
function broker(ipcMain, store, opts) {
  const timeout = (opts && opts.timeout) || 90000, pend = new Map(); let seq = 0;
  const remember = (origin, key, allow) => {
    const v = allow ? 'allow' : 'deny'; store.set(origin, key, v);
    if (key.startsWith('media:') && key.includes('+')) for (const p of key.slice(6).split('+')) store.set(origin, 'media:' + p, v);
  };
  const done = (id, allow, rem) => {
    const p = pend.get(id); if (!p) return; pend.delete(id); clearTimeout(p.timer);
    if (rem) remember(p.origin, p.key, allow); p.resolvers.forEach(r => r(allow));
  };
  const ask = ({ wc, origin, permission, key }) => new Promise(resolve => {
    const pk = origin + '|' + key, same = [...pend.values()].find(x => x.pk === pk); if (same) { same.resolvers.push(resolve); return; }
    const id = ++seq, p = { id, pk, origin, key, resolvers: [resolve], timer: setTimeout(() => done(id, false, false), timeout) }; pend.set(id, p);
    try { (wc.hostWebContents || wc).send('perm-ask', { id, origin, key, permission }); } catch { done(id, false, false); }
  });
  ipcMain.on('perm-answer', (_e, id, allow, rem) => done(+id, !!allow, !!rem));
  ipcMain.handle('perm-list', () => store.list());
  ipcMain.handle('perm-del', (_e, o, k) => { store.del(String(o), String(k)); return store.list(); });
  ipcMain.handle('perm-clear', () => { store.clear(); return []; });
  return ask;
}

function install(ses, store, ask) {
  const own = wc => !!wc && !wc.hostWebContents && /^file:/.test(String(wc.getURL() || ''));
  ses.setPermissionRequestHandler((wc, permission, cb, details) => {
    const origin = originOf((details && details.requestingUrl) || wc.getURL()), key = keyOf(permission, details), d = decide(store, permission, origin, key, own(wc));
    if (d === 'allow') return cb(true); if (d === 'deny') return cb(false);
    ask({ wc, origin, permission, key }).then(r => cb(!!r), () => cb(false));
  });
  // sprawdzenia synchroniczne (navigator.permissions, enumerateDevices): nierozstrzygnięte = odmowa
  ses.setPermissionCheckHandler((wc, permission, requestingOrigin, details) => {
    const origin = originOf(requestingOrigin || (details && details.requestingUrl) || (wc && wc.getURL()) || '');
    return decide(store, permission, origin, keyOf(permission, details), own(wc)) === 'allow';
  });
}
module.exports = { Store, broker, install, decide, keyOf, originOf, AUTO, ASK };
