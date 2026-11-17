'use strict';
// Pobieranie plików: lista pobranych, kolejka (jedno pobieranie naraz, reszta czeka) i postęp wysyłany do okna, które pobiera.
// Pliki trafiają od razu do folderu „Pobrane” systemu (bez okna wyboru). Lista zwykłych okien jest zapamiętywana w downloads.json,
// pobrania z okien incognito żyją tylko w pamięci i są widoczne tylko w oknie, które je rozpoczęło.
const { app, BrowserWindow, shell, webContents } = require('electron');
const path = require('path'), fs = require('fs');
const LIMIT = 1, KEEP = 100;
const recs = [];                 // najnowsze na początku
const items = new Map();         // id -> DownloadItem (tylko trwające i czekające)
const wired = new WeakSet();
let seq = 0, file = null;

function listFile() { if (!file) file = path.join(app.getPath('userData'), 'downloads.json'); return file; }
function load() {
  try { const j = JSON.parse(fs.readFileSync(listFile(), 'utf8')); if (Array.isArray(j)) for (const r of j.slice(0, KEEP)) if (r && typeof r.id === 'string' && r.path) recs.push({ id: r.id, name: String(r.name || path.basename(r.path)), path: r.path, url: String(r.url || ''), total: +r.total || 0, received: +r.received || 0, state: 'done', inc: false, wid: 0, t: +r.t || 0 }); } catch {}
}
let saveT = null;
function persist() {
  clearTimeout(saveT);
  saveT = setTimeout(() => { try { fs.writeFileSync(listFile(), JSON.stringify(recs.filter(r => !r.inc && r.state === 'done').slice(0, KEEP))); } catch {} }, 400);
}
const pub = r => ({ id: r.id, name: r.name, path: r.path, total: r.total, received: r.received, state: r.state, inc: r.inc, t: r.t });
function send(r) {
  const p = pub(r);
  if (r.inc) { try { const wc = webContents.fromId(r.wid); if (wc && !wc.isDestroyed()) wc.send('dl-evt', p); } catch {} return; }
  for (const w of BrowserWindow.getAllWindows()) { try { if (!w.isDestroyed()) w.webContents.send('dl-evt', p); } catch {} }
}
const safeName = n => String(n || 'plik').replace(/[\\/:*?"<>|\x00-\x1f]+/g, '_').replace(/^\.+/, '_').slice(0, 180) || 'plik';
function uniquePath(dir, name) {
  const ext = path.extname(name), base = name.slice(0, name.length - ext.length); let p = path.join(dir, name), i = 1;
  while (fs.existsSync(p)) p = path.join(dir, base + ' (' + (i++) + ')' + ext);
  return p;
}
function startNext() {
  const active = recs.filter(r => r.state === 'active').length; if (active >= LIMIT) return;
  const r = [...recs].reverse().find(x => x.state === 'queued' && items.has(x.id)); if (!r) return;
  const it = items.get(r.id); r.state = 'active'; send(r);
  try { if (it.isPaused()) { if (it.canResume()) it.resume(); else { r.state = 'failed'; it.cancel(); items.delete(r.id); send(r); startNext(); } } } catch {}
}
function install(ses) {
  if (!ses || wired.has(ses)) return; wired.add(ses);
  const inc = arguments[1] === true;
  ses.on('will-download', (_e, item, wc) => {
    const host = wc && !wc.isDestroyed() ? (wc.hostWebContents || wc) : null, wid = host ? host.id : (BrowserWindow.getAllWindows()[0] || { webContents: { id: 0 } }).webContents.id;
    let dir; try { dir = app.getPath('downloads'); } catch { dir = app.getPath('userData'); }
    const name = safeName(item.getFilename()), full = uniquePath(dir, name);
    try { item.setSavePath(full); } catch {}
    const r = { id: 'd' + Date.now().toString(36) + (seq++), name: path.basename(full), path: full, url: item.getURL(), total: item.getTotalBytes() || 0, received: 0, state: 'active', inc, wid, t: Date.now() };
    recs.unshift(r); items.set(r.id, item);
    if (recs.filter(x => x.state === 'active').length > LIMIT) { r.state = 'queued'; try { item.pause(); } catch {} }
    send(r);
    let last = 0;
    item.on('updated', () => {
      r.received = item.getReceivedBytes(); r.total = item.getTotalBytes() || r.total;
      const now = Date.now(); if (now - last < 150) return; last = now; send(r);
    });
    item.once('done', (_ev, state) => {
      r.received = item.getReceivedBytes(); r.total = item.getTotalBytes() || r.total || r.received;
      r.state = state === 'completed' ? 'done' : state === 'cancelled' ? 'cancelled' : 'failed';
      try { r.path = item.getSavePath() || r.path; r.name = path.basename(r.path); } catch {}
      items.delete(r.id); if (!r.inc) persist(); send(r); startNext();
    });
  });
}
const visible = wid => recs.filter(r => !r.inc || r.wid === wid).slice(0, KEEP).map(pub);
const find = id => recs.find(r => r.id === id);
function cancel(id) { const it = items.get(id), r = find(id); if (it) { try { it.cancel(); } catch {} } else if (r && (r.state === 'queued' || r.state === 'active')) { r.state = 'cancelled'; send(r); } }
function clear(wid) {
  for (let i = recs.length - 1; i >= 0; i--) { const r = recs[i]; if ((!r.inc || r.wid === wid) && r.state !== 'active' && r.state !== 'queued') recs.splice(i, 1); }
  persist(); return visible(wid);
}
function show(id) { const r = find(id); if (!r) return; try { if (fs.existsSync(r.path)) shell.showItemInFolder(r.path); else shell.openPath(path.dirname(r.path)); } catch {} }
function open(id) { const r = find(id); if (r && fs.existsSync(r.path)) shell.openPath(r.path); }
async function icon(id) { const r = find(id); if (!r) return ''; try { const im = await app.getFileIcon(r.path, { size: 'normal' }); return im.isEmpty() ? '' : im.toDataURL(); } catch { return ''; } }
function remove(id) { const i = recs.findIndex(r => r.id === id); if (i >= 0 && recs[i].state !== 'active' && recs[i].state !== 'queued') { recs.splice(i, 1); persist(); } }
module.exports = { install, load, visible, cancel, clear, show, open, icon, remove };
